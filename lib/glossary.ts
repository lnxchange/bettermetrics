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

/** Neighbouring entries and the slugs behind cross-reference names. Built from the cached index. */
export async function loadGlossaryContext(slug: string) {
  const index = await loadGlossaryIndex()
  const i = index.findIndex(entry => entry.slug === slug)
  const byTerm = new Map(index.map(entry => [entry.term.toLowerCase(), entry]))
  return {
    previous: i > 0 ? index[i - 1] : null,
    next: i >= 0 && i < index.length - 1 ? index[i + 1] : null,
    resolve: (term: string) => byTerm.get(term.toLowerCase()) ?? null,
    total: index.length
  }
}
