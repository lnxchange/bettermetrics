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

      console.log('Query embedding generated:', queryEmbedding.length, 'dimensions')

      // First try the match_documents function
      try {
        const { data, error } = await this.supabase.rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: threshold,
          match_count: limit,
          document_type: documentType || null
        })

        if (error) {
          console.error('match_documents function error:', error)
          throw new Error(`match_documents function failed: ${error.message}`)
        }

        console.log('match_documents results:', data?.length || 0, 'results')
        return data || []
      } catch (rpcError) {
        console.error('RPC function failed, trying direct query:', rpcError)
        
        // Fallback: Direct query to document_embeddings table
        let queryBuilder = this.supabase
          .from('document_embeddings')
          .select('chunk_text, metadata, document_id, chunk_index, embedding')
          .limit(limit)

        // Add document type filter if specified
        if (documentType) {
          queryBuilder = queryBuilder.eq('document_type', documentType)
        }

        const { data: embeddings, error: directError } = await queryBuilder

        if (directError) {
          console.error('Direct query error:', directError)
          throw new Error(`Direct query failed: ${directError.message}`)
        }

        if (!embeddings || embeddings.length === 0) {
          console.log('No embeddings found in database')
          return []
        }

        console.log('Found', embeddings.length, 'embeddings, calculating similarities...')

        // Calculate cosine similarity manually
        const results = embeddings
          .map((row: any) => {
            if (!row.embedding) {
              return null
            }

            // Parse embedding from string format if needed
            let embeddingArray: number[]
            if (typeof row.embedding === 'string') {
              try {
                // Remove brackets and split by comma, then parse as numbers
                const cleanString = row.embedding.replace(/[\[\]]/g, '')
                embeddingArray = cleanString.split(',').map(Number)
              } catch (e) {
                console.error('Error parsing embedding string:', e)
                return null
              }
            } else if (Array.isArray(row.embedding)) {
              embeddingArray = row.embedding
            } else {
              return null
            }

            // Calculate cosine similarity
            const similarity = this.calculateCosineSimilarity(queryEmbedding, embeddingArray)
            
            return {
              chunk_text: row.chunk_text,
              metadata: row.metadata,
              document_id: row.document_id,
              chunk_index: row.chunk_index,
              similarity_score: similarity
            }
          })
          .filter((result: any) => result && result.similarity_score >= threshold)
          .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
          .slice(0, limit)

        console.log('Manual similarity calculation results:', results.length, 'results above threshold')
        return results
      }
    } catch (error) {
      console.error('Error in similarity search:', error)
      throw error
    }
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (normA * normB)
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
