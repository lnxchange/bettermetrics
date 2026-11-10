import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { upsertSyncedContact } from '@/lib/crm/sync'

export async function GET() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const metadata = session.user.user_metadata || {}
  return NextResponse.json({
    email: session.user.email,
    firstName: metadata.first_name || '',
    lastName: metadata.last_name || ''
  })
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const firstName = String(body.firstName || '').trim()
  const lastName = String(body.lastName || '').trim()
  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'First and last name are required' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`
    }
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await upsertSyncedContact({
    email: session.user.email,
    firstName,
    lastName,
    source: 'website-signup',
    tagNames: ['site-user'],
    siteUserId: session.user.id,
    askPolicy: 'may-ask-to-validate'
  })

  return NextResponse.json({ ok: true })
}
