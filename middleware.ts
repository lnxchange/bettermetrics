import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { LegacyArticlePath } from '@/lib/publishing/legacy-path'
import { LegacyRedirect } from '@/lib/publishing/public'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    const normalisedArticle = LegacyArticlePath.normalise(req.nextUrl.pathname)
    if (normalisedArticle) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = normalisedArticle
      return NextResponse.redirect(redirectUrl, 301)
    }

    // After go-live, with the retirement switch on, the March 2026 articles
    // move with a 301. Before that this returns immediately and does not
    // touch the database.
    const articleSlug = req.nextUrl.pathname.match(/^\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)
    if (articleSlug) {
      const target = await LegacyRedirect.target(articleSlug[1])
      if (target) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = target
        redirectUrl.search = ''
        return NextResponse.redirect(redirectUrl, 301)
      }
    }

    // Routes where we need to touch the Supabase session (to refresh cookies
    // and/or enforce sign-in). /chat stays reachable so the page can explain
    // that an account is required. /api is outside this matcher's scope;
    // /api/chat refuses anonymous callers itself.
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

    const supabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Public pages stay open. Terms apply by using the site; nobody is stopped to accept them.
    if (!requiresAuth) return res

    // Check if Supabase is configured
    if (!supabaseConfigured) {
      // For auth-required routes without Supabase, show service unavailable
      if (req.url.includes('/admin')) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/service-unavailable'
        return NextResponse.redirect(redirectUrl)
      }
      // For API routes, return 503
      if (req.url.includes('/api/')) {
        return NextResponse.json(
          {
            error: 'Service unavailable - authentication not configured'
          },
          { status: 503 }
        )
      }
      // For sign-in/sign-up routes, allow through to show "not available" message
      return res
    }

    // Only try to create Supabase client if environment variables are configured
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session }
    } = await supabase.auth.getSession()

    // Handle download attempts - redirect to sign-in
    if (req.url.includes('/api/documents/download') && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/sign-in'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      redirectUrl.searchParams.set('reason', 'download-requires-auth')
      return NextResponse.redirect(redirectUrl)
    }

    // /chat stays open so visitors see the sign-in wall. The API refuses them.

    // Handle admin routes - require admin status.
    // Keep the query string. The Claude approval id arrives as
    // /admin/oauth/consent?authorization_id=... and a path-only return
    // drops it, which leaves the approval page with nothing to approve.
    if (req.url.includes('/admin')) {
      if (!session) {
        const returnTo = req.nextUrl.pathname + req.nextUrl.search
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/sign-in'
        redirectUrl.search = ''
        redirectUrl.searchParams.set('redirectedFrom', returnTo)
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
     * - favicon.ico, apple-icon and the sized PNG icons
     * - manifest.webmanifest
     */
    '/((?!share|api|_next/static|_next/image|favicon.ico|apple-icon.png|icon-16.png|icon-32.png|icon-192.png|icon-512.png|manifest.webmanifest).*)'
  ]
}
