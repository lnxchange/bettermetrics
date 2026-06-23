import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listDocuments() {
  console.log('\n=== CURRENT RAG DOCUMENTS ===\n')
  
  // Get all unique document IDs with their metadata - get all rows to capture metadata
  const { data, error } = await supabase
    .from('document_embeddings')
    .select('document_id, document_type, metadata, chunk_index')
    .eq('document_type', 'rag')
    .order('document_id')
  
  if (error) {
    console.error('Error fetching documents:', error)
    return
  }
  
  // Group by document_id to get unique documents
  const documents = {}
  for (const row of data) {
    if (!documents[row.document_id]) {
      documents[row.document_id] = {
        document_id: row.document_id,
        document_type: row.document_type,
        metadata: row.metadata || {},
        chunk_count: 0
      }
    }
    // Update metadata if current row has more info
    if (row.metadata?.fileName && !documents[row.document_id].metadata?.fileName) {
      documents[row.document_id].metadata = row.metadata
    }
    documents[row.document_id].chunk_count++
  }
  
  console.log(`Found ${Object.keys(documents).length} unique RAG documents:\n`)
  
  for (const doc of Object.values(documents)) {
    const fileName = doc.metadata?.fileName || 'No file name'
    console.log(`[${doc.chunk_count} chunks] ${fileName}`)
    console.log(`  ID: ${doc.document_id}`)
    console.log(`  Metadata: ${JSON.stringify(doc.metadata)}`)
    console.log('')
  }
  
  return documents
}

async function sampleDocumentContent(documentId, chunkIndex = null) {
  console.log(`\n=== SAMPLE CONTENT FOR ${documentId} ===\n`)
  
  let query = supabase
    .from('document_embeddings')
    .select('chunk_text, chunk_index')
    .eq('document_id', documentId)
    .eq('document_type', 'rag')
    .order('chunk_index')
  
  if (chunkIndex !== null) {
    query = query.eq('chunk_index', parseInt(chunkIndex))
  } else {
    query = query.limit(3)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  for (const row of data) {
    console.log(`--- Chunk ${row.chunk_index} ---`)
    console.log(row.chunk_text + '\n')
  }
}

async function searchQuantumEpistemology() {
  console.log('\n=== SEARCHING FOR "Quantum Epistemology" ===\n')
  
  const { data, error } = await supabase
    .from('document_embeddings')
    .select('document_id, chunk_text, chunk_index')
    .eq('document_type', 'rag')
    .ilike('chunk_text', '%quantum epistemology%')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Found ${data.length} chunks containing "Quantum Epistemology":\n`)
  
  for (const row of data) {
    console.log(`Document: ${row.document_id}, Chunk: ${row.chunk_index}`)
    console.log(`Content preview: ${row.chunk_text.substring(0, 200)}...\n`)
  }
  
  return data
}

async function deleteDocument(documentId) {
  console.log(`\nDeleting document: ${documentId}...`)
  
  const { error, count } = await supabase
    .from('document_embeddings')
    .delete()
    .eq('document_id', documentId)
    .eq('document_type', 'rag')
  
  if (error) {
    console.error(`Error deleting document ${documentId}:`, error)
    return false
  }
  
  console.log(`Successfully deleted document: ${documentId}`)
  return true
}

async function deleteOldBatches() {
  // Correct old batch document IDs (verified from database)
  const oldBatchIds = [
    'b6486031-b778-4ccd-9775-1eec51f5c674', // BATCH 1 — AIM CORE ARCHITECTURE
    '0078c649-4691-4f6a-9387-d716bb3697e6', // Batch 2 — Testable Hypotheses
    'cb48e4dc-2c0c-42d2-9809-82e37153316f'  // Batch 3 — AI Assay + Supplementary
  ]
  
  console.log('\n=== DELETING OLD BATCH DOCUMENTS ===\n')
  
  for (const docId of oldBatchIds) {
    await deleteDocument(docId)
  }
  
  console.log('\n=== DONE ===\n')
}

// Run the script
const command = process.argv[2]
const arg2 = process.argv[3]

if (command === 'list') {
  await listDocuments()
} else if (command === 'search-quantum') {
  await searchQuantumEpistemology()
} else if (command === 'sample' && arg2) {
  const chunkArg = process.argv[4] || null
  await sampleDocumentContent(arg2, chunkArg)
} else if (command === 'delete-old') {
  await listDocuments()
  console.log('\nProceeding to delete old batch documents...')
  await deleteOldBatches()
  console.log('\nFinal state:')
  await listDocuments()
} else if (command === 'delete' && arg2) {
  await deleteDocument(arg2)
} else {
  console.log('Usage:')
  console.log('  node scripts/manage-rag-docs.mjs list            - List all RAG documents')
  console.log('  node scripts/manage-rag-docs.mjs search-quantum  - Search for Quantum Epistemology')
  console.log('  node scripts/manage-rag-docs.mjs sample <id>     - Sample content from a document')
  console.log('  node scripts/manage-rag-docs.mjs delete <id>     - Delete a specific document')
  console.log('  node scripts/manage-rag-docs.mjs delete-old      - Delete old batch documents')
}
