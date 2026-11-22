/**
 * Surface forms of a glossary headword, in the headword's own case.
 * The same shapes as glossary lookup: the headword, an axiom's title,
 * the parenthetical stem, an inner alias of three or more characters,
 * and a short comma-separated list.
 */
export class GlossaryAliases {
  static forms(term: string): string[] {
    const forms: string[] = []
    const add = (value: string) => {
      const text = value.trim()
      if (!text || forms.includes(text)) return
      forms.push(text)
    }
    add(term)
    const axiom = term.match(/^Axiom\s+\d+\s*[-–:]\s*(.+)$/i)
    if (axiom) {
      add(axiom[1])
      add(axiom[1].replace(/\s*\([^)]*\)\s*$/, ''))
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
}
