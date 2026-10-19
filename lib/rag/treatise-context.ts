import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'

// Deterministic Treatise context for chat, alongside vector retrieval:
// Chapter 2 definitions of terms the user names, and the opening of any
// chapter the user names by number or by a word in its title.

const CACHE_MS = 10 * 60 * 1000
const MAX_DEFINITIONS = 8
const MAX_CHAPTERS = 2
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
  pattern: RegExp
}

interface ChapterRow {
  slug: string
  label: string
  title: string
  titleWords: string[]
}

let glossaryCache: { at: number; rows: GlossaryRow[] } | null = null
let chapterCache: { at: number; rows: ChapterRow[] } | null = null

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
    .select('term, definition, explanation')
  if (error) throw new Error(`glossary_entries: ${error.message}`)
  const rows = (data ?? [])
    .filter(row => row.term.replace(/\s*\([^)]*\)\s*$/, '').trim().length >= 3)
    .map(row => ({ ...row, pattern: termPattern(row.term) }))
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
  // A word shared by many titles says nothing about which chapter is meant.
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
    .slice(0, MAX_DEFINITIONS)
}

function matchChapters(rows: ChapterRow[], text: string) {
  const named = new Set<string>()
  for (const match of Array.from(text.matchAll(/\bchapter\s+(\d{1,2})\b/gi))) named.add(String(Number(match[1])))
  for (const match of Array.from(text.matchAll(/\bappendix\s+(\d{1,2}[a-z]|[a-z])\b/gi))) {
    named.add(`appendix-${match[1].toLowerCase()}`)
  }
  const queryWords = new Set(
    wordsOf(text).flatMap(word => (word.endsWith('s') ? [word, word.slice(0, -1)] : [word]))
  )
  const scored = rows
    .map(row => ({
      row,
      score: named.has(row.slug) ? 100 : row.titleWords.filter(word => queryWords.has(word)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, MAX_CHAPTERS).map(item => item.row)
}

async function chapterOpenings(rows: ChapterRow[]) {
  const supabase = client()
  if (!supabase || rows.length === 0) return []
  const { data, error } = await supabase
    .from('treatise_chapters')
    .select('slug, label, title, markdown')
    .in('slug', rows.map(row => row.slug))
  if (error) throw new Error(`treatise_chapters: ${error.message}`)
  return (data ?? []).map(row => ({
    label: row.label,
    title: row.title,
    opening: row.markdown.slice(0, CHAPTER_OPENING_CHARS)
  }))
}

/**
 * Returns a context block of Treatise definitions and chapter openings relevant
 * to the conversation, or '' when nothing matches.
 */
export async function treatiseContext(text: string) {
  const [definitions, named] = await Promise.all([
    glossary().then(rows => matchDefinitions(rows, text)),
    chapters().then(rows => matchChapters(rows, text))
  ])
  const openings = await chapterOpenings(named)

  const parts: string[] = []
  if (definitions.length > 0) {
    parts.push(
      'Treatise Definitions [Treatise, Chapter 2]:\n\n' +
        definitions
          .map(row => [`**${row.term}**: ${row.definition}`, row.explanation].filter(Boolean).join('\n'))
          .join('\n\n')
    )
  }
  for (const chapter of openings) {
    parts.push(`[Treatise, ${chapter.label}: ${chapter.title}] (opening of the chapter)\n\n${chapter.opening}`)
  }
  return parts.join('\n\n---\n\n')
}
