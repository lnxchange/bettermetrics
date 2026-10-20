import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

// Old article URLs still indexed from usebettermetrics.com carried file
// extensions and mixed case ("/articles/Report-14-The-Easterlin-Paradox.md").
// Normalise them to the slug form with a permanent redirect so they resolve
// (or 404 cleanly) instead of erroring.
const LEGACY_ARTICLE_EXT = /\.(md|markdown|pdf|docx?|txt|html?)$/i

function normaliseArticlePath(pathname: string): string | null {
  const match = pathname.match(/^\/articles\/(.+)$/)
  if (!match) return null
  const raw = decodeURIComponent(match[1])
  const slug = raw
    .replace(LEGACY_ARTICLE_EXT, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug || slug === raw) return null
  return `/articles/${slug}`
}

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    const normalisedArticle = normaliseArticlePath(req.nextUrl.pathname)
    if (normalisedArticle) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = normalisedArticle
      return NextResponse.redirect(redirectUrl, 301)
    }

    // Routes where we need to touch the Supabase session (to refresh cookies
    // and/or enforce sign-in). /chat is included so signed-in users keep a
    // fresh session, but guests are allowed through (quota enforced in
    // /api/chat).
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
      if (req.url.includes('/admin')) {
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
      // For sign-in/sign-up routes, allow through to show "not available" message
      return res
    }

    // Only try to create Supabase client if environment variables are configured
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

    // /chat is open to guests; the API enforces the guest quota.

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
