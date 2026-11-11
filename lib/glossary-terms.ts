export interface GlossaryTermRef {
  term: string
  slug: string
}

export interface GlossarySpan {
  start: number
  end: number
  slug: string
  text: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Exact, case-sensitive matches of glossary headings.
 * The longest heading wins, and a match must not sit inside a longer word.
 * A one-letter heading is left alone so a capital "I" stays the pronoun.
 */
export function findGlossarySpans(text: string, terms: GlossaryTermRef[]): GlossarySpan[] {
  const usable = terms
    .map(term => ({ term: term.term.trim(), slug: term.slug.trim() }))
    .filter(term => term.term.length >= 2 && term.slug)
    .sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term))
  const seen = new Set<string>()
  const unique = usable.filter(term => {
    if (seen.has(term.term)) return false
    seen.add(term.term)
    return true
  })
  if (!unique.length || !text) return []

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${unique.map(term => escapeRegExp(term.term)).join('|')})(?![\\p{L}\\p{N}])`,
    'gu'
  )
  const slugs = new Map(unique.map(term => [term.term, term.slug]))
  const spans: GlossarySpan[] = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const found = match[0]
    const slug = slugs.get(found)
    if (slug) {
      spans.push({
        start: match.index,
        end: match.index + found.length,
        slug,
        text: found
      })
    }
    if (found.length === 0) pattern.lastIndex += 1
  }
  return spans
}
