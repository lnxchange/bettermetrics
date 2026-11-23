/**
 * Surface forms of a glossary headword, in the headword's own case.
 * The same shapes as glossary lookup: the headword, an axiom's title,
 * the parenthetical stem, an inner alias of three or more characters,
 * and a short comma-separated list.
 * The last word's plural is included, so "Construction Premises" matches
 * "Construction Premise". An alias that begins with "the", "a", or "an"
 * also matches with that word capitalised, and without the article, so
 * "The Scalar" and "Scalar" match "the Scalar".
 */
export class GlossaryAliases {
  static forms(term: string): string[] {
    const forms: string[] = []
    const add = (value: string) => {
      const text = value.trim()
      if (!text) return
      for (const form of GlossaryAliases.variants(text)) {
        if (!forms.includes(form)) forms.push(form)
      }
    }
    add(term)
    const labelled = term.match(
      /^((?:Axiom|Construction\s+Premise)\s+\d+)\s*[-–:]\s*(.+)$/i
    )
    if (labelled) {
      add(labelled[1])
      add(labelled[2])
      add(labelled[2].replace(/\s*\([^)]*\)\s*$/, ''))
    }
    const wrapped = term.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
    if (wrapped) {
      const stem = wrapped[1].trim()
      const inner = wrapped[2].trim()
      add(stem)
      if (inner.length >= 3) add(inner)
      add(stem.replace(/\s*\([^)]*\)\s*$/, ''))
    }
    if (term.includes(',') && term.length < 40 && !term.includes('(')) {
      for (const piece of term.split(',')) add(piece)
    }
    return forms
  }

  private static variants(text: string): string[] {
    const found: string[] = []
    const push = (value: string | null) => {
      if (!value || found.includes(value)) return
      found.push(value)
    }
    push(text)
    const sentence = GlossaryAliases.sentenceCase(text)
    push(sentence)
    push(GlossaryAliases.plural(text))
    if (sentence) push(GlossaryAliases.plural(sentence))
    const word = GlossaryAliases.bare(text)
    push(word)
    if (word) push(GlossaryAliases.plural(word))
    return found
  }

  /** "the Scalar" is also the sentence "The Scalar". */
  private static sentenceCase(text: string): string | null {
    const match = text.match(/^(the|an|a)(\s+)([\s\S]+)$/)
    if (!match) return null
    const word = match[1]
    return word.charAt(0).toUpperCase() + word.slice(1) + match[2] + match[3]
  }

  /** "the Scalar" is also the word "Scalar". */
  private static bare(text: string): string | null {
    const match = text.match(/^(?:the|an|a)\s+(\p{L}+)$/u)
    if (!match || match[1].length < 3) return null
    return match[1]
  }

  /**
   * Plural of the last word, in that word's own case.
   * A single token is left alone, so "A-Floor" does not become "A-Floors"
   * and steal the "A-floors" alias.
   */
  private static plural(text: string): string | null {
    if (!/\s/.test(text)) return null
    const match = text.match(/^(.*?)(\p{L}+)$/u)
    if (!match) return null
    const word = match[2]
    if (word.length < 3 || !/\p{Ll}/u.test(word) || /s$/i.test(word))
      return null
    const next = /[bcdfghjklmnpqrstvwxz]y$/i.test(word)
      ? `${word.slice(0, -1)}${word.endsWith('Y') ? 'IES' : 'ies'}`
      : /(?:ch|sh|x|z)$/i.test(word)
      ? `${word}es`
      : `${word}s`
    return match[1] + next
  }
}
