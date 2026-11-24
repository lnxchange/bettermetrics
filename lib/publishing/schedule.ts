import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { EditorialStatus } from '@/lib/publishing/types'

export interface ScheduleItem {
  slug: string
  editorialStatus: EditorialStatus
  /** Set when the file names a date. The clock is snapped to 7:00am. */
  explicitPublishAt: Date | null
  /** Slot already stored. Kept even when the file names a different date. */
  existingSlot: Date | null
  previewOnly: boolean
}

export interface SlotAssignment {
  slug: string
  slot: Date | null
  moved: boolean
  reason: 'explicit' | 'kept' | 'assigned' | 'draft' | 'preview-only' | 'not-approved'
}

/**
 * Three slots a week, Monday, Wednesday and Friday at 7:00am Melbourne,
 * starting on or after go-live. The first morning is Monday 11 January 2027
 * when go-live is that day.
 *
 * Approved articles and drafts both take slots. A slot already stored is kept,
 * including when the file names a different date. A new file date is used only
 * when nothing is stored yet. Approved articles fill remaining slots first,
 * then drafts, in slug order. Preview articles and retired articles do not
 * take a slot. A stored slot is tentative until the article is approved, and
 * it is never a reason to show the article in public.
 */
export class ArticleSchedule {
  static assign(items: ScheduleItem[], now: Date, goLiveAt: Date): SlotAssignment[] {
    const first = MelbourneTime.nextSlotOnOrAfter(goLiveAt)
    const start = now.getTime() <= first.getTime() ? first : MelbourneTime.nextSlotOnOrAfter(now)
    const taken = new Map<string, string>()
    const results = new Map<string, SlotAssignment>()

    const claim = (slug: string, slot: Date, moved: boolean, reason: SlotAssignment['reason']) => {
      let chosen = slot
      let didMove = moved
      while (taken.has(chosen.toISOString())) {
        chosen = MelbourneTime.nextSlotAfter(chosen)
        didMove = true
      }
      taken.set(chosen.toISOString(), slug)
      results.set(slug, { slug, slot: chosen, moved: didMove, reason })
    }

    const queued = items
      .filter(item => !item.previewOnly && (item.editorialStatus === 'approved' || item.editorialStatus === 'draft'))
      .sort((a, b) => ArticleSchedule.queueOrder(a, b))

    for (const item of queued) {
      if (!item.existingSlot) continue
      const slot = item.existingSlot
      const free = MelbourneTime.isSlot(slot) && slot.getTime() >= first.getTime() && !taken.has(slot.toISOString())
      if (!free) continue
      claim(item.slug, slot, false, 'kept')
    }

    for (const item of queued) {
      if (results.has(item.slug) || !item.explicitPublishAt) continue
      const snapped = MelbourneTime.slotForCalendarDate(item.explicitPublishAt)
      const slot = snapped.getTime() < first.getTime() ? first : snapped
      claim(item.slug, slot, slot.getTime() !== snapped.getTime(), 'explicit')
    }

    let cursor = start
    for (const item of queued) {
      if (results.has(item.slug)) continue
      while (taken.has(cursor.toISOString())) cursor = MelbourneTime.nextSlotAfter(cursor)
      claim(item.slug, cursor, false, item.editorialStatus === 'draft' ? 'draft' : 'assigned')
      cursor = MelbourneTime.nextSlotAfter(cursor)
    }

    return items.map(item => {
      const existing = results.get(item.slug)
      if (existing) return existing
      return {
        slug: item.slug,
        slot: null,
        moved: false,
        reason: item.previewOnly ? 'preview-only' : 'not-approved'
      }
    })
  }

  /** Approved articles first, then drafts, then slug. */
  private static queueOrder(a: ScheduleItem, b: ScheduleItem) {
    if (a.editorialStatus !== b.editorialStatus) return a.editorialStatus === 'approved' ? -1 : 1
    return a.slug.localeCompare(b.slug)
  }

  static openSlots(taken: Date[], from: Date, count: number) {
    const used = new Set(taken.map(slot => slot.toISOString()))
    const slots: Date[] = []
    let cursor = MelbourneTime.nextSlotOnOrAfter(from)
    while (slots.length < count) {
      if (!used.has(cursor.toISOString())) slots.push(cursor)
      cursor = MelbourneTime.nextSlotAfter(cursor)
    }
    return slots
  }
}
