import { Marked } from 'marked'
import { restoreShieldedMath, shieldMath } from '@/lib/render-math'
import {
  anchorForHeading,
  linkifyTreatiseMarkdown,
  TreatiseHeading,
  uniqueAnchor
} from '@/lib/treatise-citations'

export type { TreatiseHeading }

function plainHeading(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripLeadingH1(markdown: string) {
  return markdown.replace(/^#\s+[^\n]*\n+/, '')
}

const PIPE_ROW = /^\s*\|.*\|\s*$/
const LOOSE_DELIMITER_ROW = /^\s*\|(?:\s*:?[-—–,]+:?\s*\|)+\s*$/

/**
 * The source documents pass through a word processor, which turns a table's
 * `|---|` delimiter row into em dashes, en dashes or commas. GFM only accepts
 * hyphens there, so without this the whole table renders as one paragraph.
 */
export function repairTableDelimiters(markdown: string) {
  const lines = markdown.split('\n')
  let fenced = false
  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*(```|~~~)/.test(lines[index])) {
      fenced = !fenced
      continue
    }
    if (fenced || index === 0) continue
    if (!LOOSE_DELIMITER_ROW.test(lines[index]) || !PIPE_ROW.test(lines[index - 1])) continue
    if (index > 1 && PIPE_ROW.test(lines[index - 2])) continue
    lines[index] = lines[index].replace(
      /:?[-—–,]+:?/g,
      cell => `${cell.startsWith(':') ? ':' : ''}---${cell.endsWith(':') ? ':' : ''}`
    )
  }
  return lines.join('\n')
}

export function prepareTreatiseMarkdown(markdown: string): {
  html: string
  headings: TreatiseHeading[]
} {
  const headings: TreatiseHeading[] = []
  const used = new Set<string>()
  const shielded = shieldMath(repairTableDelimiters(stripLeadingH1(markdown)))
  const marked = new Marked()
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = restoreShieldedMath(this.parser.parseInline(tokens), shielded.slots)
        const plain = plainHeading(text)
        const id = uniqueAnchor(anchorForHeading(plain), used)
        // The page title is the only <h1>. Any further top-level headings in
        // the source (part titles, repeated chapter headings) render as <h2>.
        const level = Math.max(depth, 2)
        if (level >= 2 && level <= 4) {
          headings.push({ id, text: plain, level })
        }
        return `<h${level} id="${id}" class="scroll-mt-24">${text}</h${level}>\n`
      }
    }
  })

  const linked = linkifyTreatiseMarkdown(shielded.markdown)
  const parsed = marked.parse(linked, { async: false }) as string
  let html = restoreShieldedMath(parsed, shielded.slots)
  html = html
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table>')
    .replace(/<\/table>/g, '</table></div>')
  return { html, headings }
}
