import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
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

    // Require authentication for research document downloads
    const session = await auth({ cookieStore })
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Authentication required to download research documents' 
      }, { status: 401 })
    }

    // Get filename from slug
    const filename = `${params.slug}.pdf`
    const filepath = path.join(process.cwd(), 'public', 'docs', filename)

    const buffer = await readFile(filepath)

    // Optional: Track download in database
    // await trackDownload(params.slug, session.user.email)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
