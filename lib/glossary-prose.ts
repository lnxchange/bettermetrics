import { Marked } from 'marked'
import { restoreShieldedMath, shieldMath } from '@/lib/render-math'

const DROP_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'noscript',
  'textarea',
  'title',
  'xmp',
  'noembed',
  'form'
])

const VOID_TAGS = new Set(['br', 'wbr'])

const PROSE_TAGS = new Set([
  'a',
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'ul',
  'ol',
  'li',
  'code',
  'blockquote',
  'del',
  'sup',
  'sub',
  'span',
  'div',
  'h3'
])

const MATH_TAGS = new Set([
  'math',
  'semantics',
  'annotation',
  'mrow',
  'mi',
  'mo',
  'mn',
  'ms',
  'mtext',
  'mspace',
  'mfrac',
  'msqrt',
  'mroot',
  'msup',
  'msub',
  'msubsup',
  'munder',
  'mover',
  'munderover',
  'mtable',
  'mtr',
  'mtd',
  'mlabeledtr',
  'mstyle',
  'mpadded',
  'mphantom',
  'menclose',
  'merror',
  'mglyph',
  'none',
  'mprescripts',
  'mmultiscripts'
])

const MATH_ATTRS = new Set([
  'display',
  'displaystyle',
  'encoding',
  'fence',
  'stretchy',
  'mathvariant',
  'lspace',
  'rspace',
  'scriptlevel',
  'linethickness',
  'minsize',
  'maxsize',
  'movablelimits',
  'largeop',
  'symmetric',
  'accent',
  'form',
  'separator',
  'width',
  'height',
  'depth',
  'columnspan',
  'rowspan',
  'columnalign',
  'rowalign',
  'columnspacing',
  'rowspacing',
  'linebreak',
  'lineleading',
  'denomalign',
  'numalign',
  'bevelled',
  'open',
  'close',
  'notation'
])

const SAFE_CLASS =
  /^(?:katex|katex-html|katex-mathml|katex-error|my-4)(?: (?:katex|katex-html|katex-mathml|katex-error|my-4))*$/

/**
 * Glossary definitions and explanations, rendered like treatise prose:
 * TeX is shielded, Markdown supplies bold, italics, lists and links, KaTeX
 * MathML is restored, then everything is reduced to a tag whitelist.
 */
export class GlossaryProse {
  static html(source: string) {
    const text = GlossaryProse.sections(source.trim())
    if (!text) return ''
    const shielded = shieldMath(text)
    const parsed = new Marked({ gfm: true }).parse(shielded.markdown, {
      async: false
    }) as string
    return GlossaryProse.sanitize(restoreShieldedMath(parsed, shielded.slots))
  }

  /**
   * A bold label that ends a sentence ("Diagnostic.", "Why hatred cannot
   * ground Admiration.") is a sub-section. Chapter 2 gives it a paragraph.
   * The stored row may already have joined that paragraph onto the previous
   * one, so the label is lifted out either way.
   */
  private static sections(source: string) {
    return source.replace(
      /(^|\n+|(?:[.!?]["']?)\s+)\*\*([A-Z][^*\n]{1,90}?)\*\*\s+(?=\S)/g,
      (full, lead: string, label: string) => {
        const text = label.trim()
        if (!/[.!?]$/.test(text) || text.split(/\s+/).length > 16) return full
        const kept = lead.includes('\n') || lead === '' ? lead : lead.trimEnd()
        const gap = kept.includes('\n') || kept === '' ? kept : `${kept}\n\n`
        return `${gap}### ${text}\n\n`
      }
    )
  }

  private static sanitize(html: string) {
    let out = ''
    let i = 0
    const dropping: string[] = []
    while (i < html.length) {
      if (html[i] !== '<') {
        const next = html.indexOf('<', i)
        const chunk = html.slice(i, next < 0 ? html.length : next)
        if (dropping.length === 0) out += chunk
        i = next < 0 ? html.length : next
        continue
      }
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4)
        i = end < 0 ? html.length : end + 3
        continue
      }
      const gt = GlossaryProse.tagEnd(html, i)
      if (gt < 0) break
      const raw = html.slice(i, gt + 1)
      i = gt + 1
      const tag = GlossaryProse.parseTag(raw)
      if (!tag) continue
      if (dropping.length > 0) {
        if (tag.closing && tag.name === dropping[dropping.length - 1])
          dropping.pop()
        else if (!tag.closing && !tag.self && DROP_TAGS.has(tag.name))
          dropping.push(tag.name)
        continue
      }
      if (DROP_TAGS.has(tag.name)) {
        if (!tag.closing && !tag.self) dropping.push(tag.name)
        continue
      }
      if (!PROSE_TAGS.has(tag.name) && !MATH_TAGS.has(tag.name)) continue
      if (tag.closing) {
        out += `</${tag.name}>`
        continue
      }
      const attrs = GlossaryProse.attributes(tag.name, tag.attrs)
      out += `<${tag.name}${attrs}>`
    }
    return out
  }

  private static attributes(name: string, attrs: [string, string][]) {
    let out = ''
    for (const [rawName, rawValue] of attrs) {
      const attr = rawName.toLowerCase()
      if (
        attr.startsWith('on') ||
        attr === 'style' ||
        attr === 'src' ||
        attr === 'srcdoc'
      )
        continue
      if (name === 'a' && attr === 'href') {
        const href = GlossaryProse.url(rawValue)
        if (href) out += ` href="${GlossaryProse.escape(href)}"`
        continue
      }
      if (
        (name === 'span' || name === 'div') &&
        attr === 'class' &&
        SAFE_CLASS.test(rawValue.trim())
      ) {
        out += ` class="${GlossaryProse.escape(rawValue.trim())}"`
        continue
      }
      if (
        name === 'math' &&
        attr === 'xmlns' &&
        rawValue === 'http://www.w3.org/1998/Math/MathML'
      ) {
        out += ` xmlns="${rawValue}"`
        continue
      }
      if (MATH_TAGS.has(name) && MATH_ATTRS.has(attr)) {
        out += ` ${attr}="${GlossaryProse.escape(rawValue)}"`
      }
    }
    return out
  }

  private static url(value: string) {
    const href = value.trim()
    if (!href || /[\s\u0000-\u001f]/.test(href) || href.includes('\\'))
      return null
    if (href.startsWith('/') && !href.startsWith('//')) return href
    if (!/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('//'))
      return href
    try {
      const parsed = new URL(href)
      if (
        parsed.protocol === 'http:' ||
        parsed.protocol === 'https:' ||
        parsed.protocol === 'mailto:'
      ) {
        return href
      }
    } catch {
      return null
    }
    return null
  }

  private static escape(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  private static tagEnd(source: string, start: number) {
    let quote = ''
    for (let i = start; i < source.length; i++) {
      const ch = source[i]
      if (quote) {
        if (ch === quote) quote = ''
        continue
      }
      if (ch === '"' || ch === "'") {
        quote = ch
        continue
      }
      if (ch === '>') return i
    }
    return -1
  }

  private static parseTag(raw: string) {
    const match = raw.match(/^<\s*(\/)?\s*([A-Za-z][\w:-]*)([^>]*)>$/)
    if (!match) return null
    const name = match[2].toLowerCase()
    const closing = Boolean(match[1])
    const body = match[3]
    const self = /\/\s*$/.test(body) || VOID_TAGS.has(name)
    const attrs: [string, string][] = []
    if (!closing) {
      const attrRe =
        /([^\s=\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
      let found: RegExpExecArray | null
      while ((found = attrRe.exec(body)) !== null) {
        attrs.push([found[1], found[2] ?? found[3] ?? found[4] ?? ''])
      }
    }
    return { name, closing, self, attrs }
  }
}
