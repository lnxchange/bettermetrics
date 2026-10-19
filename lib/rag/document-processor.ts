import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import mammoth from 'mammoth'

export interface DocumentChunk {
  text: string
  metadata: {
    source: string
    chunkIndex: number
    [key: string]: any
  }
}

// Simple text splitter implementation
class SimpleTextSplitter {
  private chunkSize: number
  private chunkOverlap: number

  constructor(chunkSize = 1000, chunkOverlap = 100) {
    this.chunkSize = chunkSize
    this.chunkOverlap = chunkOverlap
  }

  splitText(text: string): string[] {
    const chunks: string[] = []
    let start = 0

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length)
      let chunk = text.slice(start, end)

      // Try to break at paragraph boundaries first, then sentence boundaries
      if (end < text.length) {
        const lastParagraph = chunk.lastIndexOf('\n\n')
        const lastSentence = chunk.lastIndexOf('. ')
        const lastNewline = chunk.lastIndexOf('\n')
        const breakPoint = Math.max(lastParagraph, lastSentence, lastNewline)

        if (breakPoint > start + this.chunkSize * 0.5) {
          chunk = chunk.slice(0, breakPoint + 1)
          start = start + breakPoint + 1 - this.chunkOverlap
        } else {
          start = end - this.chunkOverlap
        }
      } else {
        start = end
      }

      chunks.push(chunk.trim())
    }

    return chunks.filter(chunk => chunk.length > 0)
  }
}

export class DocumentProcessor {
  private supabase: any
  private embeddings: OpenAIEmbeddings
  private textSplitter: SimpleTextSplitter

  constructor() {
    // Use service role client for admin operations
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-large',
      dimensions: 1536 // pgvector ivfflat index limit is 2000; 1536 fits and matches DB
    })

    this.textSplitter = new SimpleTextSplitter(2500, 300)
  }

  async processDocument(
    documentId: string,
    documentType: 'research' | 'rag',
    content: string,
    metadata: any = {},
    chunkPrefix: string = ''
  ): Promise<void> {
    try {
      // Split document into chunks. The prefix (e.g. "[Treatise, Chapter 12: ...]")
      // is embedded with every chunk so the chapter's subject is part of its vector.
      const chunks = (await this.textSplitter.splitText(content)).map(
        chunk => chunkPrefix + chunk
      )

      // The embeddings endpoint rejects a request above 300,000 tokens.
      // A whole chapter is larger than that, so each request stays small.
      const batchSize = 80
      for (let start = 0; start < chunks.length; start += batchSize) {
        const batch = chunks.slice(start, start + batchSize)
        const embeddings = await this.embeddings.embedDocuments(batch)
        const insertData = batch.map((chunk: string, offset: number) => {
          const index = start + offset
          return {
            document_id: documentId,
            document_type: documentType,
            chunk_text: chunk,
            embedding: `[${embeddings[offset].join(',')}]`,
            chunk_index: index,
            metadata: {
              ...metadata,
              chunkLength: chunk.length,
              totalChunks: chunks.length
            }
          }
        })
        const { error } = await this.supabase.from('document_embeddings').insert(insertData)
        if (error) {
          console.error('Error storing embeddings:', error)
          throw new Error('Failed to store document embeddings')
        }
      }

      console.log(
        `Successfully processed document ${documentId} with ${chunks.length} chunks`
      )
    } catch (error) {
      console.error('Error processing document:', error)
      throw error
    }
  }

  async processFile(
    documentId: string,
    documentType: 'research' | 'rag',
    file: File,
    metadata: any = {}
  ): Promise<void> {
    try {
      let content = ''

      // Extract text based on file type
      if (file.type === 'application/pdf') {
        // PDF processing temporarily disabled due to package compatibility issues
        throw new Error(
          'PDF processing is temporarily unavailable. Please use text files for now.'
        )
      } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const buffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({
          buffer: Buffer.from(buffer)
        })
        content = result.value
      } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
        content = await file.text()
      } else {
        throw new Error(`Unsupported file type: ${file.type}`)
      }

      if (!content.trim()) {
        throw new Error('No content extracted from file')
      }

      // Process the extracted content
      await this.processDocument(documentId, documentType, content, {
        ...metadata,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
    } catch (error) {
      console.error('Error processing file:', error)
      throw error
    }
  }

  async searchSimilarDocuments(
    query: string,
    limit: number = 5,
    documentType?: 'research' | 'rag'
  ): Promise<DocumentChunk[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query)

      // Build the query
      let queryBuilder = this.supabase
        .from('document_embeddings')
        .select('chunk_text, metadata, document_id, chunk_index')
        .order('embedding', { ascending: true })
        .limit(limit)

      // Add document type filter if specified
      if (documentType) {
        queryBuilder = queryBuilder.eq('document_type', documentType)
      }

      // Execute the similarity search
      const { data, error } = await queryBuilder

      if (error) {
        console.error('Error searching documents:', error)
        throw new Error('Failed to search documents')
      }

      return data.map((row: any) => ({
        text: row.chunk_text,
        metadata: {
          source: row.document_id,
          chunkIndex: row.chunk_index,
          ...row.metadata
        }
      }))
    } catch (error) {
      console.error('Error in similarity search:', error)
      throw error
    }
  }

  async deleteDocumentEmbeddings(
    documentId: string,
    documentType: 'research' | 'rag'
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('document_embeddings')
        .delete()
        .eq('document_id', documentId)
        .eq('document_type', documentType)

      if (error) {
        console.error('Error deleting embeddings:', error)
        throw new Error('Failed to delete document embeddings')
      }
    } catch (error) {
      console.error('Error deleting embeddings:', error)
      throw error
    }
  }
}
