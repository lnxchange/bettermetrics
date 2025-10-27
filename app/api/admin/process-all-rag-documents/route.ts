import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { DocumentProcessor } from '@/lib/rag/document-processor'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }
    
    // Check authentication - REQUIRED for admin routes
    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get all RAG documents that haven't been processed yet
    const { data: documents, error: fetchError } = await supabase
      .from('rag_documents')
      .select('id, title, content')
      .not('content', 'is', null)

    if (fetchError) {
      console.error('Error fetching RAG documents:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No RAG documents found to process',
        processed: 0,
        errors: []
      })
    }

    const processor = new DocumentProcessor()
    let processedCount = 0
    const errors: string[] = []

    // Process each document
    for (const document of documents) {
      try {
        // Check if document already has embeddings
        const { data: existingEmbeddings } = await supabase
          .from('document_embeddings')
          .select('id')
          .eq('document_id', document.id)
          .eq('document_type', 'rag')
          .limit(1)

        if (existingEmbeddings && existingEmbeddings.length > 0) {
          console.log(`Document ${document.id} already processed, skipping`)
          continue
        }

        // Process the document
        await processor.processDocument(
          document.id,
          'rag',
          document.content,
          { title: document.title }
        )

        processedCount++
        console.log(`Successfully processed document: ${document.title}`)
      } catch (error) {
        const errorMessage = `Failed to process document ${document.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(errorMessage)
        errors.push(errorMessage)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} out of ${documents.length} documents`,
      processed: processedCount,
      total: documents.length,
      errors: errors
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
