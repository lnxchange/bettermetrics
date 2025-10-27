import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = cookies()
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        error: 'Authentication service not available' 
      }, { status: 503 })
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    // Require authentication for research document downloads
    const session = await auth({ cookieStore })
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Authentication required to download research documents' 
      }, { status: 401 })
    }

    // Find document by slug (title converted to slug)
    const { data: document, error: docError } = await supabase
      .from('research_documents')
      .select('*')
      .ilike('title', `%${params.slug.replace(/-/g, ' ')}%`)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Track the download
    const { error: trackError } = await supabase
      .from('download_tracking')
      .insert({
        user_id: session.user.id,
        document_id: document.id,
        user_email: session.user.email,
        user_metadata: {
          downloaded_document: document.title,
          user_agent: req.headers.get('user-agent') || 'unknown'
        }
      })

    if (trackError) {
      console.error('Error tracking download:', trackError)
      // Continue with download even if tracking fails
    }

    // Get file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('research-documents')
      .download(document.file_url.split('/').pop() || '')

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Return file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': document.file_type || 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.title}.pdf"`
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
