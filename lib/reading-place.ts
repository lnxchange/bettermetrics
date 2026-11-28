/**
 * Where a reader had reached in one treatise chapter.
 * A chapter opened with no hash returns here. A hash in the address wins.
 * Visitors keep this in a first-party cookie. Signed-in readers also keep it
 * on their account, so another device can continue from the same place.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const HEADING = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/
const EARLIEST = Date.UTC(2024, 0, 1)
const FUTURE_MS = 5 * 60 * 1000

export interface ReadingPlace {
  /** Heading id, or empty when the place is above the first heading. */
  id: string
  /** Pixels below that heading once it sits under the sticky header. */
  offset: number
  /** Thousandths of the scrollable height, used when the heading is gone. */
  ratio: number
  /** Unix milliseconds. The newer place wins. */
  at: number
}

export class ReadingPlaces {
  static readonly cookie = 'bm-place'
  static readonly margin = 96
  static readonly maxAge = 60 * 60 * 24 * 400
  static readonly maxOffset = 5_000_000
  static readonly maxPlaces = 40
  static readonly maxCookie = 3500

  static choose(
    local: ReadingPlace | null,
    account: ReadingPlace | null
  ): ReadingPlace | null {
    if (!local) return account
    if (!account) return local
    return account.at > local.at ? account : local
  }

  /**
   * A jump to the top with no reader action is the browser resetting the
   * page, not the reader returning to the start of the chapter.
   */
  static isLayoutReset(saved: ReadingPlace, next: ReadingPlace): boolean {
    const savedDeep = saved.ratio > 250 || saved.offset > 160
    return savedDeep && next.ratio < 40 && next.offset < 80
  }

  static capture(input: {
    headings: readonly { id: string; top: number }[]
    scrollY: number
    scrollHeight: number
    viewport: number
    at: number
  }): ReadingPlace {
    const scrollY = Math.max(0, input.scrollY)
    const line = scrollY + ReadingPlaces.margin
    const ordered = [...input.headings].sort(
      (a, b) => a.top - b.top || (a.id < b.id ? -1 : 1)
    )
    let anchor: { id: string; top: number } | null = null
    for (const heading of ordered) {
      if (heading.top <= line + 1) anchor = heading
      else break
    }
    const ratio = ReadingPlaces.ratioFor(
      scrollY,
      input.scrollHeight,
      input.viewport
    )
    if (!anchor)
      return { id: '', offset: Math.round(scrollY), ratio, at: input.at }
    const offset = Math.round(scrollY - (anchor.top - ReadingPlaces.margin))
    return {
      id: anchor.id,
      offset: Math.min(ReadingPlaces.maxOffset, Math.max(0, offset)),
      ratio,
      at: input.at
    }
  }

  /** The place a contents link or a hash lands on: the heading, under the header. */
  static atHeading(
    id: string,
    top: number,
    scrollHeight: number,
    viewport: number,
    at: number
  ): ReadingPlace {
    const scrollY = Math.max(0, top - ReadingPlaces.margin)
    return {
      id,
      offset: 0,
      ratio: ReadingPlaces.ratioFor(scrollY, scrollHeight, viewport),
      at
    }
  }

  static scrollTarget(
    place: ReadingPlace,
    headings: readonly { id: string; top: number }[],
    scrollHeight: number,
    viewport: number
  ): number {
    if (place.id) {
      const heading = headings.find(item => item.id === place.id)
      if (heading)
        return Math.max(
          0,
          Math.round(heading.top - ReadingPlaces.margin + place.offset)
        )
      const scrollable = Math.max(0, scrollHeight - viewport)
      return Math.round((place.ratio / 10000) * scrollable)
    }
    return Math.max(0, place.offset)
  }

  static encode(places: Readonly<Record<string, ReadingPlace>>): string {
    const records = Object.entries(places)
      .filter((entry): entry is [string, ReadingPlace] =>
        ReadingPlaces.accept(entry[0], entry[1])
      )
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([slug, place]) =>
        [
          slug,
          place.id,
          String(place.offset),
          String(place.ratio),
          String(place.at)
        ].join('~')
      )
    return ['1', ...records].join('|')
  }

  static decode(
    value: string | null | undefined,
    now = Date.now()
  ): Record<string, ReadingPlace> {
    const places: Record<string, ReadingPlace> = Object.create(null)
    if (!value) return places
    const parts = value.split('|')
    if (parts[0] !== '1') return places
    for (const record of parts.slice(1)) {
      const fields = record.split('~')
      if (fields.length !== 5) continue
      const place = ReadingPlaces.fromFields(
        fields[0],
        fields[1],
        fields[2],
        fields[3],
        fields[4],
        now
      )
      if (place) places[fields[0]] = place
    }
    return places
  }

  static remember(
    places: Readonly<Record<string, ReadingPlace>>,
    slug: string,
    place: ReadingPlace
  ): Record<string, ReadingPlace> {
    const next: Record<string, ReadingPlace> = Object.create(null)
    for (const [key, value] of Object.entries(places)) next[key] = value
    const current = next[slug]
    if (!ReadingPlaces.accept(slug, place)) return next
    if (current && current.at > place.at) return next
    next[slug] = place
    let encoded = ReadingPlaces.encode(next)
    while (
      Object.keys(next).length > ReadingPlaces.maxPlaces ||
      encoded.length > ReadingPlaces.maxCookie
    ) {
      const oldest = Object.entries(next).sort((a, b) => a[1].at - b[1].at)[0]
      if (!oldest || oldest[0] === slug) break
      delete next[oldest[0]]
      encoded = ReadingPlaces.encode(next)
    }
    return next
  }

  static parseBody(
    body: unknown,
    now = Date.now()
  ): Record<string, ReadingPlace> | null {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null
    const raw = (body as { places?: unknown }).places
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    const entries = Object.entries(raw)
    if (entries.length > ReadingPlaces.maxPlaces) return null
    const places: Record<string, ReadingPlace> = Object.create(null)
    for (const [slug, value] of entries) {
      const place = ReadingPlaces.parsePlace(slug, value, now)
      if (!place) return null
      places[slug] = place
    }
    return places
  }

  static read(): Record<string, ReadingPlace> {
    return ReadingPlaces.decode(ReadingPlaces.currentCookie())
  }

  static persist(slug: string, place: ReadingPlace) {
    if (typeof document === 'undefined') return
    const next = ReadingPlaces.remember(ReadingPlaces.read(), slug, place)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${ReadingPlaces.cookie}=${ReadingPlaces.encode(
      next
    )}; Path=/treatise; Max-Age=${ReadingPlaces.maxAge}; SameSite=Lax${secure}`
  }

  private static parsePlace(
    slug: string,
    value: unknown,
    now: number
  ): ReadingPlace | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    const record = value as {
      id?: unknown
      offset?: unknown
      ratio?: unknown
      at?: unknown
    }
    if (typeof record.id !== 'string') return null
    const offset = ReadingPlaces.whole(
      record.offset,
      0,
      ReadingPlaces.maxOffset
    )
    const ratio = ReadingPlaces.whole(record.ratio, 0, 10000)
    const at = ReadingPlaces.whole(record.at, EARLIEST, now + FUTURE_MS)
    if (offset === null || ratio === null || at === null) return null
    const place = { id: record.id, offset, ratio, at: Math.min(at, now) }
    return ReadingPlaces.accept(slug, place) ? place : null
  }

  private static fromFields(
    slug: string,
    id: string,
    offset: string,
    ratio: string,
    at: string,
    now: number
  ): ReadingPlace | null {
    const parsedOffset = ReadingPlaces.digits(
      offset,
      0,
      ReadingPlaces.maxOffset
    )
    const parsedRatio = ReadingPlaces.digits(ratio, 0, 10000)
    const parsedAt = ReadingPlaces.digits(at, EARLIEST, now + FUTURE_MS)
    if (parsedOffset === null || parsedRatio === null || parsedAt === null)
      return null
    const place = {
      id,
      offset: parsedOffset,
      ratio: parsedRatio,
      at: Math.min(parsedAt, now)
    }
    return ReadingPlaces.accept(slug, place) ? place : null
  }

  private static accept(
    slug: string,
    place: ReadingPlace | null
  ): place is ReadingPlace {
    if (!place) return false
    if (!slug || slug.length > 40 || !SLUG.test(slug)) return false
    if (place.id.length > 80 || (place.id !== '' && !HEADING.test(place.id)))
      return false
    return (
      Number.isInteger(place.offset) &&
      place.offset >= 0 &&
      place.offset <= ReadingPlaces.maxOffset &&
      Number.isInteger(place.ratio) &&
      place.ratio >= 0 &&
      place.ratio <= 10000 &&
      Number.isInteger(place.at) &&
      place.at >= EARLIEST
    )
  }

  private static ratioFor(
    scrollY: number,
    scrollHeight: number,
    viewport: number
  ) {
    const scrollable = scrollHeight - viewport
    if (scrollable <= 0) return 0
    const ratio = Math.round((Math.max(0, scrollY) / scrollable) * 10000)
    return Math.min(10000, Math.max(0, ratio))
  }

  private static digits(
    value: string,
    min: number,
    max: number
  ): number | null {
    if (!/^\d+$/.test(value)) return null
    return ReadingPlaces.whole(Number(value), min, max)
  }

  private static whole(
    value: unknown,
    min: number,
    max: number
  ): number | null {
    if (typeof value !== 'number' || !Number.isSafeInteger(value)) return null
    if (value < min || value > max) return null
    return value
  }

  private static currentCookie() {
    if (typeof document === 'undefined') return ''
    const prefix = `${ReadingPlaces.cookie}=`
    const found = document.cookie
      .split('; ')
      .find(part => part.startsWith(prefix))
    if (!found) return ''
    const raw = found.slice(prefix.length)
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }
}
