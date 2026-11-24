import { GlossaryAliases } from '@/lib/glossary-aliases'

interface CasedForm {
  text: string
  lower: string
}

interface PreparedTitle {
  byFirst: Map<string, CasedForm[]>
  acronyms: Set<string>
}

/**
 * Chapter titles for the treatise.
 * The drafting assistant sometimes writes a heading in capitals. Those
 * titles are put into title case when a chapter is published, and again
 * when a page is rendered, so a stored capital title still matches the
 * other chapters. A mixed-case title is returned as written.
 */
export class TreatiseTitle {
  private static readonly smallWords = new Set([
    'a',
    'an',
    'and',
    'the',
    'of',
    'in',
    'on',
    'to',
    'for',
    'or',
    'as',
    'at',
    'by',
    'with',
    'from'
  ])

  /** AIM letters and the short name of the minimal architecture. */
  private static readonly aimLetters = ['AIM', 'A', 'I', 'M', 'MAS']

  /**
   * A title is in capitals when at least four in five of its letters are
   * uppercase. That catches caps lock, including a short lowercase slip,
   * and leaves a normal title alone. "AIM, MAS and GDP" is about three
   * quarters capitals and stays as written.
   */
  private static readonly uppercaseShare = 0.8

  /** A parenthetical token no longer than this is kept as an acronym. */
  private static readonly parenAcronymLength = 6

  private static prepared: {
    terms: readonly string[]
    value: PreparedTitle
  } | null = null

  /** Title case for a capital heading. A mixed-case title is unchanged. */
  static normalise(title: string, terms: readonly string[] = []): string {
    if (!TreatiseTitle.mostlyUppercase(title)) return title
    const flat = title.replace(/\s+/g, ' ').trim()
    if (!flat) return title
    return TreatiseTitle.recase(flat, TreatiseTitle.prepare(terms))
  }

  /**
   * The stored title of a chapter file: the first heading, without a
   * leading "Chapter 10:" or "Appendix A -", then title case when the
   * heading is in capitals.
   */
  static fromMarkdown(
    markdown: string,
    fallback: string,
    terms: readonly string[] = []
  ): string {
    const line = markdown.split('\n').find(entry => entry.startsWith('# '))
    const heading = line ? TreatiseTitle.headingText(line) : ''
    return TreatiseTitle.normalise(heading || fallback, terms)
  }

  private static headingText(line: string) {
    const text = line.replace(/^#\s+/, '').replace(/\*\*/g, '').trim()
    return text
      .replace(/^(?:chapter|appendix)\s+[0-9A-Za-z]+\s*[:—–-]\s*/i, '')
      .trim()
  }

  private static mostlyUppercase(title: string) {
    const letters = title.match(/\p{L}/gu)
    if (!letters || letters.length === 0) return false
    let upper = 0
    for (const letter of letters) {
      if (letter !== letter.toLocaleLowerCase('en-AU')) upper += 1
    }
    return upper / letters.length >= TreatiseTitle.uppercaseShare
  }

  private static prepare(terms: readonly string[]): PreparedTitle {
    if (TreatiseTitle.prepared && TreatiseTitle.prepared.terms === terms) {
      return TreatiseTitle.prepared.value
    }
    const seen = new Set<string>()
    const forms: CasedForm[] = []
    for (const term of terms) {
      for (const form of GlossaryAliases.forms(term)) {
        const text = form.trim()
        if (text.length < 2 || !/\p{Lu}/u.test(text)) continue
        const lower = text.toLocaleLowerCase('en-AU')
        if (TreatiseTitle.smallWords.has(lower) || seen.has(lower)) continue
        seen.add(lower)
        forms.push({ text, lower })
      }
    }
    forms.sort(
      (a, b) => b.text.length - a.text.length || a.text.localeCompare(b.text)
    )
    const byFirst = new Map<string, CasedForm[]>()
    for (const form of forms) {
      const key = form.lower.charAt(0)
      const bucket = byFirst.get(key)
      if (bucket) bucket.push(form)
      else byFirst.set(key, [form])
    }
    const value = { byFirst, acronyms: TreatiseTitle.acronyms(terms) }
    TreatiseTitle.prepared = { terms, value }
    return value
  }

  /** All-cap tokens in the glossary, plus the AIM letters. */
  private static acronyms(terms: readonly string[]) {
    const found = new Set<string>(TreatiseTitle.aimLetters)
    for (const term of terms) {
      const tokens = term.match(/[\p{L}\p{N}]+/gu) ?? []
      for (const token of tokens) {
        const letters = token.match(/\p{L}/gu) ?? []
        if (letters.length < 2) continue
        const upper = token.toLocaleUpperCase('en-AU')
        if (token === upper) found.add(upper)
      }
    }
    return found
  }

  private static recase(title: string, prepared: PreparedTitle) {
    let index = 0
    let cap = true
    let out = ''
    let raw = ''
    const flush = () => {
      if (!raw) return
      const styled = TreatiseTitle.styleRaw(raw, cap, prepared.acronyms)
      out += styled.text
      cap = styled.cap
      raw = ''
    }
    while (index < title.length) {
      const form = TreatiseTitle.matchForm(title, index, prepared)
      if (form) {
        flush()
        const text = TreatiseTitle.applyCap(form, cap)
        out += text
        cap = TreatiseTitle.capAfter(text)
        index += form.length
        continue
      }
      raw += title[index]
      index += 1
    }
    flush()
    return out
  }

  private static matchForm(
    title: string,
    index: number,
    prepared: PreparedTitle
  ): string | null {
    if (index > 0 && TreatiseTitle.wordChar(title[index - 1])) return null
    const key = title[index].toLocaleLowerCase('en-AU')
    const bucket = prepared.byFirst.get(key)
    if (!bucket) return null
    const rest = title.slice(index)
    for (const form of bucket) {
      if (form.text.length > rest.length) continue
      const slice = rest.slice(0, form.text.length)
      if (slice.toLocaleLowerCase('en-AU') !== form.lower) continue
      const after = index + form.text.length
      if (after < title.length && TreatiseTitle.wordChar(title[after])) continue
      return form.text
    }
    return null
  }

  /** A defined term that opens the title, or follows a colon or dash, takes a capital. */
  private static applyCap(form: string, cap: boolean) {
    if (!cap) return form
    if (!/^(?:a|an|the)\s+\p{L}/iu.test(form)) return form
    if (form[0] !== form[0].toLocaleLowerCase('en-AU')) return form
    return form[0].toLocaleUpperCase('en-AU') + form.slice(1)
  }

  private static capAfter(text: string) {
    const trimmed = text.trimEnd()
    if (!trimmed) return true
    const last = trimmed[trimmed.length - 1]
    return last === ':' || last === '-' || last === '–' || last === '—'
  }

  private static styleRaw(raw: string, cap: boolean, acronyms: Set<string>) {
    let out = ''
    let index = 0
    while (index < raw.length) {
      if (raw[index] === '(') {
        const close = raw.indexOf(')', index + 1)
        if (close !== -1) {
          const inner = raw.slice(index + 1, close)
          const token = inner.trim()
          const single = /^[\p{L}\p{N}]+$/u.test(token) && !/\s/u.test(inner)
          if (single) {
            out += `(${TreatiseTitle.styleWord(token, cap, acronyms, true)})`
            cap = false
          } else {
            const styled = TreatiseTitle.styleRaw(inner, cap, acronyms)
            out += `(${styled.text})`
            cap = styled.cap
          }
          index = close + 1
          continue
        }
      }
      const word = /^[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/u.exec(
        raw.slice(index)
      )
      if (word) {
        out += TreatiseTitle.styleWord(word[0], cap, acronyms, false)
        cap = false
        index += word[0].length
        continue
      }
      const char = raw[index]
      out += char
      if (char === ':' || char === '-' || char === '–' || char === '—')
        cap = true
      index += 1
    }
    return { text: out, cap }
  }

  private static styleWord(
    word: string,
    cap: boolean,
    acronyms: Set<string>,
    parenToken: boolean
  ) {
    const upper = word.toLocaleUpperCase('en-AU')
    const lower = word.toLocaleLowerCase('en-AU')
    if (acronyms.has(upper) && /^[\p{L}\p{N}]+$/u.test(word)) return upper
    if (
      parenToken &&
      word.length >= 1 &&
      word.length <= TreatiseTitle.parenAcronymLength &&
      /^[\p{L}\p{N}]+$/u.test(word) &&
      !TreatiseTitle.smallWords.has(lower)
    ) {
      return upper
    }
    if (!cap && TreatiseTitle.smallWords.has(lower)) return lower
    if (TreatiseTitle.roman(upper)) return upper
    return TreatiseTitle.capitalise(lower)
  }

  private static roman(upper: string) {
    return (
      upper.length >= 2 &&
      /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(upper)
    )
  }

  private static capitalise(lower: string) {
    const parts = lower.split(/([’'])/)
    if (parts.length === 3 && parts[0].length === 1 && parts[2].length > 1) {
      return (
        parts[0].toLocaleUpperCase('en-AU') +
        parts[1] +
        parts[2].charAt(0).toLocaleUpperCase('en-AU') +
        parts[2].slice(1)
      )
    }
    return lower.charAt(0).toLocaleUpperCase('en-AU') + lower.slice(1)
  }

  private static wordChar(char: string) {
    return /[\p{L}\p{N}]/u.test(char)
  }
}
