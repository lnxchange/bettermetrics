import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ArticleGate } from '@/lib/publishing/gate'
import { PublishingConfig } from '@/lib/publishing/config'
import { GateConfig } from '@/lib/publishing/types'

const LIST_COLUMNS =
  'id, slug, title, content, meta_description, meta_title, author, published_at, scheduled_publish_at, updated_at, created_at, written_at, category, tags, featured_image_url, feature_image, image_alt, status, pipeline, editorial_status, preview_only, canonical_url, structured_data, source_papers, treatise_refs, replaces_slugs'

export interface ArticleRecord {
  id: string
  slug: string
  title: string
  content: string
  meta_description: string | null
  meta_title: string | null
  author: string | null
  published_at: string | null
  scheduled_publish_at: string | null
  updated_at: string | null
  created_at: string | null
  written_at: string | null
  category: string | null
  tags: string[] | null
  featured_image_url: string | null
  feature_image: string | null
  image_alt: string | null
  status: string | null
  pipeline: string | null
  editorial_status: string | null
  preview_only: boolean | null
  canonical_url: string | null
  structured_data: unknown
  source_papers: string[] | null
  treatise_refs: string[] | null
  replaces_slugs: string[] | null
}

/** Service role for the sync, the cron and the retirement redirect. */
export class PublishingDb {
  static service(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }

  static anon(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }
}

/** The public list, after the go-live gate. Preview rows never appear. */
export class PublicArticles {
  static async list(config: GateConfig = PublishingConfig.gate(process.env, new Date())) {
    const supabase = PublishingDb.anon()
    if (!supabase) return []
    const { data, error } = await supabase.from('articles').select(LIST_COLUMNS)
    if (error) throw new Error(error.message)
    return ((data ?? []) as ArticleRecord[])
      .filter(row => ArticleGate.isPublic(ArticleGate.fromRow(row), config))
      .sort((a, b) => PublicArticles.when(b) - PublicArticles.when(a))
  }

  static when(row: { published_at?: string | null; scheduled_publish_at?: string | null }) {
    const raw = row.published_at || row.scheduled_publish_at
    if (!raw) return 0
    const time = new Date(raw).getTime()
    return Number.isNaN(time) ? 0 : time
  }
}

/**
 * 301 target for a legacy article once retirement is on. Returns null when
 * the switch is off, the clock is still before go-live, or the slug was
 * never a published legacy article.
 */
export class LegacyRedirect {
  static async target(slug: string) {
    const supabase = PublishingDb.service()
    if (!supabase) return null
    const now = new Date()
    const preliminary = PublishingConfig.flags(process.env)
    if (now.getTime() < preliminary.goLiveAt.getTime()) return null
    if (process.env.ARTICLE_LEGACY_RETIREMENT === 'false') return null
    const { data: settings } = await supabase
      .from('publishing_settings')
      .select('go_live_at, publishing_paused, legacy_retirement, syndication_enabled')
      .eq('id', 1)
      .maybeSingle()
    const config = PublishingConfig.gate(process.env, now, settings)
    if (!ArticleGate.legacyRetirementActive(config)) return null
    const { data } = await supabase
      .from('articles')
      .select('slug, pipeline, status, preview_only, editorial_status, scheduled_publish_at')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return null
    const article = ArticleGate.fromRow(data)
    if (article.pipeline === 'corpus' || article.status !== 'published' || article.previewOnly) return null
    const { data: replacements } = await supabase
      .from('articles')
      .select('slug, pipeline, status, preview_only, editorial_status, scheduled_publish_at, replaces_slugs')
      .contains('replaces_slugs', [slug])
    const match = ((replacements ?? []) as ArticleRecord[]).find(row =>
      ArticleGate.isPublic(ArticleGate.fromRow(row), config)
    )
    const path = ArticleGate.retirementTarget(match?.slug ?? null)
    return path === `/articles/${slug}` ? null : path
  }
}
