import { MelbourneTime } from '@/lib/publishing/melbourne-time'

/**
 * What the admin editor is allowed to change. It never marks a row published.
 * Approving keeps the slot. The hourly job is still the only publisher, and
 * only after go-live.
 */
export class ArticleReview {
  static snap(date: Date, goLiveAt: Date) {
    const first = MelbourneTime.nextSlotOnOrAfter(goLiveAt)
    const snapped = MelbourneTime.slotForCalendarDate(date)
    return snapped.getTime() < first.getTime() ? first : snapped
  }

  static collision(slots: { slug: string; at: string | null }[], slug: string, slot: Date) {
    return slots.some(item => item.slug !== slug && item.at !== null && new Date(item.at).getTime() === slot.getTime())
  }

  static approve(status: string | null) {
    return {
      editorial_status: 'approved' as const,
      status: status === 'published' ? 'published' : 'scheduled'
    }
  }

  static unapprove() {
    return {
      editorial_status: 'draft' as const,
      status: 'draft' as const
    }
  }
}
