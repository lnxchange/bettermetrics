import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Check if OPENAI_API_KEY is set
const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
  console.error('Error: OPENAI_API_KEY environment variable is not set')
  console.log('Please run: export OPENAI_API_KEY=your_key_here')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: openaiApiKey })

async function testRagQuery(query) {
  console.log(`\n=== TESTING RAG QUERY: "${query}" ===\n`)
  
  // Step 1: Generate embedding for the query
  console.log('Generating embedding for query...')
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query
  })
  const queryEmbedding = embeddingResponse.data[0].embedding
  console.log(`Embedding generated (${queryEmbedding.length} dimensions)\n`)
  
  // Step 2: Fetch all RAG embeddings and calculate cosine similarity
  console.log('Fetching RAG documents and calculating similarity...')
  const { data, error } = await supabase
    .from('document_embeddings')
    .select('document_id, chunk_text, chunk_index, embedding, metadata')
    .eq('document_type', 'rag')
  
  if (error) {
    console.error('Error fetching documents:', error)
    return
  }
  
  // Calculate cosine similarity for each chunk
  const results = data.map(row => {
    // Parse the embedding from the string format
    let embedding
    if (typeof row.embedding === 'string') {
      embedding = JSON.parse(row.embedding)
    } else {
      embedding = row.embedding
    }
    
    // Calculate cosine similarity
    let dotProduct = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < queryEmbedding.length; i++) {
      dotProduct += queryEmbedding[i] * embedding[i]
      normA += queryEmbedding[i] * queryEmbedding[i]
      normB += embedding[i] * embedding[i]
    }
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
    
    return {
      document_id: row.document_id,
      chunk_index: row.chunk_index,
      chunk_text: row.chunk_text,
      metadata: row.metadata,
      similarity
    }
  })
  
  // Sort by similarity (highest first)
  results.sort((a, b) => b.similarity - a.similarity)
  
  // Show top 10 results
  console.log(`\nTop 10 most similar chunks:\n`)
  for (let i = 0; i < Math.min(10, results.length); i++) {
    const r = results[i]
    console.log(`${i + 1}. Similarity: ${r.similarity.toFixed(4)}`)
    console.log(`   Document: ${r.document_id}, Chunk: ${r.chunk_index}`)
    console.log(`   Title: ${r.metadata?.title || 'N/A'}`)
    console.log(`   Preview: ${r.chunk_text.substring(0, 150).replace(/\n/g, ' ')}...`)
    console.log('')
  }
  
  // Check if chunks above threshold 0.35 contain "quantum epistemology"
  const threshold = 0.35
  const retrievedChunks = results.filter(r => r.similarity >= threshold)
  console.log(`\n=== CHUNKS ABOVE THRESHOLD (${threshold}) ===`)
  console.log(`Found ${retrievedChunks.length} chunks above threshold\n`)
  
  const quantumChunks = retrievedChunks.filter(r => 
    r.chunk_text.toLowerCase().includes('quantum epistemology')
  )
  console.log(`Chunks containing "Quantum Epistemology": ${quantumChunks.length}`)
  
  if (quantumChunks.length > 0) {
    console.log('\n=== SUCCESS! Quantum Epistemology chunks found in retrieval ===\n')
    for (const c of quantumChunks) {
      console.log(`Similarity: ${c.similarity.toFixed(4)}, Chunk ${c.chunk_index}`)
      console.log(`Preview: ${c.chunk_text.substring(0, 300)}...\n`)
    }
  } else {
    console.log('\n=== WARNING: No Quantum Epistemology chunks in retrieval ===')
    console.log('The RAG query may not retrieve the relevant content.')
  }
}

// Run the test
const query = process.argv[2] || 'What is quantum epistemology?'
await testRagQuery(query)
