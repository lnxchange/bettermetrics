export type EditorialStatus = 'draft' | 'approved' | 'retired'
export type ArticlePipeline = 'legacy' | 'corpus'
export type PublicationStatus = 'draft' | 'scheduled' | 'published'

/** A row reduced to the fields the public gate needs. */
export interface GateArticle {
  pipeline: ArticlePipeline
  status: string | null
  editorialStatus: string | null
  scheduledPublishAt: Date | null
  previewOnly: boolean
}

/** Clock and switches. The go-live instant defaults to 11 January 2027, Melbourne. */
export interface GateConfig {
  now: Date
  goLiveAt: Date
  publishingPaused: boolean
  legacyRetirement: boolean
}

export interface PublishingFlags {
  goLiveAt: Date
  publishingPaused: boolean
  legacyRetirement: boolean
  syndicationEnabled: boolean
}
