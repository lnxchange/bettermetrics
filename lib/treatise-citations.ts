export interface TreatiseHeading {
  id: string
  text: string
  level: number
}

export interface CitationPart {
  text: string
  href?: string
}

const SECTION_NUMBER = String.raw`\d+[A-Z](?:\.\d+)*|[A-Z](?:\.\d+)+|\d+(?:\.\d+)*`

/**
 * A single locus: "Chapter 12, Section 12.13.1" or "Appendix A, Section A.2.1".
 * Plural forms ("Chapters 6–10", "Sections 9.1 through 9.2") do not match.
 */
const CITATION_SOURCE = String.raw`\b(Chapter\s+(\d+)|Appendix\s+(\d+[A-Z]|[A-Z]))\s*,?\s+Section\s+(${SECTION_NUMBER})`

export function chapterPath(chapter: string) {
  const slug = String(Number(chapter))
  if (slug === '2') return '/glossary'
  return `/treatise/${slug}`
}

export function appendixPath(label: string) {
  return `/treatise/appendix-${label.toLowerCase()}`
}

export function citationHref(chapter: string | undefined, appendix: string | undefined, section: string) {
  const anchor = section.toLowerCase()
  const path = chapter ? chapterPath(chapter) : appendixPath(appendix || '')
  if (path === '/glossary') return path
  return `${path}#${anchor}`
}

export interface TreatiseSectionTarget {
  slug: string
  section: string
}

/** A chapter or appendix link with a section anchor, such as /treatise/12#12.2. */
export function treatiseSectionTarget(href: string): TreatiseSectionTarget | null {
  try {
    const url = new URL(href, 'https://www.usebettermetrics.com')
    const match = url.pathname.match(/^\/treatise\/([^/]+)$/)
    const section = decodeURIComponent(url.hash.replace(/^#/, '')).toLowerCase()
    if (!match || !section || match[1] === '2') return null
    return { slug: match[1], section }
  } catch {
    return null
  }
}

/** Chapter or appendix slug plus section id, in the order the derivation names them. */
export function citationTargets(input: string): { slug: string; section: string }[] {
  if (!input) return []
  const targets: { slug: string; section: string }[] = []
  const re = new RegExp(CITATION_SOURCE, 'g')
  let match: RegExpExecArray | null
  while ((match = re.exec(input)) !== null) {
    const section = match[4].toLowerCase()
    if (match[2]) {
      const slug = String(Number(match[2]))
      if (slug !== '2') targets.push({ slug, section })
    } else if (match[3]) {
      targets.push({ slug: `appendix-${match[3].toLowerCase()}`, section })
    }
  }
  return targets
}

export function splitCitations(input: string): CitationPart[] {
  if (!input) return []
  const re = new RegExp(CITATION_SOURCE, 'g')
  const parts: CitationPart[] = []
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(input)) !== null) {
    const index = match.index
    if (index > last) parts.push({ text: input.slice(last, index) })
    parts.push({
      text: match[0],
      href: citationHref(match[2], match[3], match[4])
    })
    last = index + match[0].length
  }
  if (last < input.length) parts.push({ text: input.slice(last) })
  if (parts.length === 0) parts.push({ text: input })
  return parts
}

/** Turn locus citations in prose into markdown links. Leaves fenced and inline code alone. */
export function linkifyTreatiseMarkdown(markdown: string) {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, index) => (index % 2 === 1 ? part : linkifyProse(part)))
    .join('')
}

function linkifyProse(prose: string) {
  const re = new RegExp(CITATION_SOURCE, 'g')
  return prose.replace(re, (full, _kind, chapter: string | undefined, appendix: string | undefined, section: string) => {
    const href = citationHref(chapter, appendix, section)
    return `[${full}](${href})`
  })
}

const SECTION_AT_START = new RegExp(String.raw`^(${SECTION_NUMBER})\b`)

export function anchorForHeading(plain: string) {
  const match = plain.match(SECTION_AT_START)
  if (match) return match[1].toLowerCase()
  const slug = plain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'section'
}

export function uniqueAnchor(base: string, used: Set<string>) {
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  used.add(id)
  return id
}
