import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'

export interface SearchResult {
  chunk_text: string
  metadata: any
  document_id: string
  chunk_index: number
  similarity_score?: number
}

export class VectorSearch {
  private supabase: any
  private embeddings: OpenAIEmbeddings

  constructor() {
    // Use service role client for admin operations
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    })
  }

  async searchSimilarDocuments(
    query: string,
    limit: number = 5,
    documentType?: 'research' | 'rag',
    threshold: number = 0.7
  ): Promise<SearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query)

      // Use pgvector cosine similarity search
      const { data, error } = await this.supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        document_type: documentType || null
      })

      if (error) {
        console.error('Error in vector search:', error)
        throw new Error('Failed to search documents')
      }

      return data || []
    } catch (error) {
      console.error('Error in similarity search:', error)
      throw error
    }
  }

  async searchWithContext(
    query: string,
    contextLimit: number = 3,
    documentType?: 'research' | 'rag'
  ): Promise<string> {
    try {
      const results = await this.searchSimilarDocuments(
        query,
        contextLimit,
        documentType
      )

      if (results.length === 0) {
        return ''
      }

      // Format results as context
      const context = results
        .map((result, index) => `[Context ${index + 1}]: ${result.chunk_text}`)
        .join('\n\n')

      return `Relevant context from research documents:\n\n${context}`
    } catch (error) {
      console.error('Error generating context:', error)
      return ''
    }
  }
}
