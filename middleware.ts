import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    // Routes that require Supabase authentication
    const requiresAuth = 
      req.url.includes('/admin') || 
      req.url.includes('/chat') || 
      req.url.includes('/api/chat') ||
      req.url.includes('/api/admin') ||
      req.url.includes('/api/documents/download') || // Research docs need auth
      req.url.includes('/sign-in') ||
      req.url.includes('/sign-up') ||
      req.url.includes('/api/auth')

    // Skip static files
    if (req.url.includes('/_next') || req.url.includes('/favicon')) {
      return res
    }

    // If route doesn't require auth, allow through
    if (!requiresAuth) {
      return res
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // For auth-required routes without Supabase, show service unavailable
      if (req.url.includes('/admin') || req.url.includes('/chat')) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/service-unavailable'
        return NextResponse.redirect(redirectUrl)
      }
      // For API routes, return 503
      if (req.url.includes('/api/')) {
        return NextResponse.json({ 
          error: 'Service unavailable - authentication not configured' 
        }, { status: 503 })
      }
    }

    // Get Supabase session for auth-required routes
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Handle download attempts - redirect to sign-in
    if (req.url.includes('/api/documents/download') && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/sign-in'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      redirectUrl.searchParams.set('reason', 'download-requires-auth')
      return NextResponse.redirect(redirectUrl)
    }

    // Handle chat routes - redirect to sign-in
    if (req.url.includes('/chat') && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/sign-in'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Handle admin routes - require admin status
    if (req.url.includes('/admin')) {
      if (!session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/sign-in'
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

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
