import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

import { auth } from '@/auth'
import { AccountDeletion } from '@/lib/account-deletion'

export const runtime = 'nodejs'

export async function POST() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const deleted = await AccountDeletion.delete(session.user.id, session.user.email)
  if (!deleted) return NextResponse.json({ error: 'Could not delete your account.' }, { status: 503 })
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
