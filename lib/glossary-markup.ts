import {
  GlossaryMatcher,
  type GlossarySpan,
  type GlossaryTermRef
} from '@/lib/glossary-terms'

const SKIP_TAGS = new Set([
  'a',
  'code',
  'pre',
  'button',
  'script',
  'style',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
])

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
])

/**
 * The same glossary underlines on the server and in the browser.
 * Headings are left alone: the table of contents is those heading strings.
 */
export class GlossaryMarkup {
  static readonly markClass =
    'glossary-term cursor-pointer underline decoration-dotted underline-offset-[0.15em]'

  static readonly skipSelector =
    'a, code, pre, button, script, style, [data-glossary]'

  /** Chapter HTML, with one span per occurrence outside the skip list and headings. */
  static html(source: string, terms: GlossaryTermRef[]): string {
    const matcher = GlossaryMatcher.compile(terms)
    if (!matcher || !source) return source
    const stack: { tag: string; skip: boolean }[] = []
    let out = ''
    let i = 0
    const skipping = () => stack.length > 0 && stack[stack.length - 1].skip
    while (i < source.length) {
      if (source.startsWith('<!--', i)) {
        const end = source.indexOf('-->', i + 4)
        const to = end < 0 ? source.length : end + 3
        out += source.slice(i, to)
        i = to
        continue
      }
      if (source[i] !== '<') {
        const next = source.indexOf('<', i)
        const raw = source.slice(i, next < 0 ? source.length : next)
        i = next < 0 ? source.length : next
        out += skipping() ? raw : GlossaryMarkup.decorateText(raw, matcher)
        continue
      }
      const gt = GlossaryMarkup.tagEnd(source, i)
      if (gt < 0) {
        out += source.slice(i)
        break
      }
      const raw = source.slice(i, gt + 1)
      const head = raw.match(/^<\s*(\/)?\s*([A-Za-z][\w:-]*)/)
      i = gt + 1
      if (!head) {
        out += raw
        continue
      }
      const name = head[2].toLowerCase()
      const closing = Boolean(head[1])
      if (name === 'script' || name === 'style') {
        if (!closing) {
          const close = source
            .slice(i)
            .search(new RegExp(`</${name}\\s*>`, 'i'))
          if (close < 0) {
            out += raw + source.slice(i)
            break
          }
          const end = i + close
          const closeEnd = source.indexOf('>', end)
          const to = closeEnd < 0 ? source.length : closeEnd + 1
          out += raw + source.slice(i, to)
          i = to
          continue
        }
      }
      out += raw
      if (closing) {
        for (let at = stack.length - 1; at >= 0; at--) {
          if (stack[at].tag === name) {
            stack.length = at
            break
          }
        }
        continue
      }
      const selfClosing = raw.endsWith('/>') || VOID_TAGS.has(name)
      if (selfClosing) continue
      const glossary = /data-glossary\b/i.test(raw)
      const skip = skipping() || SKIP_TAGS.has(name) || glossary
      stack.push({ tag: name, skip })
    }
    return out
  }

  /**
   * Browser pass for popovers and HTML that arrives after the page.
   * Text already inside [data-glossary] is left as it is, so a server
   * span is not wrapped again.
   */
  static element(
    root: HTMLElement,
    terms: GlossaryTermRef[],
    skipHeadings = false
  ) {
    const matcher = GlossaryMatcher.compile(terms)
    if (!matcher) return
    const skip = skipHeadings
      ? `${GlossaryMarkup.skipSelector}, h1, h2, h3, h4, h5, h6`
      : GlossaryMarkup.skipSelector
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement
        if (!parent || parent.closest(skip)) return NodeFilter.FILTER_REJECT
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    })
    const nodes: Text[] = []
    let current = walker.nextNode()
    while (current) {
      nodes.push(current as Text)
      current = walker.nextNode()
    }
    for (const node of nodes) {
      const text = node.textContent || ''
      const spans = matcher.spans(text)
      if (!spans.length || !node.parentNode) continue
      const fragment = document.createDocumentFragment()
      let last = 0
      for (const span of spans) {
        if (span.start > last) fragment.append(text.slice(last, span.start))
        fragment.append(GlossaryMarkup.mark(span))
        last = span.end
      }
      if (last < text.length) fragment.append(text.slice(last))
      node.parentNode.replaceChild(fragment, node)
    }
  }

  private static mark(span: GlossarySpan) {
    const mark = document.createElement('span')
    mark.dataset.glossary = span.slug
    mark.className = GlossaryMarkup.markClass
    mark.textContent = span.text
    return mark
  }

  private static decorateText(raw: string, matcher: GlossaryMatcher): string {
    if (!raw.trim()) return raw
    const decoded = GlossaryMarkup.decode(raw)
    const spans = matcher.spans(decoded.text)
    if (!spans.length) return raw
    let out = ''
    let last = 0
    for (const span of spans) {
      out += raw.slice(decoded.map[last], decoded.map[span.start])
      const inner = raw.slice(decoded.map[span.start], decoded.map[span.end])
      out += `<span data-glossary="${GlossaryMarkup.escapeAttr(
        span.slug
      )}" class="${GlossaryMarkup.markClass}">${inner}</span>`
      last = span.end
    }
    out += raw.slice(decoded.map[last])
    return out
  }

  private static tagEnd(source: string, start: number) {
    let quote = ''
    for (let i = start; i < source.length; i++) {
      const char = source[i]
      if (quote) {
        if (char === quote) quote = ''
        continue
      }
      if (char === '"' || char === "'") {
        quote = char
        continue
      }
      if (char === '>') return i
    }
    return -1
  }

  private static decode(raw: string): { text: string; map: number[] } {
    const chars: string[] = []
    const map: number[] = []
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] !== '&') {
        map.push(i)
        chars.push(raw[i])
        continue
      }
      const semi = raw.indexOf(';', i + 1)
      const body = semi > i && semi - i <= 16 ? raw.slice(i + 1, semi) : ''
      const value = body ? GlossaryMarkup.entity(body) : null
      if (value == null) {
        map.push(i)
        chars.push('&')
        continue
      }
      for (let unit = 0; unit < value.length; unit++) {
        map.push(i)
        chars.push(value[unit])
      }
      i = semi
    }
    map.push(raw.length)
    return { text: chars.join(''), map }
  }

  private static entity(body: string): string | null {
    const named: Record<string, string> = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      nbsp: ' '
    }
    const key = body.toLowerCase()
    if (named[key]) return named[key]
    const code = key.startsWith('#x')
      ? parseInt(key.slice(2), 16)
      : key.startsWith('#')
      ? Number(key.slice(1))
      : NaN
    if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) return null
    return String.fromCodePoint(code)
  }

  private static escapeAttr(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
  }
}
