import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { isSiteAdmin } from '@/lib/site-keys'
import { createInvite, inviteStatus, latestInvite, revokeInvite } from '@/lib/chat-invites'

export const runtime = 'nodejs'

async function admin() {
  const session = await auth({ cookieStore: cookies() })
  if (!isSiteAdmin(session?.user)) return null
  return session
}

export async function GET(request: NextRequest) {
  if (!(await admin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const crmContactId = request.nextUrl.searchParams.get('crmContactId') || ''
  if (!crmContactId) return NextResponse.json({ error: 'Choose a contact.' }, { status: 400 })
  const row = await latestInvite(crmContactId)
  return NextResponse.json({
    status: inviteStatus(row),
    email: row?.email ?? null,
    expiresAt: row?.expires_at ?? null
  })
}

export async function POST(request: NextRequest) {
  if (!(await admin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const crmContactId = typeof body?.crmContactId === 'string' ? body.crmContactId : ''
  if (!crmContactId) return NextResponse.json({ error: 'Choose a contact.' }, { status: 400 })
  const action = body?.action === 'revoke' || body?.action === 'resend' ? body.action : 'create'
  const origin = new URL(request.url).origin
  if (action === 'revoke') {
    const result = await revokeInvite(crmContactId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ status: 'revoked' })
  }
  const created = await createInvite(crmContactId, origin)
  if ('error' in created) return NextResponse.json({ error: created.error }, { status: 400 })
  return NextResponse.json({ status: inviteStatus(await latestInvite(crmContactId)), url: created.url, email: created.email })
}
