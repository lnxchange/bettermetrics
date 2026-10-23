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
    const url = new URL(href, 'https://aimtheory.org')
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

/** Citations whose section is not in the book, or whose chapter or appendix is missing. */
export function unresolvedCitations(markdown: string, index: CorpusIndex): UnresolvedCitation[] {
  const unresolved: UnresolvedCitation[] = []
  for (const part of splitCitations(markdown)) {
    if (!part.href) continue
    const target = treatiseSectionTarget(part.href)
    if (!target) continue
    if (targetExists(index, target.slug, target.section)) continue
    unresolved.push({ text: part.text, href: part.href, slug: target.slug, section: target.section })
  }
  return unresolved
}

export interface LinkifyOptions {
  index?: CorpusIndex
  /** Old section id to where an accepted publish moved it. A null section was removed. */
  history?: Record<string, { slug: string; section: string | null }>
  /** Leave citations as text until the index has loaded. */
  pending?: boolean
}

const UPDATE_NOTE =
  'The treatise has been updated since this chat. This section is no longer in the book. Re-ask the question, or read the chapter.'

/** Turn locus citations in prose into markdown links. Leaves fenced and inline code alone. */
export function linkifyTreatiseMarkdown(markdown: string, options?: LinkifyOptions) {
  if (options?.pending) return markdown
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`|\[[^\]]+\]\([^)]+\))/g)
    .map((part, index) => (index % 2 === 1 ? part : linkifyProse(part, options)))
    .join('')
}

function linkifyProse(prose: string, options?: LinkifyOptions) {
  const parts = options?.index ? applyIndex(splitCitations(prose), options.index, options.history) : splitCitations(prose)
  return parts.map(part => (part.href ? `[${part.text}](${part.href})` : part.text)).join('')
}

function applyIndex(
  parts: CitationPart[],
  index: CorpusIndex,
  history?: LinkifyOptions['history']
): CitationPart[] {
  const resolved: CitationPart[] = []
  for (const part of parts) {
    if (!part.href) {
      resolved.push(part)
      continue
    }
    const target = treatiseSectionTarget(part.href)
    if (!target) {
      resolved.push(part)
      continue
    }
    if (target.section) {
      const id = target.section.toLowerCase()
      const live = index.sections[id]
      if (live) {
        resolved.push({ text: part.text, href: treatisePath(live.slug, id) })
        continue
      }
      if (!history) {
        resolved.push({ text: part.text })
        continue
      }
      const destination = history[id]
      if (destination?.section && index.sections[destination.section]) {
        const current = index.sections[destination.section]
        resolved.push({ text: part.text, href: treatisePath(current.slug, destination.section) })
        continue
      }
      const slug = destination?.slug || chapterSlugFor(id) || target.slug
      resolved.push({ text: part.text })
      resolved.push({ text: ` ([${UPDATE_NOTE}](${treatisePath(slug)}))` })
      continue
    }
    const owner = ownerForSlug(index, target.slug)
    if (index.chapters.includes(target.slug)) {
      resolved.push(part)
      continue
    }
    if (owner) {
      const section = index.sections[ownerKey(target.slug) || '']
      resolved.push({
        text: part.text,
        href: section ? treatisePath(section.slug, ownerKey(target.slug) || '') : treatisePath(owner)
      })
      continue
    }
    if (!history) {
      resolved.push({ text: part.text })
      continue
    }
    resolved.push({ text: part.text })
    resolved.push({ text: ` ([${UPDATE_NOTE}](${treatisePath(target.slug)}))` })
  }
  return resolved
}

// The ebook's heading and body rules (build/crossrefs.py). A heading may be
// "14.1 - Title". A body label must be followed by a capital or a bracket, so
// "4.5 million" is not a section. An appendix heading may live inside a chapter.
const HEADING_SECTION = new RegExp(String.raw`^(${SECTION_NUMBER})(?![\d.])`, 'i')
const APPENDIX_HEADING = /^Appendix\s+([0-9]*[A-Za-z](?:\.\d+)*)(?![A-Za-z0-9])/i
const BODY_LABEL = new RegExp(String.raw`^(${SECTION_NUMBER})[ \u00a0]+[(A-Z]`)

export function headingSectionId(plain: string): string | null {
  const appendix = plain.match(APPENDIX_HEADING)
  if (appendix) return appendix[1].toLowerCase()
  const section = plain.match(HEADING_SECTION)
  if (section) return section[1].toLowerCase()
  return null
}

export function bodyLabelId(plain: string): string | null {
  const stripped = plain.replace(/^\*\*/, '')
  const match = stripped.match(BODY_LABEL)
  return match ? match[1].toLowerCase() : null
}

export function anchorForHeading(plain: string) {
  const section = headingSectionId(plain)
  if (section) return section
  const slug = plain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'section'
}

export interface IndexedSection {
  id: string
  text: string
  level: number
  start: number
  end: number
}

export interface CorpusIndex {
  sections: Record<string, { slug: string; text: string }>
  owners: Record<string, string>
  chapters: string[]
}

export interface SectionChange {
  fromSection: string
  fromSlug: string
  toSection: string | null
  toSlug: string
  text: string
}

export function emptyCorpusIndex(): CorpusIndex {
  return { sections: {}, owners: {}, chapters: [] }
}

export function treatisePath(slug: string, section?: string) {
  if (slug === '2') return '/glossary'
  const path = `/treatise/${slug}`
  return section ? `${path}#${section}` : path
}

function ownerKey(slug: string) {
  const appendix = slug.match(/^appendix-(.+)$/)
  return appendix ? appendix[1] : null
}

function chapterSlugFor(sectionId: string) {
  const locus = sectionLocus(sectionId)
  if (locus.chapter) return locus.chapter
  if (locus.appendix) return `appendix-${locus.appendix}`
  return null
}

function ownerForSlug(index: CorpusIndex, slug: string) {
  if (index.owners[slug]) return index.owners[slug]
  const key = ownerKey(slug)
  return key ? index.owners[key] : undefined
}

export function targetExists(index: CorpusIndex, slug: string, section: string) {
  if (section) return Boolean(index.sections[section.toLowerCase()])
  if (index.chapters.includes(slug)) return true
  return Boolean(ownerForSlug(index, slug))
}

function claim(record: Record<string, string>, key: string, slug: string) {
  const dedicated = `appendix-${key}`
  if (record[key] === dedicated) return
  if (!record[key] || slug === dedicated) record[key] = slug
}

/** Sections in one chapter, in document order, with the span of each. */
export function indexChapter(slug: string, markdown: string): IndexedSection[] {
  const sections: IndexedSection[] = []
  const lines = markdown.split('\n')
  let offset = 0
  let fenced = false
  for (const line of lines) {
    const start = offset
    offset += line.length + 1
    if (line.startsWith('```')) {
      fenced = !fenced
      continue
    }
    if (fenced) continue
    const heading = line.match(/^(#{1,6})[ \t]+(.+)$/)
    if (heading) {
      const text = heading[2].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
      const id = headingSectionId(text)
      if (!id) continue
      sections.push({ id, text, level: Math.max(heading[1].length, 2), start, end: markdown.length })
      continue
    }
    const text = line.replace(/^\*\*/, '').replace(/\s+/g, ' ').trim()
    const id = bodyLabelId(text)
    if (!id) continue
    sections.push({ id, text, level: 5, start, end: markdown.length })
  }
  for (let i = 0; i < sections.length; i++) {
    const next = sections.slice(i + 1).find(section => section.level <= sections[i].level)
    sections[i].end = next ? next.start : markdown.length
  }
  void slug
  return sections
}

export function buildCorpusIndex(chapters: { slug: string; markdown: string }[]): CorpusIndex {
  const index = emptyCorpusIndex()
  for (const chapter of chapters) {
    index.chapters.push(chapter.slug)
    if (/^\d+$/.test(chapter.slug)) claim(index.owners, chapter.slug, chapter.slug)
    const appendix = ownerKey(chapter.slug)
    if (appendix) claim(index.owners, appendix, chapter.slug)
    for (const section of indexChapter(chapter.slug, chapter.markdown)) {
      if (!index.sections[section.id]) index.sections[section.id] = { slug: chapter.slug, text: section.text }
      if (APPENDIX_HEADING.test(section.text) && !section.id.includes('.')) {
        claim(index.owners, section.id, chapter.slug)
      }
    }
  }
  return index
}

function identityText(section: IndexedSection) {
  const stripped = section.text
    .replace(new RegExp(`^${section.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'), '')
    .replace(/^[\s.:—–-]+/, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
  return stripped
}

function bodyKey(markdown: string, section: IndexedSection) {
  return markdown
    .slice(section.start, section.end)
    .replace(new RegExp(section.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueBy(sections: IndexedSection[], key: (section: IndexedSection) => string) {
  const groups = new Map<string, IndexedSection[]>()
  for (const section of sections) {
    const value = key(section)
    if (!value) continue
    const group = groups.get(value) || []
    group.push(section)
    groups.set(value, group)
  }
  const unique = new Map<string, IndexedSection>()
  for (const [value, group] of Array.from(groups.entries())) {
    if (group.length === 1) unique.set(value, group[0])
  }
  return unique
}

/** Renumbered and removed sections, matched within one chapter. */
export function diffChapterSections(
  slug: string,
  previousMarkdown: string,
  nextMarkdown: string
): { moves: SectionChange[]; deletions: SectionChange[] } {
  const previous = indexChapter(slug, previousMarkdown)
  const next = indexChapter(slug, nextMarkdown)
  const matched = new Set<string>()
  const used = new Set<string>()
  const moves: SectionChange[] = []

  const pair = (oldSections: Map<string, IndexedSection>, newSections: Map<string, IndexedSection>) => {
    for (const [key, before] of Array.from(oldSections.entries())) {
      if (matched.has(before.id)) continue
      const after = newSections.get(key)
      if (!after || used.has(after.id)) continue
      matched.add(before.id)
      used.add(after.id)
      if (before.id === after.id) continue
      moves.push({
        fromSection: before.id,
        fromSlug: slug,
        toSection: after.id,
        toSlug: slug,
        text: before.text
      })
    }
  }

  pair(uniqueBy(previous, identityText), uniqueBy(next, identityText))
  pair(
    uniqueBy(
      previous.filter(section => !matched.has(section.id)),
      section => bodyKey(previousMarkdown, section)
    ),
    uniqueBy(
      next.filter(section => !used.has(section.id)),
      section => bodyKey(nextMarkdown, section)
    )
  )

  const deletions: SectionChange[] = []
  const nextIds = new Set(next.map(section => section.id))
  for (const section of previous) {
    if (matched.has(section.id) || nextIds.has(section.id)) continue
    matched.add(section.id)
    deletions.push({
      fromSection: section.id,
      fromSlug: slug,
      toSection: null,
      toSlug: slug,
      text: section.text
    })
  }
  return { moves, deletions }
}

export interface StoredMove {
  from_section: string
  from_slug: string
  to_section: string | null
  to_slug: string
}

/** Walk recorded hops to the section that exists now, or to the chapter it left. */
export function composeRedirects(moves: StoredMove[], index: CorpusIndex) {
  const latest = new Map<string, StoredMove>()
  for (const move of moves) latest.set(move.from_section, move)
  const redirects: Record<string, { slug: string; section: string | null }> = {}
  for (const start of Array.from(latest.keys())) {
    if (index.sections[start]) continue
    const seen = new Set<string>()
    let current = start
    let slug = latest.get(start)?.from_slug || chapterSlugFor(start) || ''
    let removed = false
    while (latest.has(current) && !seen.has(current)) {
      seen.add(current)
      const hop = latest.get(current)
      if (!hop) break
      slug = hop.to_slug || hop.from_slug
      if (!hop.to_section) {
        removed = true
        slug = hop.from_slug
        break
      }
      current = hop.to_section
    }
    if (!removed && index.sections[current]) {
      redirects[start] = { slug: index.sections[current].slug, section: current }
      continue
    }
    redirects[start] = { slug, section: null }
  }
  return redirects
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
