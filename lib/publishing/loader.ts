import { ArticleFrontmatter, ParsedArticle } from '@/lib/publishing/frontmatter'
import { ArticleGate } from '@/lib/publishing/gate'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { ArticleSchedule, ScheduleItem, SlotAssignment } from '@/lib/publishing/schedule'
import { PublicationStatus } from '@/lib/publishing/types'
import { SITE_AUTHOR } from '@/lib/site'

export interface SourceFile {
  name: string
  raw: string
  previewOnly: boolean
}

export interface StoredArticle {
  slug: string
  status: string | null
  scheduledPublishAt: string | null
  contentHash: string | null
  pipeline: string | null
  previewOnly: boolean
  editorialStatus: string | null
}

export interface ArticleUpsert {
  slug: string
  title: string
  content: string
  meta_description: string
  tags: string[]
  editorial_status: ParsedArticle['status']
  pipeline: 'corpus'
  preview_only: boolean
  scheduled_publish_at: string | null
  status: PublicationStatus
  featured_image_url: string | null
  feature_image: string | null
  image_alt: string | null
  source_papers: string[]
  treatise_refs: string[]
  replaces_slugs: string[]
  content_hash: string
  author: string
  changed: boolean
  reason: SlotAssignment['reason']
}

/**
 * Idempotent plan for website/articles. Rows are matched on slug. Nothing is
 * deleted. The loader never marks a row published: the cron does that, and
 * only after go-live. A preview file is forced to draft.
 */
export class ArticleLoader {
  static plan(files: SourceFile[], stored: StoredArticle[], now: Date, goLiveAt: Date, paused: boolean) {
    const errors: string[] = []
    const parsed: { raw: string; article: ParsedArticle; previewOnly: boolean }[] = []
    for (const file of files) {
      const result = ArticleFrontmatter.parse(file.raw, file.name)
      if (!result.ok) {
        errors.push(`${file.name}: ${result.error}`)
        continue
      }
      parsed.push({ raw: file.raw, article: result.article, previewOnly: file.previewOnly })
    }

    const parsedSlugs = new Set(parsed.map(item => item.article.slug))
    const items: ScheduleItem[] = parsed.map(item => {
      const previous = stored.find(row => row.slug === item.article.slug)
      return {
        slug: item.article.slug,
        editorialStatus: item.article.status,
        explicitPublishAt: item.article.publishAt,
        existingSlot: ArticleLoader.storedSlot(previous),
        previewOnly: item.previewOnly
      }
    })

    for (const row of stored) {
      if (parsedSlugs.has(row.slug)) continue
      if (row.pipeline !== 'corpus' || row.previewOnly) continue
      if (row.editorialStatus !== 'approved') continue
      const slot = ArticleLoader.storedSlot(row)
      if (!slot || !MelbourneTime.isSlot(slot) || slot.getTime() < goLiveAt.getTime()) continue
      items.push({
        slug: row.slug,
        editorialStatus: 'approved',
        explicitPublishAt: null,
        existingSlot: slot,
        previewOnly: false
      })
    }

    const assignments = ArticleSchedule.assign(items, now, goLiveAt)
    const bySlug = new Map(assignments.map(item => [item.slug, item]))
    const upserts: ArticleUpsert[] = parsed.map(item => {
      const assignment = bySlug.get(item.article.slug)
      const previous = stored.find(row => row.slug === item.article.slug)
      const slot = assignment?.slot ?? null
      const status = ArticleLoader.publicationStatus({
        previewOnly: item.previewOnly,
        editorial: item.article.status,
        slot,
        current: previous?.status ?? null,
        now,
        goLiveAt,
        paused
      })
      const hash = ArticleFrontmatter.hash(item.raw)
      const slotIso = slot ? slot.toISOString() : null
      const previousSlot = ArticleLoader.storedSlot(previous)?.toISOString() ?? null
      const changed =
        !previous ||
        previous.contentHash !== hash ||
        previousSlot !== slotIso ||
        previous.status !== status ||
        previous.editorialStatus !== item.article.status ||
        previous.previewOnly !== item.previewOnly ||
        previous.pipeline !== 'corpus'
      return {
        slug: item.article.slug,
        title: item.article.title,
        content: item.article.body,
        meta_description: item.article.summary,
        tags: item.article.tags,
        editorial_status: item.article.status,
        pipeline: 'corpus',
        preview_only: item.previewOnly,
        scheduled_publish_at: slotIso,
        status,
        featured_image_url: ArticleFrontmatter.publicImage(item.article.featureImage),
        feature_image: item.article.featureImage,
        image_alt: item.article.imageAlt,
        source_papers: item.article.sourcePapers,
        treatise_refs: item.article.treatiseRefs,
        replaces_slugs: item.article.replaces,
        content_hash: hash,
        author: SITE_AUTHOR,
        changed,
        reason: assignment?.reason ?? 'not-approved'
      }
    })

    return { errors, upserts, assignments }
  }

  static publicationStatus(input: {
    previewOnly: boolean
    editorial: ParsedArticle['status']
    slot: Date | null
    current: string | null
    now: Date
    goLiveAt: Date
    paused: boolean
  }): PublicationStatus {
    if (input.previewOnly || input.editorial !== 'approved' || !input.slot) return 'draft'
    if (input.current === 'published') {
      const stillPublic = ArticleGate.isPublic(
        {
          pipeline: 'corpus',
          status: 'published',
          editorialStatus: 'approved',
          scheduledPublishAt: input.slot,
          previewOnly: false
        },
        {
          now: input.now,
          goLiveAt: input.goLiveAt,
          publishingPaused: input.paused,
          legacyRetirement: false
        }
      )
      if (stillPublic) return 'published'
    }
    return 'scheduled'
  }

  private static storedSlot(row: StoredArticle | undefined) {
    if (!row?.scheduledPublishAt) return null
    const date = new Date(row.scheduledPublishAt)
    return Number.isNaN(date.getTime()) ? null : date
  }
}
