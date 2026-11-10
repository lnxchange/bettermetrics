import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { crmConfig } from '@/lib/crm/config'
import { syncSiteUsers, syncStoredContactMessages } from '@/lib/crm/sync'

export async function POST() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user || session.user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!crmConfig()) {
    return NextResponse.json({ error: 'CRM database is not configured' }, { status: 503 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Site database is not configured' }, { status: 503 })
  }

  const site = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const users = await syncSiteUsers(site)
    const messages = await syncStoredContactMessages(site)
    return NextResponse.json({ users, messages })
  } catch (error) {
    console.error('CRM sync failed', error)
    return NextResponse.json({ error: 'CRM sync failed' }, { status: 500 })
  }
}
