import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
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

    // Get all RAG documents
    const { data: documents, error: docsError } = await supabase
      .from('rag_documents')
      .select('id, title, content, created_at')
      .order('created_at', { ascending: false })

    if (docsError) {
      return NextResponse.json({ error: 'Failed to fetch documents', details: docsError }, { status: 500 })
    }

    // Get all embeddings for RAG documents
    const { data: embeddings, error: embError } = await supabase
      .from('document_embeddings')
      .select('document_id, document_type, chunk_text, chunk_index, created_at')
      .eq('document_type', 'rag')
      .order('created_at', { ascending: false })

    if (embError) {
      return NextResponse.json({ error: 'Failed to fetch embeddings', details: embError }, { status: 500 })
    }

    // Count embeddings per document
    const embeddingsByDoc = embeddings?.reduce((acc, emb) => {
      acc[emb.document_id] = (acc[emb.document_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Test vector search function
    let searchTest = null
    try {
      const { data: searchData, error: searchError } = await supabase.rpc('match_documents', {
        query_embedding: new Array(1536).fill(0), // Dummy embedding
        match_threshold: 0.7,
        match_count: 3,
        document_type: 'rag'
      })
      
      searchTest = {
        success: !searchError,
        error: searchError?.message || null,
        resultCount: searchData?.length || 0
      }
    } catch (error) {
      searchTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        resultCount: 0
      }
    }

    return NextResponse.json({
      success: true,
      documents: {
        total: documents?.length || 0,
        list: documents?.map(doc => ({
          id: doc.id,
          title: doc.title,
          hasContent: !!doc.content,
          contentLength: doc.content?.length || 0,
          embeddingCount: embeddingsByDoc[doc.id] || 0,
          created_at: doc.created_at
        })) || []
      },
      embeddings: {
        total: embeddings?.length || 0,
        byDocument: embeddingsByDoc
      },
      vectorSearch: searchTest,
      summary: {
        documentsWithContent: documents?.filter(doc => doc.content && doc.content.trim().length > 0).length || 0,
        documentsWithEmbeddings: Object.keys(embeddingsByDoc).length,
        totalEmbeddings: embeddings?.length || 0
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
