import katex from 'katex'

const MATH_PATTERN =
  /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$(?![\d\s])((?:\\.|[^$\n])+?)\$/g

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalizeTex(tex: string) {
  return tex
    .replace(/[\u2018\u2019\u2032\u02BC]/g, "'")
    .replace(/\u2212/g, '-')
    .replace(/\u00a0/g, ' ')
    .trim()
}

function renderTex(tex: string, display: boolean) {
  const source = normalizeTex(tex)
  try {
    return katex.renderToString(source, {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      output: 'html'
    })
  } catch {
    return `<code>${escapeHtml(source)}</code>`
  }
}

export interface ShieldedMath {
  markdown: string
  slots: { html: string; display: boolean }[]
}

/**
 * Replace TeX with tokens before Markdown runs. Marked treats `\` as an
 * escape and `_` as emphasis, which removes the delimiters KaTeX needs.
 * Fenced and inline code are left as written.
 */
export function shieldMath(markdown: string): ShieldedMath {
  const slots: ShieldedMath['slots'] = []
  const fence = /```[\s\S]*?```|`[^`\n]*`/g
  const chunks: string[] = []
  let last = 0
  let fenceMatch: RegExpExecArray | null

  const shield = (text: string) => {
    const pattern = new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags)
    let cursor = 0
    let match: RegExpExecArray | null
    let out = ''
    while ((match = pattern.exec(text)) !== null) {
      out += text.slice(cursor, match.index)
      const display = match[1] != null || match[2] != null
      const tex = match[1] ?? match[2] ?? match[3] ?? match[4] ?? ''
      slots.push({ html: renderTex(tex, display), display })
      out += `MATHSLOT${slots.length - 1}ENDSLOT`
      cursor = match.index + match[0].length
    }
    return out + text.slice(cursor)
  }

  while ((fenceMatch = fence.exec(markdown)) !== null) {
    chunks.push(shield(markdown.slice(last, fenceMatch.index)))
    chunks.push(fenceMatch[0])
    last = fenceMatch.index + fenceMatch[0].length
  }
  chunks.push(shield(markdown.slice(last)))
  return { markdown: chunks.join(''), slots }
}

export function restoreShieldedMath(html: string, slots: ShieldedMath['slots']) {
  const blocks = html.replace(/<p>\s*MATHSLOT(\d+)ENDSLOT\s*<\/p>/g, (full, index) => {
    const slot = slots[Number(index)]
    if (!slot) return full
    if (!slot.display) return `<p>${slot.html}</p>`
    return `<div class="my-4">${slot.html}</div>`
  })
  return blocks.replace(/MATHSLOT(\d+)ENDSLOT/g, (full, index) => slots[Number(index)]?.html ?? full)
}

/** Escape plain text and replace TeX delimiters with KaTeX HTML. */
export function renderMathInText(value: string) {
  if (!value) return ''
  let html = ''
  let last = 0
  const pattern = new RegExp(MATH_PATTERN.source, MATH_PATTERN.flags)
  let match: RegExpExecArray | null
  while ((match = pattern.exec(value)) !== null) {
    const index = match.index
    html += escapeHtml(value.slice(last, index))
    const display = match[1] != null || match[2] != null
    const tex = match[1] ?? match[2] ?? match[3] ?? match[4] ?? ''
    html += renderTex(tex, display)
    last = index + match[0].length
  }
  html += escapeHtml(value.slice(last))
  return html
}

/** Render TeX in HTML, leaving code blocks untouched. */
export function renderMathInHtml(html: string) {
  const parts = html.split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>)/gi)
  return parts
    .map((part, index) => (index % 2 === 1 ? part : renderMathInHtmlFragment(part)))
    .join('')
}

function renderMathInHtmlFragment(html: string) {
  return html.replace(MATH_PATTERN, (full, displayDollar, displayBracket, inlineParen, inlineDollar) => {
    const display = displayDollar != null || displayBracket != null
    const tex = displayDollar ?? displayBracket ?? inlineParen ?? inlineDollar ?? ''
    return renderTex(tex, display)
  })
}
