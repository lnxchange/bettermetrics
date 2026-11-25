import {
  CorpusIndex,
  splitCitations,
  treatisePath,
  treatiseSectionTarget
} from '@/lib/treatise-citations'

export interface ResolvedBasis {
  /** Set only when the document resolves. Never a path that is not in the index. */
  href: string | null
  /** Link text, or the whole basis when it cannot be linked. */
  text: string
  /** Citation parenthesis, rendered after the link. Empty when there is none. */
  note: string
}

/**
 * Basis strings on the testing page. The document and the section numbers
 * come from the treatise citation resolver the chapter pages use. The href
 * is then checked against the corpus index, so a missing page or a missing
 * heading never becomes a link.
 */
export class TestingBasis {
  private static readonly warned = new Set<string>()

  static resolve(basis: string, index: CorpusIndex): ResolvedBasis {
    const { text, note } = TestingBasis.splitNote(basis)
    const href = TestingBasis.hrefFor(text, index)
    if (!href) TestingBasis.warn(basis.trim())
    return href
      ? { href, text, note }
      : { href: null, text: basis.trim(), note: '' }
  }

  /** Clears the once-per-process warning set. Tests use this. */
  static forgetWarnings() {
    TestingBasis.warned.clear()
  }

  private static splitNote(basis: string): { text: string; note: string } {
    const match = /^(.*\S)\s+(\([^)]*\))\s*$/.exec(basis.trim())
    if (!match) return { text: basis.trim(), note: '' }
    return { text: match[1], note: match[2] }
  }

  private static hrefFor(text: string, index: CorpusIndex): string | null {
    const targets = splitCitations(text).flatMap(part => {
      if (!part.href) return []
      const target = treatiseSectionTarget(part.href)
      return target ? [target] : []
    })
    if (targets.length === 0) return null
    const document = TestingBasis.documentHref(index, targets[0].slug)
    if (!document) return null
    const first = targets
      .map(target => target.section)
      .find(section => section.length > 0)
    if (!first) return document
    const id = first.toLowerCase()
    const live = index.sections[id]
    if (!live) return document
    return treatisePath(live.slug, id)
  }

  /**
   * A dedicated chapter or appendix page, or the chapter that holds an
   * appendix heading. Mirrors linkify's index pass: a slug that is not in
   * the book is not given a path.
   */
  private static documentHref(index: CorpusIndex, slug: string): string | null {
    if (index.chapters.includes(slug)) return treatisePath(slug)
    const key = slug.startsWith('appendix-')
      ? slug.slice('appendix-'.length)
      : ''
    const owner = index.owners[slug] || (key ? index.owners[key] : undefined)
    if (!owner) return null
    if (key && index.sections[key]) {
      const heading = index.sections[key]
      return treatisePath(heading.slug, key)
    }
    return treatisePath(owner)
  }

  private static warn(basis: string) {
    if (TestingBasis.warned.has(basis)) return
    TestingBasis.warned.add(basis)
    console.warn(`[testing] Unresolved basis, rendered as text: ${basis}`)
  }
}
