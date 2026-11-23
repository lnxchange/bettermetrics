import { GlossaryAliases } from '@/lib/glossary-aliases'

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

/**
 * Case-sensitive matches of glossary headwords and their aliases.
 * The longest form wins, and a match must not sit inside a longer word.
 * A one-letter form is left alone, so a capital "I" or "A" stays unlinked.
 *
 * The pattern is compiled once. Rebuilding it for every text node is what
 * cut chapter underlines off: Chapter 4 has thousands of text nodes, and
 * compiling every headword for each of them ran long enough that the
 * browser stopped the script before the later sections.
 */
export class GlossaryMatcher {
  private constructor(
    private readonly expression: RegExp,
    private readonly slugs: Map<string, string>
  ) {}

  static compile(terms: GlossaryTermRef[]): GlossaryMatcher | null {
    const seen = new Set<string>()
    const patterns: { text: string; slug: string }[] = []
    for (const term of terms) {
      const slug = term.slug.trim()
      if (!slug) continue
      for (const form of GlossaryAliases.forms(term.term)) {
        if (form.length < 2 || seen.has(form)) continue
        seen.add(form)
        patterns.push({ text: form, slug })
      }
    }
    if (!patterns.length) return null
    patterns.sort(
      (a, b) => b.text.length - a.text.length || a.text.localeCompare(b.text)
    )
    const slugs = new Map(patterns.map(pattern => [pattern.text, pattern.slug]))
    const expression = new RegExp(
      `(?<![\\p{L}\\p{N}])(?:${patterns
        .map(pattern => GlossaryMatcher.escape(pattern.text))
        .join('|')})(?![\\p{L}\\p{N}])`,
      'gu'
    )
    return new GlossaryMatcher(expression, slugs)
  }

  static spans(text: string, terms: GlossaryTermRef[]): GlossarySpan[] {
    if (!text) return []
    const matcher = GlossaryMatcher.compile(terms)
    if (!matcher) return []
    return matcher.spans(text)
  }

  spans(text: string): GlossarySpan[] {
    if (!text) return []
    this.expression.lastIndex = 0
    const spans: GlossarySpan[] = []
    let match: RegExpExecArray | null
    while ((match = this.expression.exec(text))) {
      const found = match[0]
      const slug = this.slugs.get(found)
      if (slug) {
        spans.push({
          start: match.index,
          end: match.index + found.length,
          slug,
          text: found
        })
      }
      if (found.length === 0) this.expression.lastIndex += 1
    }
    return spans
  }

  private static escape(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

export function findGlossarySpans(
  text: string,
  terms: GlossaryTermRef[]
): GlossarySpan[] {
  return GlossaryMatcher.spans(text, terms)
}
