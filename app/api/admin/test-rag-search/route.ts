import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { VectorSearch } from '@/lib/rag/vector-search'

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

    const { query } = await req.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    // Test vector search
    const vectorSearch = new VectorSearch()
    
    try {
      const results = await vectorSearch.searchSimilarDocuments(query, 5, 'rag', 0.5)
      
      return NextResponse.json({
        success: true,
        query,
        results: results.map(result => ({
          chunk_text: result.chunk_text.substring(0, 200) + '...',
          similarity_score: result.similarity_score,
          document_id: result.document_id,
          chunk_index: result.chunk_index
        })),
        resultCount: results.length
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        query,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        resultCount: 0
      })
    }

  } catch (error) {
    console.error('Test search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
