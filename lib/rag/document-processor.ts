import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'

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
}
