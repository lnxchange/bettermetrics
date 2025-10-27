import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient, createClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - returning empty documents list')
      return NextResponse.json({ documents: [] })
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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'research' or 'rag'

    if (!type || !['research', 'rag'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      )
    }

    const tableName =
      type === 'research' ? 'research_documents' : 'rag_documents'

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - returning service unavailable')
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

    const formData = await req.formData()
    const type = formData.get('type') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const metadata = formData.get('metadata') as string
    const file = formData.get('file') as File

    if (!type || !['research', 'rag'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // For RAG documents, content is required
    if (type === 'rag' && !content) {
      return NextResponse.json({ error: 'Content is required for RAG documents' }, { status: 400 })
    }

    let fileUrl = null
    let fileType = null
    let fileSize = null

    // Handle file upload if provided
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`
      const bucketName =
        type === 'research' ? 'research-documents' : 'rag-documents'

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        )
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from(bucketName).getPublicUrl(fileName)

      fileUrl = publicUrl
      fileType = file.type
      fileSize = file.size
    }

    // Parse metadata if provided
    let parsedMetadata = {}
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata)
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid metadata JSON' },
          { status: 400 }
        )
      }
    }

    const tableName =
      type === 'research' ? 'research_documents' : 'rag_documents'
    
    // Ensure we have a valid user ID
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
    }
    
    const insertData: any = {
      title,
      uploaded_by: userId
    }

    if (type === 'research') {
      insertData.description = description
      insertData.file_url = fileUrl
      insertData.file_type = fileType
      insertData.file_size = fileSize
    } else {
      insertData.content = content
      insertData.file_url = fileUrl
      insertData.file_type = fileType
      insertData.metadata = parsedMetadata
    }

    // Add comprehensive logging
    console.log('Insert data:', {
      ...insertData,
      content: content ? `${content.substring(0, 100)}...` : 'No content'
    })
    console.log('Session user:', session?.user?.id)
    console.log('User metadata:', session?.user?.user_metadata)
    console.log('Table name:', tableName)

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Database error details:', {
        error,
        insertData: {
          ...insertData,
          content: content ? `${content.substring(0, 100)}...` : 'No content'
        },
        tableName
      })
      return NextResponse.json(
        { error: `Failed to insert document: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ document: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - returning service unavailable')
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

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id || !type || !['research', 'rag'].includes(type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const tableName =
      type === 'research' ? 'research_documents' : 'rag_documents'

    // Get document to find file URL
    const { data: document, error: fetchError } = await supabase
      .from(tableName)
      .select('file_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting document:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    // Delete file from storage if exists
    if (document.file_url) {
      const bucketName =
        type === 'research' ? 'research-documents' : 'rag-documents'
      const fileName = document.file_url.split('/').pop()

      if (fileName) {
        await supabase.storage.from(bucketName).remove([fileName])
      }
    }

    // Delete related embeddings
    await supabase
      .from('document_embeddings')
      .delete()
      .eq('document_id', id)
      .eq('document_type', type)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
