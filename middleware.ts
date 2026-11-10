import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import {
  applySetCookieHeaders,
  clearAuthCookieHeaders,
  isAdminPath,
  SESSION_HANDLED_HEADER,
  setCookieList
} from '@/lib/auth/session-cookie'

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

function redirectKeepingCookies(from: NextResponse, url: URL, status?: number) {
  const redirect = NextResponse.redirect(url, status)
  for (const cookie of setCookieList(from.headers)) {
    redirect.headers.append('set-cookie', cookie)
  }
  return redirect
}

// Refresh once, then show the new cookie to Server Components via the
// forwarded request. Their auth helper cannot write cookies, so a second
// refresh on the same token revokes the session.
function forwardSession(req: NextRequest, res: NextResponse) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.delete(SESSION_HANDLED_HEADER)
  requestHeaders.set(SESSION_HANDLED_HEADER, '1')

  const setCookies = setCookieList(res.headers)
  if (setCookies.length > 0) {
    requestHeaders.set(
      'cookie',
      applySetCookieHeaders(req.headers.get('cookie') ?? '', setCookies)
    )
  }

  const forwarded = NextResponse.next({ request: { headers: requestHeaders } })
  for (const cookie of setCookies)
    forwarded.headers.append('set-cookie', cookie)
  return forwarded
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const normalisedArticle = normaliseArticlePath(req.nextUrl.pathname)
  if (normalisedArticle) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = normalisedArticle
    return NextResponse.redirect(redirectUrl, 301)
  }

  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return res
  }

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let session: { user?: { user_metadata?: { is_admin?: boolean } } } | null =
    null
  if (configured) {
    try {
      const supabase = createMiddlewareClient({ req, res })
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        for (const cookie of clearAuthCookieHeaders())
          res.headers.append('set-cookie', cookie)
      } else {
        session = data.session
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      for (const cookie of clearAuthCookieHeaders())
        res.headers.append('set-cookie', cookie)
    }
  }

  const pathname = req.nextUrl.pathname
  // Match the path only. req.url also contains the query, so a sign-in URL
  // such as /sign-in?redirectedFrom=/admin used to be treated as /admin and
  // bounced the browser back onto /sign-in after a successful password login.
  const requiresAdmin =
    isAdminPath(pathname) || pathname.startsWith('/api/admin')
  const requiresDownload = pathname.startsWith('/api/documents/download')

  if (!configured && requiresAdmin) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Service unavailable - authentication not configured' },
        { status: 503 }
      )
    }
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/service-unavailable'
    return NextResponse.redirect(redirectUrl)
  }

  if (requiresDownload && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/sign-in'
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    redirectUrl.searchParams.set('reason', 'download-requires-auth')
    return redirectKeepingCookies(res, redirectUrl)
  }

  if (requiresAdmin) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/sign-in'
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return redirectKeepingCookies(res, redirectUrl)
    }

    const isAdmin = session.user?.user_metadata?.is_admin === true
    if (!isAdmin) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('error', 'admin-access-required')
      return redirectKeepingCookies(res, redirectUrl)
    }
  }

  if (!configured) return res
  return forwardSession(req, res)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes refresh their own session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
