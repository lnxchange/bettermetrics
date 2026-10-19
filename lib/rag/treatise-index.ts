import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { DocumentProcessor } from '@/lib/rag/document-processor'

// The source tag chat retrieval filters on (app/api/chat/route.ts, match_documents).
export const TREATISE_SOURCE = 'aim-treatise'

type Client = ReturnType<typeof createClient<Database>>

interface IndexEntry {
  slug: string
  label: string
  title: string
  content: string
}

interface StoredDocument {
  id: string
  metadata: any
}

function sha(text: string) {
  return createHash('sha256').update(text).digest('hex')
}

async function glossaryEntry(supabase: Client): Promise<IndexEntry | null> {
  const { data, error } = await supabase
    .from('glossary_entries')
    .select('term, definition, explanation')
    .order('position', { ascending: true })
  if (error) throw new Error(`glossary: ${error.message}`)
  if (!data || data.length === 0) return null
  const content = data
    .map(row =>
      [`### ${row.term}`, row.definition, row.explanation].filter(Boolean).join('\n\n')
    )
    .join('\n\n')
  return { slug: '2', label: 'Chapter 2', title: 'Glossary', content }
}

/**
 * Embed every treatise chapter, appendix and the Chapter 2 glossary into the
 * chat's vector store (rag_documents + document_embeddings), tagged
 * source = 'aim-treatise'. Unchanged entries are skipped; changed ones are
 * re-embedded; entries no longer in the treatise are removed.
 */
export async function indexTreatise(supabase: Client, options: { force?: boolean } = {}) {
  const { data: chapters, error } = await supabase
    .from('treatise_chapters')
    .select('slug, label, title, markdown')
    .order('position', { ascending: true })
  if (error) throw new Error(`treatise_chapters: ${error.message}`)

  const entries: IndexEntry[] = (chapters ?? []).map(row => ({
    slug: row.slug,
    label: row.label,
    title: row.title,
    content: row.markdown
  }))
  const glossary = await glossaryEntry(supabase)
  if (glossary) entries.push(glossary)

  const { data: storedRows, error: storedError } = await supabase
    .from('rag_documents')
    .select('id, metadata')
    .eq('metadata->>source', TREATISE_SOURCE)
  if (storedError) throw new Error(`rag_documents: ${storedError.message}`)
  const stored = new Map<string, StoredDocument>()
  for (const row of (storedRows ?? []) as StoredDocument[]) {
    const slug = row.metadata?.slug
    if (typeof slug === 'string') stored.set(slug, row)
  }

  const processor = new DocumentProcessor()
  const indexed: string[] = []
  const unchanged: string[] = []

  for (const entry of entries) {
    const source_sha = sha(entry.content)
    const existing = stored.get(entry.slug)
    if (!options.force && existing?.metadata?.source_sha === source_sha) {
      unchanged.push(entry.label)
      continue
    }
    if (existing) await removeDocument(supabase, existing.id)

    const metadata = {
      source: TREATISE_SOURCE,
      slug: entry.slug,
      label: entry.label,
      title: entry.title,
      source_sha
    }
    const { data: inserted, error: insertError } = await supabase
      .from('rag_documents')
      .insert({
        title: `${entry.label}: ${entry.title}`,
        content: entry.content,
        file_type: 'text/markdown',
        metadata
      })
      .select('id')
      .single()
    if (insertError || !inserted) {
      throw new Error(`${entry.label}: ${insertError?.message ?? 'insert failed'}`)
    }
    try {
      await processor.processDocument(
        inserted.id,
        'rag',
        entry.content,
        { source: TREATISE_SOURCE, slug: entry.slug, label: entry.label, title: entry.title },
        `[Treatise, ${entry.label}: ${entry.title}]\n`
      )
    } catch (processError) {
      // Leave no half-indexed document behind; the next run retries it.
      await removeDocument(supabase, inserted.id)
      throw processError
    }
    indexed.push(entry.label)
  }

  const current = new Set(entries.map(entry => entry.slug))
  const removed: string[] = []
  for (const [slug, row] of Array.from(stored.entries())) {
    if (current.has(slug)) continue
    await removeDocument(supabase, row.id)
    removed.push(slug)
  }

  return { indexed, unchanged, removed }
}

async function removeDocument(supabase: Client, id: string) {
  const { error: embeddingError } = await supabase
    .from('document_embeddings')
    .delete()
    .eq('document_id', id)
  if (embeddingError) throw new Error(`document_embeddings ${id}: ${embeddingError.message}`)
  const { error } = await supabase.from('rag_documents').delete().eq('id', id)
  if (error) throw new Error(`rag_documents ${id}: ${error.message}`)
}
