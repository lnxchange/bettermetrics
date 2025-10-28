import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const auth = async ({
  cookieStore
}: {
  cookieStore: ReturnType<typeof cookies>
}) => {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Auth: Supabase not configured')
    return null
  }

  try {
    // Use createRouteHandlerClient for API routes
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    
    console.log('Auth: Attempting to get session')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth: Session error:', error)
      throw error
    }
    
    console.log('Auth: Session result:', {
      hasSession: !!data.session,
      userId: data.session?.user?.id,
      sessionExpiry: data.session?.expires_at,
      sessionValid: data.session?.expires_at ? Date.now() < data.session.expires_at * 1000 : false
    })
    
    return data.session
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}
