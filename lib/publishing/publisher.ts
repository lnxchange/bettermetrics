import { GateConfig } from '@/lib/publishing/types'

export interface PublishCandidate {
  id: string
  slug: string
  pipeline: string | null
  status: string | null
  editorialStatus: string | null
  scheduledPublishAt: Date | null
  previewOnly: boolean
}

/**
 * The cron's decision. Before go-live, and while the kill switch is on,
 * the result is empty. No row is moved to published.
 */
export class ArticlePublisher {
  static heldReason(config: GateConfig) {
    if (config.now.getTime() < config.goLiveAt.getTime()) return 'before-go-live'
    if (config.publishingPaused) return 'paused'
    return null
  }

  static due(articles: PublishCandidate[], config: GateConfig) {
    if (ArticlePublisher.heldReason(config)) return []
    return articles.filter(article => {
      if (article.pipeline !== 'corpus' || article.previewOnly) return false
      if (article.editorialStatus !== 'approved') return false
      if (article.status === 'published') return false
      if (!article.scheduledPublishAt) return false
      return article.scheduledPublishAt.getTime() <= config.now.getTime()
    })
  }
}
