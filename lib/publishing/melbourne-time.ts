/**
 * Australia/Melbourne civil time. Publishing slots are Monday, Wednesday and
 * Friday at 7:00am local time, including across daylight saving.
 */
export class MelbourneTime {
  static readonly zone = 'Australia/Melbourne'
  static readonly slotHour = 7
  static readonly slotMinute = 0
  static readonly slotWeekdays = [1, 3, 5]

  static parts(instant: Date) {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: MelbourneTime.zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
      hourCycle: 'h23'
    }).formatToParts(instant)
    const pick = (type: string) => formatted.find(part => part.type === type)?.value || ''
    const weekdays: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6
    }
    let hour = Number(pick('hour'))
    let day = Number(pick('day'))
    let month = Number(pick('month'))
    let year = Number(pick('year'))
    // Some ICU builds report midnight as hour 24.
    if (hour === 24) {
      hour = 0
      const shifted = new Date(Date.UTC(year, month - 1, day + 1))
      year = shifted.getUTCFullYear()
      month = shifted.getUTCMonth() + 1
      day = shifted.getUTCDate()
    }
    return {
      year,
      month,
      day,
      hour,
      minute: Number(pick('minute')),
      second: Number(pick('second')),
      weekday: weekdays[pick('weekday')] ?? 0
    }
  }

  /** Minutes to add to UTC to reach the Melbourne wall clock. */
  static offsetMinutes(instant: Date) {
    const part = MelbourneTime.parts(instant)
    const wall = Date.UTC(part.year, part.month - 1, part.day, part.hour, part.minute, part.second)
    return Math.round((wall - instant.getTime()) / 60000)
  }

  static fromLocal(year: number, month: number, day: number, hour: number, minute: number) {
    const desired = Date.UTC(year, month - 1, day, hour, minute, 0)
    let utc = desired
    for (let pass = 0; pass < 4; pass++) {
      const next = desired - MelbourneTime.offsetMinutes(new Date(utc)) * 60000
      if (next === utc) return new Date(next)
      utc = next
    }
    return new Date(utc)
  }

  static calendarDate(instant: Date) {
    const part = MelbourneTime.parts(instant)
    const month = String(part.month).padStart(2, '0')
    const day = String(part.day).padStart(2, '0')
    return `${part.year}-${month}-${day}`
  }

  static addDays(instant: Date, days: number) {
    const part = MelbourneTime.parts(instant)
    const shifted = new Date(Date.UTC(part.year, part.month - 1, part.day + days))
    return MelbourneTime.fromLocal(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth() + 1,
      shifted.getUTCDate(),
      part.hour,
      part.minute
    )
  }

  static isSlot(instant: Date) {
    const part = MelbourneTime.parts(instant)
    return (
      part.hour === MelbourneTime.slotHour &&
      part.minute === MelbourneTime.slotMinute &&
      MelbourneTime.slotWeekdays.includes(part.weekday)
    )
  }

  /** The Monday, Wednesday or Friday 7:00am on or after this instant. */
  static nextSlotOnOrAfter(instant: Date) {
    const part = MelbourneTime.parts(instant)
    let cursor = MelbourneTime.fromLocal(part.year, part.month, part.day, MelbourneTime.slotHour, 0)
    if (cursor.getTime() < instant.getTime()) {
      const next = MelbourneTime.addDays(cursor, 1)
      const moved = MelbourneTime.parts(next)
      cursor = MelbourneTime.fromLocal(moved.year, moved.month, moved.day, MelbourneTime.slotHour, 0)
    }
    for (let step = 0; step < 7; step++) {
      const current = MelbourneTime.parts(cursor)
      if (MelbourneTime.slotWeekdays.includes(current.weekday)) return cursor
      const next = MelbourneTime.addDays(cursor, 1)
      const moved = MelbourneTime.parts(next)
      cursor = MelbourneTime.fromLocal(moved.year, moved.month, moved.day, MelbourneTime.slotHour, 0)
    }
    throw new Error('No Melbourne publishing slot within a week')
  }

  static nextSlotAfter(slot: Date) {
    return MelbourneTime.nextSlotOnOrAfter(new Date(slot.getTime() + 60 * 1000))
  }

  /**
   * The slot for a calendar date in Melbourne. A date that is not Monday,
   * Wednesday or Friday moves forward to the next one. The clock time on the
   * instant is ignored: the slot is always 7:00am.
   */
  static slotForCalendarDate(instant: Date) {
    const part = MelbourneTime.parts(instant)
    const midnight = MelbourneTime.fromLocal(part.year, part.month, part.day, 0, 0)
    return MelbourneTime.nextSlotOnOrAfter(midnight)
  }

  static weekStart(instant: Date) {
    const part = MelbourneTime.parts(instant)
    const sinceMonday = (part.weekday + 6) % 7
    const midnight = MelbourneTime.fromLocal(part.year, part.month, part.day, 0, 0)
    return sinceMonday === 0 ? midnight : MelbourneTime.addDays(midnight, -sinceMonday)
  }

  static label(instant: Date) {
    const date = new Intl.DateTimeFormat('en-AU', {
      timeZone: MelbourneTime.zone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(instant)
    const time = new Intl.DateTimeFormat('en-AU', {
      timeZone: MelbourneTime.zone,
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12'
    }).format(instant)
    return `${date}, ${time}`
  }

  static dayLabel(instant: Date) {
    return new Intl.DateTimeFormat('en-AU', {
      timeZone: MelbourneTime.zone,
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(instant)
  }
}
