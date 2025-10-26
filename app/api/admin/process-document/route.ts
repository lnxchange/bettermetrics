import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { DocumentProcessor } from '@/lib/rag/document-processor'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })
    
    const session = await auth({ cookieStore })
    if (!session?.user?.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, documentType } = await req.json()

    if (!documentId || !documentType || !['research', 'rag'].includes(documentType)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const tableName = documentType === 'research' ? 'research_documents' : 'rag_documents'
    
    // Get document from database
    const { data: document, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Process document for RAG
    const processor = new DocumentProcessor()
    
    if (documentType === 'rag' && 'content' in document && document.content) {
      // Process text content directly
      await processor.processDocument(
        documentId,
        documentType,
        document.content,
        'metadata' in document ? document.metadata || {} : {}
      )
    } else if (document.file_url) {
      // For now, we'll need to fetch the file content
      // This is a simplified version - in production you might want to store content in DB
      return NextResponse.json({ 
        error: 'File processing not yet implemented. Please use text content for RAG documents.' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Document processed successfully' 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
