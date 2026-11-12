import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { checkBotId } from 'botid/server'

import { allowInviteAttempt, findInviteByToken, inviteBlockReason, maskEmail } from '@/lib/chat-invites'

export const runtime = 'nodejs'

function logRefusal(reason: string, request: NextRequest) {
  console.warn('Invite refused', {
    reason,
    country: request.headers.get('x-vercel-ip-country'),
    userAgent: request.headers.get('user-agent')
  })
}

export async function POST(request: NextRequest) {
  const human = await checkBotId()
  if (human.isBot) {
    logRefusal('bot', request)
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32)
  if (!(await allowInviteAttempt(`redeem:${ipHash}`, 10))) {
    logRefusal('rate', request)
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token : ''
  const row = token ? await findInviteByToken(token) : null
  if (!row) {
    logRefusal('invalid', request)
    return NextResponse.json({ error: 'This invitation is not valid.' }, { status: 400 })
  }
  const blocked = inviteBlockReason(row)
  if (blocked) return NextResponse.json({ error: blocked }, { status: 400 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Sign-in email is not configured.' }, { status: 503 })
  }
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error: createError } = await admin.auth.admin.createUser({ email: row.email, email_confirm: true })
  if (createError && !/already|registered/i.test(createError.message)) {
    console.error('Could not prepare the invited account')
    return NextResponse.json({ error: 'Could not send the sign-in link.' }, { status: 503 })
  }
  const origin = new URL(request.url).origin
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: row.email,
    options: { redirectTo: `${origin}/api/auth/callback?invite=${encodeURIComponent(token)}` }
  })
  const actionLink = link?.properties?.action_link
  if (linkError || !actionLink) {
    console.error('Could not create the sign-in link')
    return NextResponse.json({ error: 'Could not send the sign-in link.' }, { status: 503 })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: sendError } = await resend.emails.send({
    from: 'Use Better Metrics <notifications@lexnova.com.au>',
    to: row.email,
    subject: 'Your sign-in link for Ask the AI',
    text: `Open this link to start using Ask the AI. It signs in ${row.email} only.\n\n${actionLink}`
  })
  if (sendError) return NextResponse.json({ error: 'Could not send the sign-in link.' }, { status: 503 })
  return NextResponse.json({
    message: `We've sent a sign-in link to ${maskEmail(row.email)}. Open it to start using Ask the AI.`
  })
}
