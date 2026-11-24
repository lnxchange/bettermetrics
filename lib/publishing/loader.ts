import { ArticleFrontmatter, ParsedArticle } from '@/lib/publishing/frontmatter'
import { ArticleGate } from '@/lib/publishing/gate'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { ArticleSchedule, ScheduleItem, SlotAssignment } from '@/lib/publishing/schedule'
import { SyncState } from '@/lib/publishing/sync-state'
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
  title?: string | null
  summary?: string | null
  content?: string | null
}

export interface SyncConflict {
  slug: string
  reason: string
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
 * only after go-live. A preview file is stored as a draft in the publication
 * column.
 *
 * A stored slot is kept. If the database copy was edited in the app, or it
 * is already approved, a changed file is reported as a conflict and is not
 * written. See SyncState.
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
      const editorialStatus =
        previous?.editorialStatus === 'approved' || item.article.status === 'approved'
          ? 'approved'
          : item.article.status === 'retired'
            ? 'retired'
            : 'draft'
      return {
        slug: item.article.slug,
        editorialStatus,
        explicitPublishAt: item.article.publishAt,
        existingSlot: ArticleLoader.storedSlot(previous),
        previewOnly: item.previewOnly
      }
    })

    for (const row of stored) {
      if (parsedSlugs.has(row.slug)) continue
      if (row.pipeline !== 'corpus' || row.previewOnly) continue
      if (row.editorialStatus !== 'approved' && row.editorialStatus !== 'draft') continue
      const slot = ArticleLoader.storedSlot(row)
      if (!slot || !MelbourneTime.isSlot(slot) || slot.getTime() < goLiveAt.getTime()) continue
      items.push({
        slug: row.slug,
        editorialStatus: row.editorialStatus === 'approved' ? 'approved' : 'draft',
        explicitPublishAt: null,
        existingSlot: slot,
        previewOnly: false
      })
    }

    const assignments = ArticleSchedule.assign(items, now, goLiveAt)
    const bySlug = new Map(assignments.map(item => [item.slug, item]))
    const conflicts: SyncConflict[] = []
    const upserts: ArticleUpsert[] = parsed.map(item => {
      const assignment = bySlug.get(item.article.slug)
      const previous = stored.find(row => row.slug === item.article.slug)
      const fileHash = ArticleFrontmatter.hash(item.raw)
      const fileBodyHash = SyncState.bodyHash(item.article.title, item.article.summary, item.article.body)
      const knownBody = previous?.title !== undefined || previous?.content !== undefined || previous?.summary !== undefined
      const dbBodyHash = knownBody
        ? SyncState.bodyHash(previous?.title ?? '', previous?.summary ?? '', previous?.content ?? '')
        : null
      const hold = previous
        ? SyncState.holds({
            storedHash: previous.contentHash,
            fileHash,
            fileBodyHash,
            dbBodyHash,
            editorialStatus: previous.editorialStatus
          })
        : false
      const fileUnchanged = Boolean(previous && SyncState.unpack(previous.contentHash).fileHash === fileHash)
      if (previous && hold && !fileUnchanged) {
        conflicts.push({
          slug: item.article.slug,
          reason: previous.editorialStatus === 'approved' ? 'approved in the app' : 'edited in the app'
        })
      }
      const keep = Boolean(previous && (hold || fileUnchanged))
      const storedEditorial =
        previous?.editorialStatus === 'approved' || previous?.editorialStatus === 'retired' ? previous.editorialStatus : 'draft'
      const editorial = keep ? storedEditorial : item.article.status
      const slot = keep ? ArticleLoader.storedSlot(previous) : assignment?.slot ?? null
      const status = keep
        ? ArticleLoader.keptStatus(previous?.status ?? null)
        : ArticleLoader.publicationStatus({
            previewOnly: item.previewOnly,
            editorial,
            slot,
            current: previous?.status ?? null,
            now,
            goLiveAt,
            paused
          })
      const slotIso = slot ? slot.toISOString() : null
      const title = keep && previous?.title !== undefined && previous.title !== null ? previous.title : item.article.title
      const summary = keep && previous?.summary !== undefined && previous.summary !== null ? previous.summary : item.article.summary
      const content = keep && previous?.content !== undefined && previous.content !== null ? previous.content : item.article.body
      const writtenBody = SyncState.bodyHash(title, summary, content)
      return {
        slug: item.article.slug,
        title,
        content,
        meta_description: summary,
        tags: item.article.tags,
        editorial_status: editorial === 'approved' || editorial === 'retired' ? editorial : 'draft',
        pipeline: 'corpus' as const,
        preview_only: item.previewOnly,
        scheduled_publish_at: slotIso,
        status,
        featured_image_url: ArticleFrontmatter.publicImage(item.article.featureImage),
        feature_image: item.article.featureImage,
        image_alt: item.article.imageAlt,
        source_papers: item.article.sourcePapers,
        treatise_refs: item.article.treatiseRefs,
        replaces_slugs: item.article.replaces,
        content_hash: keep && previous?.contentHash ? previous.contentHash : SyncState.pack(fileHash, writtenBody),
        author: SITE_AUTHOR,
        changed: !keep,
        reason: assignment?.reason ?? 'not-approved'
      }
    })

    return { errors, upserts, assignments, conflicts }
  }

  /** A kept row stays unpublished unless the cron has already published it. */
  private static keptStatus(status: string | null): PublicationStatus {
    if (status === 'published' || status === 'scheduled') return status
    return 'draft'
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
