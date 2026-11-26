/**
 * The public Lean archive named by testing-status.json.
 *
 * The page links it only when the URL is the stable object in the public
 * treatise-ebooks bucket. Anything else leaves the published sentence as it
 * is, including "available on request".
 */

export class TestingDownload {
  static readonly phrase = 'available on request'
  static readonly linkText = 'available for download'
  static readonly objectPrefix = '/storage/v1/object/public/treatise-ebooks/'
  static readonly objectName = 'aim-pilot.zip'
  static readonly objectPath = `${TestingDownload.objectPrefix}${TestingDownload.objectName}`
  /** Public storage host of the treatise-ebooks bucket. */
  static readonly knownHost = 'mlwjklukwwaljtwysmna.supabase.co'

  /**
   * The storage host for this deployment. NEXT_PUBLIC_SUPABASE_URL is the
   * project the testing page already reads. When that value is missing or
   * not an https URL, the known project host stands.
   */
  static host(): string {
    const configured = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!configured) return TestingDownload.knownHost
    try {
      const url = new URL(configured)
      if (url.protocol === 'https:' && url.hostname !== '') return url.hostname
    } catch {
      return TestingDownload.knownHost
    }
    return TestingDownload.knownHost
  }

  static matchesPath(pathname: string): boolean {
    return (
      pathname.startsWith(TestingDownload.objectPrefix) &&
      pathname.endsWith(`/${TestingDownload.objectName}`)
    )
  }

  static safe(href: string): boolean {
    let url: URL
    try {
      url = new URL(href)
    } catch {
      return false
    }
    return (
      url.protocol === 'https:' &&
      url.username === '' &&
      url.password === '' &&
      url.port === '' &&
      url.hostname === TestingDownload.host() &&
      TestingDownload.matchesPath(url.pathname)
    )
  }

  static href(download: { href?: string } | undefined): string | null {
    const href = download?.href
    if (!href || !TestingDownload.safe(href)) return null
    return href
  }

  /**
   * Replace the request sentence when a link is present. A summary that does
   * not use that sentence gains one, so a published URL is not dropped.
   */
  static sentence(
    summary: string,
    href: string | null
  ): { before: string; after: string } | null {
    if (!href) return null
    const at = summary.indexOf(TestingDownload.phrase)
    if (at >= 0) {
      return {
        before: summary.slice(0, at),
        after: summary.slice(at + TestingDownload.phrase.length)
      }
    }
    const trimmed = summary.trimEnd()
    const gap = /[.!?]$/.test(trimmed) ? ' ' : '. '
    return {
      before: `${trimmed}${gap}The Lean project is `,
      after: '.'
    }
  }
}
