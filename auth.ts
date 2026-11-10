import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import {
  AUTH_STORAGE_KEY,
  readSession,
  SESSION_HANDLED_HEADER
} from '@/lib/auth/session-cookie'

export const auth = async ({
  cookieStore
}: {
  cookieStore: ReturnType<typeof cookies>
}) => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null
  }

  // A still-valid access token is enough. getSession() would refresh an
  // expired one, and doing that from a Server Component cannot store the
  // replacement. The next request then presents the spent refresh token
  // and Supabase revokes the whole sign-in.
  const handled = headers().get(SESSION_HANDLED_HEADER) === '1'
  const current = readSession(cookieStore.get(AUTH_STORAGE_KEY)?.value)
  if (handled || current) return current

  try {
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session?.user) return null
    if (data.session.expires_at && data.session.expires_at * 1000 <= Date.now())
      return null
    return data.session
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}
