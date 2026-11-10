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
    lastName: metadata.last_name || '',
    organization: metadata.organization || ''
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
  const organization = String(body.organization || '').trim()
  const email = String(body.email || session.user.email).trim()
  const password = typeof body.password === 'string' ? body.password : ''

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'First and last name are required' }, { status: 400 })
  }
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }
  if (password && password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const emailChanged = email.toLowerCase() !== session.user.email.toLowerCase()
  const { data, error } = await supabase.auth.updateUser(
    {
      data: {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        organization
      },
      ...(emailChanged ? { email } : {}),
      ...(password ? { password } : {})
    },
    emailChanged ? { emailRedirectTo: `${req.nextUrl.origin}/account` } : {}
  )
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await upsertSyncedContact({
    email: session.user.email,
    firstName,
    lastName,
    companyName: organization || null,
    source: 'website-signup',
    externalId: `site-user:${session.user.id}`,
    tagNames: ['site-user'],
    siteUserId: session.user.id,
    askPolicy: 'may-ask-to-validate'
  })

  const pendingEmail = data.user?.new_email || (emailChanged ? email : '')
  return NextResponse.json({
    ok: true,
    emailChangePending: Boolean(pendingEmail),
    message: pendingEmail
      ? `Check ${pendingEmail} to confirm the new address. Your name is saved.`
      : 'Profile saved.'
  })
}
