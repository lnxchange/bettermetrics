import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { LegalConsent } from '@/lib/legal-consent'
import { LegalVersion } from '@/lib/legal-version'

export const runtime = 'nodejs'

function displayName(metadata: Record<string, unknown>, email: string) {
  if (typeof metadata.display_name === 'string' && metadata.display_name.trim()) return metadata.display_name.trim()
  if (typeof metadata.name === 'string' && metadata.name.trim()) return metadata.name.trim()
  const first = typeof metadata.first_name === 'string' ? metadata.first_name.trim() : ''
  const last = typeof metadata.last_name === 'string' ? metadata.last_name.trim() : ''
  return `${first} ${last}`.trim() || email
}

export async function GET() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const row = await LegalConsent.read(session.user.id)
  const metadata = (session.user.user_metadata || {}) as Record<string, unknown>
  return NextResponse.json({
    accepted: LegalVersion.matches(row),
    updatesOptIn: row?.updates_opt_in === true,
    displayName: displayName(metadata, session.user.email)
  })
}

export async function POST(req: NextRequest) {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const metadata = (session.user.user_metadata || {}) as Record<string, unknown>
  const name = displayName(metadata, session.user.email)
  if (body?.accepted === true) {
    const saved = await LegalConsent.record({
      userId: session.user.id,
      email: session.user.email,
      displayName: name,
      updatesOptIn: body.updatesOptIn === true
    })
    if (!saved) return NextResponse.json({ error: 'Could not save your acceptance.' }, { status: 503 })
    return NextResponse.json({ ok: true })
  }
  if (typeof body?.updatesOptIn === 'boolean') {
    const saved = await LegalConsent.setUpdates({
      userId: session.user.id,
      email: session.user.email,
      displayName: name,
      updatesOptIn: body.updatesOptIn
    })
    if (!saved) return NextResponse.json({ error: 'Could not update that choice.' }, { status: 503 })
    return NextResponse.json({ ok: true, updatesOptIn: body.updatesOptIn })
  }
  return NextResponse.json({ error: 'Tick the box to agree to the Terms of Use and Privacy Policy.' }, { status: 400 })
}
