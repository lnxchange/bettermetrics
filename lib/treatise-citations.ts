export interface TreatiseHeading {
  id: string
  text: string
  level: number
}

export interface CitationPart {
  text: string
  href?: string
}

/** 12.2, 12A.3, or A.2.1. A bare integer is not a section. */
const SECTION_NUMBER = String.raw`(?:\d+[A-Z](?:\.\d+)*|[A-Z](?:\.\d+)+|\d+(?:\.\d+)+)`
const SECTION_LIST = String.raw`${SECTION_NUMBER}(?:\s*(?:,|and|through)\s+${SECTION_NUMBER})*`

/**
 * Forms the treatise actually uses, longest first:
 * "Chapter 12, Section 12.2", "Section 12.2", "Sections 17.5 and 17.7",
 * "Chapter 8", "Appendix A.5.7.4", "Appendix 12A".
 */
function citationPattern() {
  return new RegExp(
    String.raw`\b(?:Chapter\s+(\d+)\s*,\s+Sections\s+(${SECTION_LIST})|Chapter\s+(\d+)\s*,?\s+Section\s+(${SECTION_NUMBER}|\d+)|Appendix\s+(\d+[A-Z]|[A-Z])\s*,?\s+Section\s+(${SECTION_NUMBER})|Appendix\s+(\d+[A-Z]|[A-Z])((?:\.\d+)+)|Sections\s+(${SECTION_LIST})|Section\s+(${SECTION_NUMBER})|Appendix\s+(\d+[A-Z]|[A-Z])\b(?!\s*,?\s+Section\b)(?!\.\d)|Chapter\s+(\d+)\b(?!\s*,?\s+Sections?\b))`,
    'gi'
  )
}

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

/**
 * A treatise link. An empty section opens the chapter or appendix at its first heading.
 */
export function treatiseSectionTarget(href: string): TreatiseSectionTarget | null {
  try {
    const url = new URL(href, 'https://www.usebettermetrics.com')
    const match = url.pathname.match(/^\/treatise\/([^/]+)$/)
    if (!match || match[1] === '2') return null
    const section = decodeURIComponent(url.hash.replace(/^#/, '')).toLowerCase()
    return { slug: match[1], section }
  } catch {
    return null
  }
}

interface CitationMatch {
  start: number
  end: number
  parts: CitationPart[]
  targets: { slug: string; section: string }[]
}

function sectionLocus(section: string) {
  const value = section.toLowerCase()
  const appendix = value.match(/^\d+[a-z]|^[a-z]/)
  if (appendix) return { appendix: appendix[0], section: value }
  const chapter = value.match(/^\d+/)
  return { chapter: chapter ? String(Number(chapter[0])) : undefined, section: value }
}

function targetFor(locus: { chapter?: string; appendix?: string; section?: string }) {
  if (locus.chapter) {
    const slug = String(Number(locus.chapter))
    if (slug === '2') return null
    return { slug, section: locus.section?.toLowerCase() || '' }
  }
  if (locus.appendix) {
    return { slug: `appendix-${locus.appendix.toLowerCase()}`, section: locus.section?.toLowerCase() || '' }
  }
  return null
}

function linked(text: string, href: string, targets: CitationMatch['targets']): CitationPart {
  const parsed = treatiseSectionTarget(href)
  if (parsed) targets.push(parsed)
  return { text, href }
}

function expandMatch(full: string, groups: string[]): Pick<CitationMatch, 'parts' | 'targets'> {
  const targets: CitationMatch['targets'] = []
  const [
    chapterList,
    list,
    chapterOne,
    sectionOne,
    appendixLabel,
    appendixSection,
    appendixDotted,
    appendixDots,
    bareList,
    bareSection,
    appendixOnly,
    chapterOnly
  ] = groups

  if (chapterOne || appendixLabel) {
    const href = citationHref(chapterOne, appendixLabel, sectionOne || appendixSection)
    return { parts: [linked(full, href, targets)], targets }
  }

  if (appendixDotted) {
    const section = `${appendixDotted}${appendixDots}`
    const href = citationHref(undefined, appendixDotted, section)
    return { parts: [linked(full, href, targets)], targets }
  }

  if (bareSection) {
    const locus = sectionLocus(bareSection)
    const href = citationHref(locus.chapter, locus.appendix, locus.section)
    return { parts: [linked(full, href, targets)], targets }
  }

  if (chapterOnly) {
    const href = chapterPath(chapterOnly)
    const target = targetFor({ chapter: chapterOnly })
    if (target) targets.push(target)
    return { parts: [{ text: full, href }], targets }
  }

  if (appendixOnly) {
    const href = appendixPath(appendixOnly)
    targets.push({ slug: `appendix-${appendixOnly.toLowerCase()}`, section: '' })
    return { parts: [{ text: full, href }], targets }
  }

  const numbers = (chapterList ? list : bareList) || ''
  const parts: CitationPart[] = []
  const numberPattern = new RegExp(SECTION_NUMBER, 'gi')
  let last = 0
  let number: RegExpExecArray | null
  if (chapterList) {
    const word = full.match(/^Chapter\s+\d+/i)
    if (word) {
      parts.push({ text: word[0], href: chapterPath(chapterList) })
      const target = targetFor({ chapter: chapterList })
      if (target) targets.push(target)
      last = word[0].length
    }
  }
  while ((number = numberPattern.exec(numbers)) !== null) {
    const at = full.indexOf(number[0], last)
    if (at < 0) continue
    if (at > last) parts.push({ text: full.slice(last, at) })
    const locus = sectionLocus(number[0])
    const href = citationHref(locus.chapter, locus.appendix, locus.section)
    parts.push(linked(number[0], href, targets))
    last = at + number[0].length
  }
  if (last < full.length) parts.push({ text: full.slice(last) })
  return { parts, targets }
}

function matchCitations(input: string): CitationMatch[] {
  const matches: CitationMatch[] = []
  const re = citationPattern()
  let match: RegExpExecArray | null
  while ((match = re.exec(input)) !== null) {
    const expanded = expandMatch(match[0], match.slice(1))
    matches.push({ start: match.index, end: match.index + match[0].length, ...expanded })
  }
  return matches
}

/** Chapter or appendix slug plus section id, in the order the text names them. */
export function citationTargets(input: string): { slug: string; section: string }[] {
  if (!input) return []
  return matchCitations(input).flatMap(match => match.targets)
}

export function splitCitations(input: string): CitationPart[] {
  if (!input) return []
  const parts: CitationPart[] = []
  let last = 0
  for (const match of matchCitations(input)) {
    if (match.start > last) parts.push({ text: input.slice(last, match.start) })
    parts.push(...match.parts)
    last = match.end
  }
  if (last < input.length) parts.push({ text: input.slice(last) })
  if (parts.length === 0) parts.push({ text: input })
  return parts
}

export interface UnresolvedCitation {
  text: string
  href: string
  slug: string
  section: string
}

/** Citations whose chapter is missing, or whose section is not one of that chapter's headings. */
export function unresolvedCitations(
  markdown: string,
  headingsBySlug: Map<string, Set<string>>
): UnresolvedCitation[] {
  const unresolved: UnresolvedCitation[] = []
  for (const part of splitCitations(markdown)) {
    if (!part.href) continue
    const target = treatiseSectionTarget(part.href)
    if (!target) continue
    const headings = headingsBySlug.get(target.slug)
    if (!headings || (target.section && !headings.has(target.section))) {
      unresolved.push({ text: part.text, href: part.href, slug: target.slug, section: target.section })
    }
  }
  return unresolved
}

/** Turn locus citations in prose into markdown links. Leaves fenced and inline code alone. */
export function linkifyTreatiseMarkdown(markdown: string) {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`|\[[^\]]+\]\([^)]+\))/g)
    .map((part, index) => (index % 2 === 1 ? part : linkifyProse(part)))
    .join('')
}

function linkifyProse(prose: string) {
  const parts = splitCitations(prose)
  return parts
    .map(part => (part.href ? `[${part.text}](${part.href})` : part.text))
    .join('')
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
