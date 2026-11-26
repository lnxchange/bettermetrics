import { GateArticle, GateConfig } from '@/lib/publishing/types'

/**
 * What a visitor is allowed to see.
 *
 * Corpus articles are public only when they are approved, their slot has
 * arrived, and the clock is on or after go-live. The kill switch holds them
 * back. Preview articles are never public.
 *
 * The March 2026 articles stay public until go-live and, after that, until
 * the retirement switch is on. The switch does nothing before go-live.
 */
export class ArticleGate {
  static fromRow(row: {
    pipeline?: string | null
    status?: string | null
    editorial_status?: string | null
    scheduled_publish_at?: string | null
    preview_only?: boolean | null
  }): GateArticle {
    const scheduled = row.scheduled_publish_at ? new Date(row.scheduled_publish_at) : null
    return {
      pipeline: row.pipeline === 'corpus' ? 'corpus' : 'legacy',
      status: row.status ?? null,
      editorialStatus: row.editorial_status ?? null,
      scheduledPublishAt: scheduled && !Number.isNaN(scheduled.getTime()) ? scheduled : null,
      previewOnly: row.preview_only === true
    }
  }

  static legacyRetirementActive(config: GateConfig) {
    return config.legacyRetirement && config.now.getTime() >= config.goLiveAt.getTime()
  }

  static isPublic(article: GateArticle, config: GateConfig) {
    if (article.previewOnly) return false
    if (article.pipeline !== 'corpus') {
      if (article.status !== 'published') return false
      if (ArticleGate.legacyRetirementActive(config)) return false
      return true
    }
    if (config.publishingPaused) return false
    if (article.editorialStatus !== 'approved') return false
    if (!article.scheduledPublishAt) return false
    if (article.scheduledPublishAt.getTime() > config.now.getTime()) return false
    if (config.now.getTime() < config.goLiveAt.getTime()) return false
    return true
  }

  /**
   * The admin publish button may still release a legacy draft. It may not
   * push a corpus article or a preview article onto the public site early.
   */
  static blocksManualPublish(article: GateArticle, config: GateConfig) {
    if (article.previewOnly) return true
    if (article.pipeline !== 'corpus') return false
    if (config.publishingPaused) return true
    if (config.now.getTime() < config.goLiveAt.getTime()) return true
    if (article.editorialStatus !== 'approved') return true
    if (!article.scheduledPublishAt || article.scheduledPublishAt.getTime() > config.now.getTime()) return true
    return false
  }

  /** Where a retired legacy URL should send the reader. */
  static retirementTarget(replacementSlug: string | null) {
    if (replacementSlug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(replacementSlug)) {
      return `/articles/${replacementSlug}`
    }
    return '/articles'
  }
}
