/**
 * scripts/seo/fix-articles.ts
 *
 * The one "auto-apply" step of the monitor. Finds published articles whose
 * search metadata is missing or unusable and fills it with
 * `optimizeArticleSEO` from lib/seo-optimizer.ts (Claude). Writes
 * meta_title, meta_description, structured_data and seo_optimized_at back to
 * Supabase. Never touches title, content or publication state.
 *
 * Selection: status = 'published' AND (
 *   meta_title IS NULL OR meta_description IS NULL OR
 *   structured_data IS NULL OR seo_optimized_at IS NULL OR
 *   meta_title looks like a filename (e.g. "report_6_1_corporate_dispute")
 * )
 *
 * Safety:
 *   - Dry run by default. Pass `--apply` (or SEO_FIX_APPLY=true in CI) to write.
 *   - Heuristic fallbacks from the optimizer (`generated: false`) are never
 *     persisted; the article is left for the next run and reported instead.
 *   - `--limit N` caps the number of articles per run (default 15) so a bad
 *     model day cannot rewrite everything at once.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY.
 * Output: seo-output/fixes.json (consumed by ping.ts and report.ts)
 */
import { createClient } from '@supabase/supabase-js'
import { optimizeArticleSEO, SEO_MODEL } from '../../lib/seo-optimizer'
import { SITE_URL, argValue, hasFlag, sleep, writeJson } from './lib'

interface ArticleRow {
  id: string
  title: string
  slug: string
  content: string
  author: string | null
  category: string | null
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  structured_data: unknown
  seo_optimized_at: string | null
}

export interface FixRecord {
  slug: string
  url: string
  title: string
  reason: string[]
  applied: boolean
  before: { metaTitle: string | null; metaDescription: string | null }
  after?: { metaTitle: string; metaDescription: string }
  error?: string
}

export interface FixesOutput {
  ranAt: string
  mode: 'dry-run' | 'apply'
  model: string
  candidates: number
  applied: number
  skipped: number
  failed: number
  records: FixRecord[]
}

const FILENAME_LIKE = /^[\w-]+$/

function reasonsFor(row: ArticleRow): string[] {
  const reasons: string[] = []
  if (!row.meta_title) reasons.push('meta_title missing')
  else if (FILENAME_LIKE.test(row.meta_title.trim())) reasons.push('meta_title is filename-like')
  if (!row.meta_description) reasons.push('meta_description missing')
  if (!row.structured_data) reasons.push('structured_data missing')
  if (!row.seo_optimized_at) reasons.push('never optimised')
  return reasons
}

async function main() {
  const apply = hasFlag('--apply') || process.env.SEO_FIX_APPLY === 'true'
  const limit = Number(argValue('--limit') || process.env.SEO_FIX_LIMIT || 15)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  if (apply && !process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY (required with --apply)')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, author, category, published_at, meta_title, meta_description, structured_data, seo_optimized_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Supabase query failed:', error.message)
    process.exit(1)
  }

  const candidates = (data as ArticleRow[]).filter(row => reasonsFor(row).length > 0)
  console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${candidates.length} of ${data?.length ?? 0} published articles need metadata (model ${SEO_MODEL}, limit ${limit})`)

  const records: FixRecord[] = []
  let applied = 0
  let skipped = 0
  let failed = 0

  for (const row of candidates.slice(0, limit)) {
    const record: FixRecord = {
      slug: row.slug,
      url: `${SITE_URL}/articles/${row.slug}`,
      title: row.title,
      reason: reasonsFor(row),
      applied: false,
      before: { metaTitle: row.meta_title, metaDescription: row.meta_description }
    }
    records.push(record)
    console.log(`\n- ${row.slug}\n  ${record.reason.join(', ')}`)

    if (!apply) continue

    try {
      const result = await optimizeArticleSEO({
        title: row.title,
        content: row.content,
        slug: row.slug,
        author: row.author || undefined,
        category: row.category || undefined,
        publishedAt: row.published_at || undefined
      })

      if (!result.generated) {
        record.error = 'optimizer returned heuristic fallback; not persisted'
        skipped++
        console.log(`  skipped: ${record.error}`)
        continue
      }

      const { error: updateError } = await supabase
        .from('articles')
        .update({
          meta_title: result.metaTitle,
          meta_description: result.metaDescription,
          structured_data: result.structuredData,
          seo_optimized_at: new Date().toISOString()
        })
        .eq('id', row.id)
      if (updateError) throw updateError

      record.applied = true
      record.after = { metaTitle: result.metaTitle, metaDescription: result.metaDescription }
      applied++
      console.log(`  title: ${result.metaTitle}\n  desc:  ${result.metaDescription}`)
    } catch (err) {
      record.error = err instanceof Error ? err.message : String(err)
      failed++
      console.log(`  FAILED: ${record.error}`)
    }

    await sleep(1500)
  }

  const output: FixesOutput = {
    ranAt: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    model: SEO_MODEL,
    candidates: candidates.length,
    applied,
    skipped,
    failed,
    records
  }
  writeJson('fixes.json', output)
  const beyondLimit = Math.max(0, candidates.length - limit)
  console.log(
    `\n${apply ? 'Applied' : 'Would apply'} ${apply ? applied : records.length}, skipped ${skipped}, failed ${failed}` +
      `${beyondLimit ? `, ${beyondLimit} left for the next run` : ''}. Written to seo-output/fixes.json`
  )
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
