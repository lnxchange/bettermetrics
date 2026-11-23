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
    const slots: string[] = []
    const mask = (match: string) => {
      slots.push(match)
      return `MATHSLOT${slots.length - 1}ENDSLOT`
    }
    let text = value.replace(/```[\s\S]*?```|`[^`\n]*`/g, mask)
    text = text.replace(
      new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags),
      mask
    )
    text = text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    text = text.replace(/\*\*([\s\S]+?)\*\*/g, '$1')
    text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    text = text.replace(/\*\*/g, '')
    text = text.replace(
      /MATHSLOT(\d+)ENDSLOT/g,
      (_, index) => slots[Number(index)] ?? ''
    )
    return text.replace(/\s+/g, ' ').trim()
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
