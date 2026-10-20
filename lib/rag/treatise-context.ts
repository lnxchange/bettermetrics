import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { anchorForHeading, citationTargets, uniqueAnchor } from '@/lib/treatise-citations'

// When the user names a glossary term, the definition and the chapter that
// derives it are the answer. Otherwise, a short chapter opening still helps
// a question that names a chapter without naming a term.

const CACHE_MS = 10 * 60 * 1000
const CHAPTER_BUDGET = 550_000
const CHAPTER_OPENING_CHARS = 8000

const TITLE_STOPWORDS = new Set([
  'about', 'after', 'against', 'and', 'architecture', 'between', 'chapter', 'from',
  'human', 'into', 'motivation', 'of', 'the', 'theory', 'their', 'through', 'under',
  'what', 'when', 'where', 'which', 'with', 'within', 'without', 'appendix'
])

interface GlossaryRow {
  term: string
  definition: string
  explanation: string
  derivation: string | null
  epistemic_status: string | null
  pattern: RegExp
}

interface ChapterSummary {
  slug: string
  label: string
  title: string
  titleWords: string[]
}

interface ChapterText extends ChapterSummary {
  markdown: string
}

interface HeadingSpan {
  id: string
  level: number
  start: number
  end: number
}

export interface TreatiseContextResult {
  text: string
  /** A glossary definition and the chapter that derives it are both attached. */
  grounded: boolean
}

let glossaryCache: { at: number; rows: GlossaryRow[] } | null = null
let chapterCache: { at: number; rows: ChapterSummary[] } | null = null

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// "Money (M-Object)" is matched as "money"; plural forms match too.
function termPattern(term: string) {
  const base = term.replace(/\s*\([^)]*\)\s*$/, '').trim()
  const words = base.split(/\s+/).map(escapeRegExp).join('[\\s-]+')
  return new RegExp(`\\b${words}(?:s|es)?\\b`, 'i')
}

function wordsOf(text: string) {
  return text.toLowerCase().match(/[a-z]+/g) ?? []
}

async function glossary() {
  if (glossaryCache && Date.now() - glossaryCache.at < CACHE_MS) return glossaryCache.rows
  const supabase = client()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('glossary_entries')
    .select('term, definition, explanation, derivation, epistemic_status')
  if (error) throw new Error(`glossary_entries: ${error.message}`)
  const rows = (data ?? [])
    .filter(row => row.term.replace(/\s*\([^)]*\)\s*$/, '').trim().length >= 3)
    .map(row => ({
      term: row.term,
      definition: row.definition,
      explanation: row.explanation ?? '',
      derivation: row.derivation,
      epistemic_status: row.epistemic_status,
      pattern: termPattern(row.term)
    }))
  glossaryCache = { at: Date.now(), rows }
  return rows
}

async function chapters() {
  if (chapterCache && Date.now() - chapterCache.at < CACHE_MS) return chapterCache.rows
  const supabase = client()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('treatise_chapters')
    .select('slug, label, title')
    .order('position', { ascending: true })
  if (error) throw new Error(`treatise_chapters: ${error.message}`)
  const rows = (data ?? []).map(row => ({
    ...row,
    titleWords: wordsOf(row.title).filter(word => word.length >= 4 && !TITLE_STOPWORDS.has(word))
  }))
  const counts = new Map<string, number>()
  for (const row of rows) {
    for (const word of Array.from(new Set(row.titleWords))) counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  for (const row of rows) row.titleWords = row.titleWords.filter(word => (counts.get(word) ?? 0) <= 2)
  chapterCache = { at: Date.now(), rows }
  return rows
}

function matchDefinitions(rows: GlossaryRow[], text: string) {
  return rows
    .filter(row => row.pattern.test(text))
    .sort((a, b) => b.term.length - a.term.length)
}

function matchChapters(rows: ChapterSummary[], text: string) {
  const named = new Set<string>()
  for (const match of Array.from(text.matchAll(/\bchapter\s+(\d{1,2})\b/gi))) named.add(String(Number(match[1])))
  for (const match of Array.from(text.matchAll(/\bappendix\s+(\d{1,2}[a-z]|[a-z])\b/gi))) {
    named.add(`appendix-${match[1].toLowerCase()}`)
  }
  const queryWords = new Set(
    wordsOf(text).flatMap(word => (word.endsWith('s') ? [word, word.slice(0, -1)] : [word]))
  )
  return rows
    .map(row => ({
      row,
      score: named.has(row.slug) ? 100 : row.titleWords.filter(word => queryWords.has(word)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => item.row)
}

function homeChapter(definitions: GlossaryRow[]) {
  const counts = new Map<string, number>()
  let lead = ''
  for (const row of definitions) {
    for (const target of citationTargets(row.derivation ?? '')) {
      if (!lead) lead = target.slug
      counts.set(target.slug, (counts.get(target.slug) ?? 0) + 1)
    }
  }
  let best = ''
  let bestCount = 0
  for (const [slug, count] of Array.from(counts.entries())) {
    if (count > bestCount) {
      best = slug
      bestCount = count
    }
  }
  return best || lead
}

function headingSpans(markdown: string): HeadingSpan[] {
  const spans: HeadingSpan[] = []
  const re = /^(#{2,4})\s+(.+)$/gm
  const used = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = re.exec(markdown)) !== null) {
    const plain = match[2].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
    spans.push({
      id: uniqueAnchor(anchorForHeading(plain), used),
      level: match[1].length,
      start: match.index,
      end: markdown.length
    })
  }
  for (let i = 0; i < spans.length; i++) {
    for (let j = i + 1; j < spans.length; j++) {
      if (spans[j].level <= spans[i].level) {
        spans[i].end = spans[j].start
        break
      }
    }
  }
  return spans
}

function formatDefinition(row: GlossaryRow) {
  const status = row.epistemic_status?.replace(/\s+/g, ' ').trim()
  return [
    `**${row.term}**`,
    status ? `Epistemic status: ${status}` : '',
    row.definition,
    row.explanation,
    row.derivation ? `Derivation: ${row.derivation}` : ''
  ]
    .filter(Boolean)
    .join('\n\n')
}

function formatChapter(chapter: ChapterText, body: string, note: string) {
  return `[Treatise, ${chapter.label}: ${chapter.title}]${note}\n\n${body.trim()}`
}

async function loadChapters(slugs: string[]) {
  const supabase = client()
  if (!supabase || slugs.length === 0) return []
  const { data, error } = await supabase
    .from('treatise_chapters')
    .select('slug, label, title, markdown')
    .in('slug', slugs)
  if (error) throw new Error(`treatise_chapters: ${error.message}`)
  return (data ?? []).map(row => ({ ...row, titleWords: [] as string[] }))
}

function citedSections(chapter: ChapterText, sections: string[]) {
  const spans = headingSpans(chapter.markdown)
  const wanted = new Set(sections)
  return spans
    .filter(span => wanted.has(span.id))
    .map(span =>
      formatChapter(chapter, chapter.markdown.slice(span.start, span.end), `, Section ${span.id}`)
    )
}

function neighbourSections(chapter: ChapterText, sections: string[], budget: number) {
  const spans = headingSpans(chapter.markdown)
  if (spans.length === 0) return []
  const wanted = new Set(sections)
  const seeds = spans.map((span, index) => (wanted.has(span.id) ? index : -1)).filter(index => index >= 0)
  const order = seeds.length > 0 ? seeds : [0]
  const chosen = new Set<number>(order)
  const ranked = spans
    .map((_, index) => ({
      index,
      distance: Math.min(...order.map(seed => Math.abs(index - seed)))
    }))
    .filter(item => !chosen.has(item.index))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)

  let used = spans
    .filter(span => wanted.has(span.id))
    .reduce((sum, span) => sum + (span.end - span.start), 0)
  const extras: number[] = []
  for (const item of ranked) {
    const span = spans[item.index]
    const size = span.end - span.start
    if (used + size > budget) continue
    extras.push(item.index)
    used += size
  }
  return [...order, ...extras]
    .sort((a, b) => a - b)
    .map(index => {
      const span = spans[index]
      return formatChapter(chapter, chapter.markdown.slice(span.start, span.end), `, Section ${span.id}`)
    })
}

function chapterMaterial(definitions: GlossaryRow[], loaded: ChapterText[]) {
  const bySlug = new Map(loaded.map(chapter => [chapter.slug, chapter]))
  const homeSlug = homeChapter(definitions)
  const home = bySlug.get(homeSlug)
  if (!home) return []

  const targets = definitions.flatMap(row => citationTargets(row.derivation ?? ''))
  const elsewhere = targets.filter(target => target.slug !== home.slug && target.section)
  const otherBlocks: string[] = []
  for (const target of elsewhere) {
    const chapter = bySlug.get(target.slug)
    if (!chapter) continue
    otherBlocks.push(...citedSections(chapter, [target.section]))
  }

  if (home.markdown.length <= CHAPTER_BUDGET) {
    const blocks = [formatChapter(home, home.markdown, '')]
    let used = home.markdown.length
    for (const block of otherBlocks) {
      if (used + block.length > CHAPTER_BUDGET) break
      blocks.push(block)
      used += block.length
    }
    return blocks
  }

  const homeSections = targets
    .filter(target => target.slug === home.slug && target.section)
    .map(target => target.section)
  const homeBlocks = neighbourSections(home, homeSections, CHAPTER_BUDGET)
  const blocks = [...homeBlocks]
  let used = homeBlocks.reduce((sum, block) => sum + block.length, 0)
  for (const block of otherBlocks) {
    if (used + block.length > CHAPTER_BUDGET) break
    blocks.push(block)
    used += block.length
  }
  return blocks
}

/**
 * Definitions and treatise text for this conversation.
 * `grounded` is true when a named term brought its definition and its chapter.
 */
export async function treatiseContext(text: string): Promise<TreatiseContextResult> {
  const [definitions, named] = await Promise.all([
    glossary().then(rows => matchDefinitions(rows, text)),
    chapters().then(rows => matchChapters(rows, text))
  ])

  const parts: string[] = []
  if (definitions.length > 0) {
    parts.push(
      'Treatise Definitions [Treatise, Chapter 2]:\n\n' +
        definitions.map(formatDefinition).join('\n\n---\n\n')
    )
  }

  let grounded = false
  if (definitions.length > 0) {
    const targets = definitions.flatMap(row => citationTargets(row.derivation ?? ''))
    const slugs = Array.from(new Set([homeChapter(definitions), ...targets.map(target => target.slug)].filter(Boolean)))
    const loaded = await loadChapters(slugs)
    const blocks = chapterMaterial(definitions, loaded)
    grounded = blocks.length > 0
    parts.push(...blocks)
  } else if (named.length > 0) {
    const loaded = await loadChapters(named.map(row => row.slug))
    for (const chapter of loaded) {
      parts.push(
        formatChapter(chapter, chapter.markdown.slice(0, CHAPTER_OPENING_CHARS), ' (opening of the chapter)')
      )
    }
  }

  return { text: parts.join('\n\n---\n\n'), grounded }
}
