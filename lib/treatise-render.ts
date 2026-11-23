import { Marked } from 'marked'
import { GlossaryMarkup } from '@/lib/glossary-markup'
import { type GlossaryTermRef } from '@/lib/glossary-terms'
import { restoreShieldedMath, shieldMath } from '@/lib/render-math'
import { TreatiseOutline } from '@/lib/treatise-outline'
import {
  anchorForHeading,
  bodyLabelId,
  CorpusIndex,
  linkifyTreatiseMarkdown,
  TreatiseHeading,
  uniqueAnchor
} from '@/lib/treatise-citations'

export type { TreatiseHeading }

class HeadingText {
  static plain(html: string) {
    return HeadingText.decode(html.replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim()
  }

  private static decode(value: string) {
    const named: Record<string, string> = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      nbsp: ' '
    }
    return value.replace(
      /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
      (entity, body: string) => {
        const key = body.toLowerCase()
        if (named[key]) return named[key]
        const code = key.startsWith('#x')
          ? parseInt(key.slice(2), 16)
          : key.startsWith('#')
          ? Number(key.slice(1))
          : NaN
        if (!Number.isInteger(code) || code < 0 || code > 0x10ffff)
          return entity
        return String.fromCodePoint(code)
      }
    )
  }
}

export function stripLeadingH1(markdown: string) {
  return markdown.replace(/^#\s+[^\n]*\n+/, '')
}

export function prepareTreatiseMarkdown(
  markdown: string,
  index?: CorpusIndex,
  terms?: GlossaryTermRef[]
): {
  html: string
  headings: TreatiseHeading[]
} {
  const headings: TreatiseHeading[] = []
  const used = new Set<string>()
  const shielded = shieldMath(stripLeadingH1(markdown))
  const reserved = TreatiseOutline.headingSectionIds(shielded.markdown)
  const marked = new Marked()
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = restoreShieldedMath(
          this.parser.parseInline(tokens),
          shielded.slots
        )
        const plain = HeadingText.plain(text)
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
        const text = restoreShieldedMath(
          this.parser.parseInline(tokens),
          shielded.slots
        )
        const plain = HeadingText.plain(text)
        const label = bodyLabelId(plain)
        if (!label) return `<p>${text}</p>\n`
        // A chapter preview restates a later heading. It must not enter the
        // menu or take that heading's id, or #4.1 lands on the preview.
        if (reserved.has(label)) return `<p>${text}</p>\n`
        const id = uniqueAnchor(label, used)
        headings.push({ id, text: TreatiseOutline.leadIn(plain), level: 5 })
        return `<p id="${id}" class="scroll-mt-24">${text}</p>\n`
      }
    }
  })

  const linked = linkifyTreatiseMarkdown(
    shielded.markdown,
    index ? { index } : undefined
  )
  const parsed = marked.parse(linked, { async: false }) as string
  let html = restoreShieldedMath(parsed, shielded.slots)
  html = html
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table>')
    .replace(/<\/table>/g, '</table></div>')
  if (terms?.length) html = GlossaryMarkup.html(html, terms)
  return { html, headings }
}
