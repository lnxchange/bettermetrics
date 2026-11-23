import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { LegalConsent } from '@/lib/legal-consent'
import { MailingList } from '@/lib/crm/mailing'

function displayNameOf(metadata: Record<string, unknown>, email: string) {
  if (typeof metadata.display_name === 'string' && metadata.display_name.trim()) return metadata.display_name.trim()
  if (typeof metadata.name === 'string' && metadata.name.trim()) return metadata.name.trim()
  const first = typeof metadata.first_name === 'string' ? metadata.first_name.trim() : ''
  const last = typeof metadata.last_name === 'string' ? metadata.last_name.trim() : ''
  return `${first} ${last}`.trim() || email
}

export async function GET() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const metadata = (session.user.user_metadata || {}) as Record<string, unknown>
  const consent = await LegalConsent.read(session.user.id)
  return NextResponse.json({
    email: session.user.email,
    displayName: displayNameOf(metadata, session.user.email),
    updatesOptIn: consent?.updates_opt_in === true
  })
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const displayName = String(body.displayName || '').trim()
  const email = String(body.email || session.user.email).trim()
  const password = typeof body.password === 'string' ? body.password : ''

  if (!displayName || displayName.length > 80) {
    return NextResponse.json({ error: 'Enter a display name.' }, { status: 400 })
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
        display_name: displayName,
        name: displayName
      },
      ...(emailChanged ? { email } : {}),
      ...(password ? { password } : {})
    },
    emailChanged ? { emailRedirectTo: `${req.nextUrl.origin}/account` } : {}
  )
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const consent = await LegalConsent.read(session.user.id)
  if (consent?.updates_opt_in) {
    await MailingList.optIn({
      email: session.user.email,
      displayName,
      userId: session.user.id
    })
  }

  const pendingEmail = data.user?.new_email || (emailChanged ? email : '')
  return NextResponse.json({
    ok: true,
    emailChangePending: Boolean(pendingEmail),
    message: pendingEmail
      ? `Check ${pendingEmail} to confirm the new address. Your name is saved.`
      : 'Profile saved.'
  })
}
