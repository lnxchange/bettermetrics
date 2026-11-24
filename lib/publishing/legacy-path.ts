/**
 * Old article URLs from usebettermetrics.com carried file extensions and mixed
 * case ("/articles/Report-14-The-Easterlin-Paradox.md"). Those become the slug
 * form. The feed, the atom file, and nested routes such as the card image stay
 * as they are.
 */
export class LegacyArticlePath {
  static readonly extension = /\.(md|markdown|pdf|docx?|txt|html?)$/i

  static normalise(pathname: string): string | null {
    const match = pathname.match(/^\/articles\/([^/]+)$/)
    if (!match) return null
    let raw: string
    try {
      raw = decodeURIComponent(match[1])
    } catch {
      return null
    }
    const hasExtension = LegacyArticlePath.extension.test(raw)
    const hasUpper = raw !== raw.toLowerCase()
    if (!hasExtension && !hasUpper) return null
    const slug = raw
      .replace(LegacyArticlePath.extension, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    if (!slug || slug === raw) return null
    return `/articles/${slug}`
  }
}
