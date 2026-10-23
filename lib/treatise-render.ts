import { Marked } from 'marked'
import { restoreShieldedMath, shieldMath } from '@/lib/render-math'
import {
  anchorForHeading,
  bodyLabelId,
  CorpusIndex,
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

export function prepareTreatiseMarkdown(
  markdown: string,
  index?: CorpusIndex
): {
  html: string
  headings: TreatiseHeading[]
} {
  const headings: TreatiseHeading[] = []
  const used = new Set<string>()
  const shielded = shieldMath(stripLeadingH1(markdown))
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
      },
      paragraph({ tokens }) {
        const text = restoreShieldedMath(this.parser.parseInline(tokens), shielded.slots)
        const plain = plainHeading(text)
        const label = bodyLabelId(plain)
        if (!label) return `<p>${text}</p>\n`
        const id = uniqueAnchor(label, used)
        headings.push({ id, text: plain, level: 5 })
        return `<p id="${id}" class="scroll-mt-24">${text}</p>\n`
      }
    }
  })

  const linked = linkifyTreatiseMarkdown(shielded.markdown, index ? { index } : undefined)
  const parsed = marked.parse(linked, { async: false }) as string
  let html = restoreShieldedMath(parsed, shielded.slots)
  html = html
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table>')
    .replace(/<\/table>/g, '</table></div>')
  return { html, headings }
}
