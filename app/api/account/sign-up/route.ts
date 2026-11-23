import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { LegalConsent } from '@/lib/legal-consent'
import { LegalVersion } from '@/lib/legal-version'
import { SignUp } from '@/lib/sign-up'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const parsed = SignUp.parse(await req.json().catch(() => null))
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { displayName, email, password, updatesOptIn } = parsed.value
  const acceptedAt = new Date().toISOString()
  const supabase = createRouteHandlerClient({ cookies: () => cookies() })
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${req.nextUrl.origin}/api/auth/callback`,
      data: {
        display_name: displayName,
        name: displayName,
        legal_accepted_at: acceptedAt,
        legal_terms_version: LegalVersion.publicationDate,
        legal_privacy_version: LegalVersion.publicationDate,
        legal_updates_opt_in: updatesOptIn,
        legal_updates_opt_in_at: acceptedAt
      }
    }
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (data.user && data.session) {
    await LegalConsent.record({
      userId: data.user.id,
      email,
      displayName,
      updatesOptIn,
      acceptedAt
    })
  }
  return NextResponse.json({ ok: true, needsConfirmation: !data.session })
}
