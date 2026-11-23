import { MATH_PATTERN } from '@/lib/render-math'

const COMMANDS: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  phi: 'φ',
  omega: 'ω',
  Lambda: 'Λ',
  Omega: 'Ω',
  Phi: 'Φ',
  cdot: '·',
  equiv: '≡',
  ge: '≥',
  le: '≤',
  to: '→',
  mid: '|',
  partial: '∂',
  infty: '∞',
  times: '×',
  pm: '±',
  neq: '≠',
  approx: '≈',
  ll: '≪'
}

/**
 * Glossary definitions are stored as written in Chapter 2, including `**` and
 * TeX. Search snippets, meta descriptions and JSON-LD need a plain reading
 * derived here, not a second copy in the database.
 */
export class GlossaryText {
  /** Collapse a definition and drop a leading "Term." label, keeping its markdown. */
  static richDefinition(raw: string, term: string) {
    const text = raw.replace(/\s+/g, ' ').trim()
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = text.match(
      new RegExp(`^(\\*{0,2})${escaped}(\\*{0,2})\\s*[:.](\\*{0,2})\\s+`, 'i')
    )
    if (!match) return text
    const open = match[1]
    const between = match[2]
    const close = match[3]
    let rest = text.slice(match[0].length)
    const spanContinues = open === '**' && between !== '**' && close !== '**'
    if (
      spanContinues &&
      rest.endsWith('**') &&
      (rest.match(/\*\*/g)?.length ?? 0) % 2 === 1
    ) {
      rest = `**${rest.slice(0, -2).trimEnd()}**`
    }
    return rest.trim()
  }

  /**
   * Markdown markers removed. TeX delimiters stay so a preview can still
   * typeset `$G_{crit}$`.
   */
  static plain(value: string) {
    const { text, slots } = GlossaryText.mask(value)
    const stripped = text
      .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
      .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
      .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
      .replace(/\*\*/g, '')
    return GlossaryText.unmask(stripped, slots).replace(/\s+/g, ' ').trim()
  }

  /**
   * A search snippet. Markers are gone, and a cap never slices through a
   * formula, so the index cannot show `**` or a dangling `$`.
   */
  static preview(value: string, max = 140) {
    const flat = GlossaryText.plain(value)
    const sentence = GlossaryText.firstSentence(flat)
    const chosen = sentence.length <= max ? sentence : flat
    const limit = sentence.length <= max ? chosen.length : max
    if (chosen.length <= limit) return chosen
    return GlossaryText.fit(chosen, limit)
  }

  /** Plain text for meta descriptions and JSON-LD: no markers and no TeX delimiters. */
  static prose(value: string) {
    const plain = GlossaryText.plain(value)
    const reading = plain.replace(
      new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags),
      (_full, displayDollar, displayBracket, inlineParen, inlineDollar) => {
        const tex = String(
          displayDollar ?? displayBracket ?? inlineParen ?? inlineDollar ?? ''
        )
        return GlossaryText.readTex(tex)
      }
    )
    return reading.replace(/\s+/g, ' ').trim()
  }

  private static mask(value: string) {
    const slots: string[] = []
    const take = (match: string) => {
      slots.push(match)
      return `MATHSLOT${slots.length - 1}ENDSLOT`
    }
    let text = value.replace(/```[\s\S]*?```|`[^`\n]*`/g, take)
    text = text.replace(
      new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags),
      take
    )
    return { text, slots }
  }

  private static unmask(value: string, slots: string[]) {
    return value.replace(
      /MATHSLOT(\d+)ENDSLOT/g,
      (_, index) => slots[Number(index)] ?? ''
    )
  }

  /** First sentence, treating a formula as a word so `$1.5$` is not a stop. */
  private static firstSentence(value: string) {
    const { text, slots } = GlossaryText.mask(value)
    const sentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text
    return GlossaryText.unmask(sentence, slots)
  }

  /** Shorten to `max` characters without opening a formula that is not closed. */
  private static fit(value: string, max: number) {
    const pattern = new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags)
    const parts: { text: string; atomic: boolean }[] = []
    let last = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(value)) !== null) {
      if (match.index > last)
        parts.push({ text: value.slice(last, match.index), atomic: false })
      parts.push({ text: match[0], atomic: true })
      last = match.index + match[0].length
    }
    if (last < value.length)
      parts.push({ text: value.slice(last), atomic: false })

    let result = ''
    let cut = false
    for (const part of parts) {
      if (result.length + part.text.length <= max) {
        result += part.text
        continue
      }
      cut = true
      if (!part.atomic) {
        const room = max - result.length
        if (room > 1) result += part.text.slice(0, room - 1).trimEnd()
      } else if (result.trim() === '') {
        result = part.text
        cut = false
      }
      break
    }
    if (!cut) return result.trim()
    return `${result.trimEnd()}…`
  }

  private static readTex(tex: string) {
    let text = tex
    text = text.replace(/\\text\{([^{}]*)\}/g, '$1')
    text = text.replace(/\\overline\{([^{}]*)\}/g, '$1')
    text = text.replace(/\\mathcal\{([^{}]*)\}/g, '$1')
    text = text.replace(/\\left|\\right/g, '')
    text = text.replace(/_\{([^{}]+)\}/g, '_$1')
    text = text.replace(/\^\{([^{}]+)\}/g, '^$1')
    text = text.replace(
      /\\([A-Za-z]+)/g,
      (full, name: string) => COMMANDS[name] ?? full
    )
    return text.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim()
  }
}
