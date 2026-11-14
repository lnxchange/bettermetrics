import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { checkBotId } from 'botid/server'

import { allowInviteAttempt, requestInvitation } from '@/lib/chat-invites'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const human = await checkBotId()
  if (human.isBot) {
    console.warn('Invite request refused', {
      reason: 'bot',
      country: request.headers.get('x-vercel-ip-country'),
      userAgent: request.headers.get('user-agent')
    })
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32)
  if (!(await allowInviteAttempt(`request:${ipHash}`, 5))) {
    console.warn('Invite request refused', {
      reason: 'rate',
      country: request.headers.get('x-vercel-ip-country'),
      userAgent: request.headers.get('user-agent')
    })
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const institution = typeof body?.institution === 'string' ? body.institution.trim() : ''
  const interest = typeof body?.interest === 'string' ? body.interest.trim() : ''
  if (!name || !email.includes('@') || !institution || !interest) {
    return NextResponse.json({ error: 'Name, email, institution, and a line about your interest are required.' }, { status: 400 })
  }
  const saved = await requestInvitation({ name, email, institution, interest })
  if (!saved) return NextResponse.json({ error: 'Could not record the request.' }, { status: 503 })
  return NextResponse.json({ message: 'Request received. An invitation is sent only after it is approved.' })
}
