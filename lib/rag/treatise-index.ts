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

function sha(text: string) {
  return createHash('sha256').update(text).digest('hex')
}

async function glossaryEntry(supabase: Client): Promise<IndexEntry | null> {
  const { data, error } = await supabase
    .from('glossary_entries')
    .select('term, definition, explanation, derivation')
    .order('position', { ascending: true })
  if (error) throw new Error(`glossary: ${error.message}`)
  if (!data || data.length === 0) return null
  const content = data
    .map(row =>
      [`### ${row.term}`, row.definition, row.explanation, row.derivation ? `Derivation: ${row.derivation}` : '']
        .filter(Boolean)
        .join('\n\n')
    )
    .join('\n\n')
  return { slug: '2', label: 'Chapter 2', title: 'Glossary', content }
}

interface StoredDocument {
  id: string
  title: string
  content: string
  metadata: any
}

// The October documents were embedded before slug and source_sha existed.
// "Chapter 01 - ..." and "Appendix 12A - ..." still name the same works.
function documentKey(title: string, metadata: any) {
  if (typeof metadata?.slug === 'string' && metadata.slug) return metadata.slug as string
  const chapter = title.match(/^chapter\s+0*(\d+)\b/i)
  if (chapter) return chapter[1]
  const appendix = title.match(/^appendix\s+([0-9]+[a-z]|[a-z])\b/i)
  if (appendix) return `appendix-${appendix[1].toLowerCase()}`
  return ''
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
    .select('id, title, content, metadata')
    .eq('metadata->>source', TREATISE_SOURCE)
  if (storedError) throw new Error(`rag_documents: ${storedError.message}`)
  const stored = (storedRows ?? []) as StoredDocument[]
  const claimed = new Set<string>()

  const processor = new DocumentProcessor()
  const indexed: string[] = []
  const unchanged: string[] = []

  for (const entry of entries) {
    const source_sha = sha(entry.content)
    const candidates = stored.filter(row => documentKey(row.title, row.metadata) === entry.slug && !claimed.has(row.id))
    const existing =
      candidates.find(row => sha(row.content) === source_sha) ??
      candidates.find(row => row.metadata?.slug === entry.slug) ??
      candidates[0]

    if (existing && !options.force && sha(existing.content) === source_sha) {
      claimed.add(existing.id)
      const metadata = {
        ...(existing.metadata ?? {}),
        source: TREATISE_SOURCE,
        slug: entry.slug,
        label: entry.label,
        title: entry.title,
        source_sha
      }
      if (existing.metadata?.slug !== entry.slug || existing.metadata?.source_sha !== source_sha) {
        const { error: stampError } = await supabase
          .from('rag_documents')
          .update({ metadata })
          .eq('id', existing.id)
        if (stampError) throw new Error(`${entry.label}: ${stampError.message}`)
      }
      unchanged.push(entry.label)
      continue
    }

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
      // The previous copy stays searchable. The next run retries this one.
      await removeDocument(supabase, inserted.id)
      throw processError
    }
    if (existing) await removeDocument(supabase, existing.id)
    claimed.add(inserted.id)
    if (existing) claimed.add(existing.id)
    indexed.push(entry.label)
  }

  const removed: string[] = []
  for (const row of stored) {
    if (claimed.has(row.id)) continue
    await removeDocument(supabase, row.id)
    removed.push(row.title)
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
