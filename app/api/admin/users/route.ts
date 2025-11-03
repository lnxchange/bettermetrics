import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const perPage = Number(searchParams.get('perPage') || '50')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) {
      return NextResponse.json({ error: 'Failed to list users', details: error }, { status: 500 })
    }

    const users = (data?.users || []).map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at
    }))

    return NextResponse.json({ users, page, perPage, total: data?.total ?? users.length })
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


