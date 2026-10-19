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

export function prepareTreatiseMarkdown(markdown: string): {
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
        if (depth >= 2 && depth <= 4) {
          headings.push({ id, text: plain, level: depth })
        }
        return `<h${depth} id="${id}" class="scroll-mt-24">${text}</h${depth}>\n`
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
