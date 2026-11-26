/**
 * Upsert aim-treatise website/articles into the articles table.
 *
 *   ARTICLES_DIR=/path/to/website/articles npx tsx scripts/sync-articles.ts
 *   npx tsx scripts/sync-articles.ts --seeds
 *   npx tsx scripts/sync-articles.ts --dry-run
 *
 * --seeds also loads the two preview-only test articles. They are marked TEST
 * and cannot become public. The run matches on slug, skips unchanged rows,
 * and never deletes. It does not mark anything published.
 *
 * Conflict rule. content_hash is "<file sha256>.<body sha256>". The file half
 * is the raw markdown last applied. The body half is title, summary and body
 * as written by that sync. Saving or approving in the app does not change
 * content_hash.
 *
 * - The same file is a quiet skip. Nothing is written.
 * - A changed file is applied only when the row is still a draft and its
 *   title, summary and body still match the body half. The stored slot stays.
 * - A changed file is a conflict when the row was edited in the app (the body
 *   half no longer matches) or editorial_status is approved. The body, the
 *   approval and the slot are left as they are, and the run prints
 *   "conflict <slug>: ...". Conflicts do not fail the run. A file that cannot
 *   be parsed still does.
 */
import { config as loadEnv } from 'dotenv'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { PublishingConfig } from '../lib/publishing/config'
import { ArticleLoader, SourceFile, StoredArticle } from '../lib/publishing/loader'
import { PublishingDb } from '../lib/publishing/public'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

const COLUMN =
  'slug, title, meta_description, content, status, scheduled_publish_at, content_hash, pipeline, preview_only, editorial_status'

async function filesIn(dir: string, previewOnly: boolean) {
  let names: string[]
  try {
    names = await readdir(dir)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return []
    throw error
  }
  const files: SourceFile[] = []
  for (const name of names.sort()) {
    if (!name.endsWith('.md') || name.toLowerCase() === 'readme.md') continue
    files.push({
      name,
      raw: await readFile(path.join(dir, name), 'utf8'),
      previewOnly
    })
  }
  return files
}

async function main() {
  const seeds = process.argv.includes('--seeds')
  const dryRun = process.argv.includes('--dry-run')
  const articlesDir = process.env.ARTICLES_DIR || path.join(process.cwd(), 'website/articles')
  const files = [
    ...(await filesIn(articlesDir, false)),
    ...(seeds ? await filesIn(path.join(process.cwd(), 'content/publishing/preview'), true) : [])
  ]
  if (files.length === 0) {
    console.log(`articles: nothing to sync (looked in ${articlesDir}${seeds ? ' and the preview seeds' : ''})`)
    return
  }

  const flags = PublishingConfig.flags(process.env)
  const supabase = PublishingDb.service()
  let stored: StoredArticle[] = []
  if (supabase) {
    const { data, error } = await supabase.from('articles').select(COLUMN).eq('pipeline', 'corpus')
    if (error) throw new Error(error.message)
    stored = (data ?? []).map(row => ({
      slug: String(row.slug),
      status: row.status ?? null,
      scheduledPublishAt: row.scheduled_publish_at ?? null,
      contentHash: row.content_hash ?? null,
      pipeline: row.pipeline ?? null,
      previewOnly: row.preview_only === true,
      editorialStatus: row.editorial_status ?? null,
      title: row.title ?? null,
      summary: row.meta_description ?? null,
      content: row.content ?? null
    }))
  } else if (!dryRun) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }

  const plan = ArticleLoader.plan(files, stored, new Date(), flags.goLiveAt, flags.publishingPaused)
  const writing = plan.upserts.filter(row => row.changed)
  console.log(
    `articles: ${files.length} files, ${writing.length} to write, ${plan.conflicts.length} conflicts, ${plan.upserts.length - writing.length - plan.conflicts.length} unchanged, ${plan.errors.length} unreadable`
  )
  for (const row of plan.upserts) {
    const when = row.scheduled_publish_at ? row.scheduled_publish_at : 'no slot'
    console.log(`  ${row.changed ? 'write' : 'keep '} ${row.slug} ${row.editorial_status} ${row.preview_only ? 'preview' : row.status} ${when}`)
  }
  for (const conflict of plan.conflicts) {
    console.log(`  conflict ${conflict.slug}: ${conflict.reason}, file not applied`)
  }
  for (const error of plan.errors) console.error(`  error ${error}`)

  if (!dryRun && writing.length > 0 && supabase) {
    const payload = writing.map(row => {
      const { changed, reason, ...article } = row
      void changed
      void reason
      return article
    })
    const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' })
    if (error) throw new Error(error.message)
  }

  if (plan.errors.length > 0) process.exitCode = 1
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Article sync failed')
  process.exitCode = 1
})
