import { cached } from '@/lib/cached'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'

export type GlossaryEntry = Database['public']['Tables']['glossary_entries']['Row']

/** What the index page ships to the browser: enough to list, search and link. */
export interface GlossaryIndexEntry {
  slug: string
  term: string
  letter: string
  preview: string
}

export const GLOSSARY_REVALIDATE = 3600

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

/** First sentence of a definition, capped so 680 previews stay under ~100 KB. */
export function previewOf(definition: string, max = 140) {
  const flat = definition.replace(/\s+/g, ' ').trim()
  const sentence = flat.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? flat
  const text = sentence.length <= max ? sentence : `${flat.slice(0, max - 1).trimEnd()}…`
  return text
}

export const loadGlossaryIndex = cached(
  async (): Promise<GlossaryIndexEntry[]> => {
    const supabase = anonClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('glossary_entries')
      .select('slug, term, letter, definition')
      .order('position', { ascending: true })
      .limit(1000)
    if (error) throw new Error(`Glossary query failed: ${error.message}`)
    return (data ?? []).map(row => ({
      slug: row.slug,
      term: row.term,
      letter: row.letter,
      preview: previewOf(row.definition, 90)
    }))
  },
  ['glossary-index'],
  { revalidate: GLOSSARY_REVALIDATE, tags: ['glossary'] }
)

export const loadGlossaryEntry = cached(
  async (slug: string): Promise<GlossaryEntry | null> => {
    const supabase = anonClient()
    if (!supabase) return null
    const { data, error } = await supabase
      .from('glossary_entries')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw new Error(`Glossary query failed: ${error.message}`)
    return data ?? null
  },
  ['glossary-entry'],
  { revalidate: GLOSSARY_REVALIDATE, tags: ['glossary'] }
)

function glossaryLookupKeys(term: string) {
  const keys = new Set<string>([term.toLowerCase()])
  const axiom = term.match(/^Axiom\s+\d+\s*[-–:]\s*(.+)$/i)
  if (axiom) {
    keys.add(axiom[1].trim().toLowerCase())
    const bare = axiom[1].replace(/\s*\([^)]*\)\s*$/, '').trim()
    if (bare) keys.add(bare.toLowerCase())
  }
  const wrapped = term.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (wrapped) {
    const stem = wrapped[1].trim()
    const inner = wrapped[2].trim()
    if (stem) keys.add(stem.toLowerCase())
    if (inner.length >= 3) keys.add(inner.toLowerCase())
    const stemWithoutParen = stem.replace(/\s*\([^)]*\)\s*$/, '').trim()
    if (stemWithoutParen) keys.add(stemWithoutParen.toLowerCase())
  }
  if (term.includes(',') && term.length < 40 && !term.includes('(')) {
    for (const piece of term.split(',')) {
      const item = piece.trim()
      if (item) keys.add(item.toLowerCase())
    }
  }
  return keys
}

function crossReferenceKeys(name: string) {
  const cleaned = name
    .split(/\.\s+\*?(?:Canonical reference|See)\b/i)[0]
    .trim()
    .replace(/\.$/, '')
    .trim()
  const keys = [cleaned.toLowerCase()]
  const axiomTail = cleaned.match(/^(.*?)\s*\(Axiom\s+\d+\)\s*$/i)
  if (axiomTail) keys.push(axiomTail[1].trim().toLowerCase())
  const trailing = cleaned.match(/^(.*)\s+\(([^)]+)\)\s*$/)
  if (trailing) {
    const stem = trailing[1].trim()
    const inner = trailing[2].trim()
    if (stem) keys.push(stem.toLowerCase())
    if (inner.length >= 3) keys.push(inner.toLowerCase())
  }
  const symbol = cleaned.match(/^[^\s()]+\s*\((.+)\)$/)
  if (symbol && symbol[1].trim().length >= 3) keys.push(symbol[1].trim().toLowerCase())
  return keys
}

/** Match a Chapter 2 cross-reference to a glossary term, including parenthetical aliases. */
export function resolveGlossaryName<T extends { term: string }>(name: string, entries: T[]): T | null {
  const byKey = new Map<string, T>()
  for (const entry of entries) {
    for (const key of Array.from(glossaryLookupKeys(entry.term))) {
      if (!byKey.has(key)) byKey.set(key, entry)
    }
  }
  for (const key of crossReferenceKeys(name)) {
    const found = byKey.get(key)
    if (found) return found
  }
  return null
}

/** Neighbouring entries and the slugs behind cross-reference names. Built from the cached index. */
export async function loadGlossaryContext(slug: string) {
  const index = await loadGlossaryIndex()
  const i = index.findIndex(entry => entry.slug === slug)
  return {
    previous: i > 0 ? index[i - 1] : null,
    next: i >= 0 && i < index.length - 1 ? index[i + 1] : null,
    resolve: (term: string) => resolveGlossaryName(term, index),
    total: index.length
  }
}
