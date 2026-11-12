import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { openCrmSession } from '@/lib/crm/session'
import { syncSiteUsers } from '@/lib/crm/sync'

export async function GET() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user || session.user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!session.user.email) {
    return NextResponse.json(
      { error: 'Admin account has no email' },
      { status: 400 }
    )
  }

  const opened = await openCrmSession({
    email: session.user.email,
    name:
      typeof session.user.user_metadata?.name === 'string'
        ? session.user.user_metadata.name
        : session.user.email
  })
  if ('error' in opened) {
    return NextResponse.json({ error: opened.error }, { status: opened.status })
  }

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const site = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    await syncSiteUsers(site).catch(error =>
      console.error('CRM user sync failed', error)
    )
  }

  return NextResponse.json({
    access_token: opened.session.accessToken,
    refresh_token: opened.session.refreshToken
  })
}
