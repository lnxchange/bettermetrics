import pairs from './treatise-legacy-redirects.json'

/**
 * Chapter addresses after 261123. Stored slugs stay numeric (`12`) or
 * `appendix-*`. The public address of a chapter is `/treatise/chapter-N`.
 * The legacy table is written out: it records what each bare number meant
 * before 261123, and is not derived from the chapters currently stored.
 * Chapter 2 has no page of its own. `/treatise/chapter-2` continues to the glossary.
 */

export interface TreatiseRedirect {
  source: string
  destination: string
  permanent: true
  statusCode: 301
}

const legacy = new Map<string, string>(pairs as [string, string][])

export class TreatiseAddress {
  static redirects(): TreatiseRedirect[] {
    return (pairs as [string, string][]).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
      statusCode: 301
    }))
  }

  /** Permanent destination of an old address, or null when the path is current. */
  static destinationFor(pathname: string): string | null {
    return legacy.get(pathname) ?? null
  }

  /**
   * Public path for a stored slug. Numeric chapters use `/treatise/chapter-N`.
   * `appendix-12a` is the stored slug of the page now addressed as appendix 14A,
   * until the next publish writes `appendix-14a`.
   */
  static publicPath(slug: string): string {
    if (slug === '2') return '/glossary'
    if (slug === 'appendix-12a') return '/treatise/appendix-14a'
    if (/^[1-9]\d?$/.test(slug)) {
      const number = Number(slug)
      if (number >= 1 && number <= 20) return `/treatise/chapter-${number}`
    }
    return `/treatise/${slug}`
  }

  /**
   * Stored slug for a current address segment (`chapter-12`, `appendix-a`).
   * Bare numbers and `appendix-12a` are redirects, so they have no stored read.
   */
  static storageSlug(segment: string): string | null {
    const chapter = /^chapter-([1-9]\d?)$/.exec(segment)
    if (chapter) {
      const number = Number(chapter[1])
      if (number >= 1 && number <= 20) return String(number)
      return null
    }
    if (/^(?:[1-9]\d?|appendix-12a)$/.test(segment)) return null
    return segment
  }

  /** Stored slug for a treatise link, following the legacy table when the path is old. */
  static storageSlugFromPath(pathname: string): string | null {
    let path = pathname
    for (let hop = 0; hop < 2; hop += 1) {
      const next = TreatiseAddress.destinationFor(path)
      if (!next) break
      path = next
    }
    if (!path.startsWith('/treatise/')) return null
    const segment = path.slice('/treatise/'.length)
    if (!segment || segment.includes('/')) return null
    return TreatiseAddress.storageSlug(segment)
  }
}
