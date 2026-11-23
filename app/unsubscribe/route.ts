import { NextRequest, NextResponse } from 'next/server'

import { LegalConsent } from '@/lib/legal-consent'
import { MailingList } from '@/lib/crm/mailing'
import { UnsubscribeToken } from '@/lib/unsubscribe-token'

export const runtime = 'nodejs'

async function unsubscribe(token: string | null) {
  if (!token) return false
  let opened: { userId: string; email: string } | null = null
  try {
    opened = UnsubscribeToken.open(token)
  } catch {
    return false
  }
  if (!opened) return false
  await LegalConsent.setUpdates({
    userId: opened.userId,
    email: opened.email,
    displayName: opened.email,
    updatesOptIn: false
  })
  await MailingList.optOut(opened.email, opened.userId)
  return true
}

function page(done: boolean) {
  const message = done
    ? 'You will not be emailed updates about the AIM Framework.'
    : 'This unsubscribe link is not valid.'
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Unsubscribe</title></head><body style="font-family:sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem"><p>${message}</p><p><a href="/">Back to aimtheory.org</a></p></body></html>`
  return new NextResponse(html, {
    status: done ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}

export async function GET(req: NextRequest) {
  const done = await unsubscribe(req.nextUrl.searchParams.get('token'))
  return page(done)
}

export async function POST(req: NextRequest) {
  const done = await unsubscribe(req.nextUrl.searchParams.get('token'))
  if (!done) return NextResponse.json({ error: 'Invalid unsubscribe link.' }, { status: 400 })
  return NextResponse.json({ ok: true })
}
