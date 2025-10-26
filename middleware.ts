import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    // Production deployment with full authentication
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
      data: { session }
    } = await supabase.auth.getSession()

    // Check for admin routes
    const isAdminRoute = req.url.includes('/admin')
    const isChatRoute = req.url.includes('/chat') || req.url.includes('/api/chat')
    const isAuthRoute = req.url.includes('/sign-in') || req.url.includes('/sign-up')
    
    // Require authentication for chat routes
    if (isChatRoute && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/sign-in'
      redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Require admin access for admin routes
    if (isAdminRoute) {
      if (!session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/sign-in'
        redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is admin
      const isAdmin = session.user?.user_metadata?.is_admin === true
      if (!isAdmin) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/'
        redirectUrl.searchParams.set('error', 'admin-access-required')
        return NextResponse.redirect(redirectUrl)
      }
    }

    return res
  } catch (error) {
    // If middleware fails, allow the request to continue
    // This prevents 500 errors from breaking the site
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - share (publicly shared chats)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!share|api|_next/static|_next/image|favicon.ico).*)'
  ]
}
