import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { indexTreatise } from '@/lib/rag/treatise-index'

export const runtime = 'nodejs'
export const maxDuration = 300

// Embed the published treatise chapters and the Chapter 2 glossary for chat retrieval.
export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore: cookies() })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { force } = await req.json().catch(() => ({ force: false }))
    const result = await indexTreatise(supabase, { force: Boolean(force) })
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('Treatise indexing failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Treatise indexing failed' },
      { status: 500 }
    )
  }
}
