// The auth cookie written by @supabase/auth-helpers-nextjs 0.7 / gotrue-js 2.39.
export const AUTH_STORAGE_KEY = 'supabase.auth.token'

// Set on the forwarded request after middleware has refreshed or cleared the
// session. Server components must not refresh again: the helpers cannot
// persist cookies there, and a second refresh revokes the token family.
export const SESSION_HANDLED_HEADER = 'x-bm-session'

const AUTH_COOKIE_NAMES = [
  AUTH_STORAGE_KEY,
  `${AUTH_STORAGE_KEY}-code-verifier`
]

export type SiteSession = {
  access_token: string
  refresh_token: string
  expires_at: number
  token_type: 'bearer'
  user: {
    id: string
    email?: string
    user_metadata: Record<string, any>
    app_metadata: Record<string, any>
    factors?: unknown
  }
}

export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value) return '/'
  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  )
    return '/'
  if (value.includes('\\') || value.includes('\n') || value.includes('\r'))
    return '/'
  const path = value.split('?')[0]
  if (path === '/sign-in' || path === '/sign-up') return '/'
  return value
}

export function setCookieList(headers: {
  getSetCookie?: () => string[]
  get(name: string): string | null
}): string[] {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie()
  const single = headers.get('set-cookie')
  return single ? [single] : []
}

export function clearAuthCookieHeaders(): string[] {
  return AUTH_COOKIE_NAMES.map(name => `${name}=; Max-Age=0; Path=/`)
}

function parseCookieHeader(header: string): Map<string, string> {
  const jar = new Map<string, string>()
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq <= 0) continue
    jar.set(part.slice(0, eq).trim(), part.slice(eq + 1).trim())
  }
  return jar
}

function decodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

// Replace request cookies with the ones middleware just wrote, so the page
// reads the rotated session instead of refreshing the spent token again.
export function applySetCookieHeaders(
  cookieHeader: string,
  setCookies: string[]
): string {
  const jar = parseCookieHeader(cookieHeader)
  for (const header of setCookies) {
    const first = header.split(';')[0] ?? ''
    const eq = first.indexOf('=')
    if (eq <= 0) continue
    const name = first.slice(0, eq).trim()
    const rawValue = first.slice(eq + 1).trim()
    const cleared =
      rawValue === '' || /(?:^|;)\s*max-age=0(?:\s|;|$)/i.test(header)
    if (cleared) jar.delete(name)
    else jar.set(name, decodeCookieValue(rawValue))
  }
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

function decodeBase64Url(value: string): string {
  const padded =
    value.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1]
  if (!part) return null
  try {
    const parsed = JSON.parse(decodeBase64Url(part))
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

// Read the helpers' cookie without calling getSession(), which refreshes an
// expired access token and cannot store the replacement from a Server Component.
export function readSession(
  cookieValue: string | undefined | null,
  nowMs = Date.now()
): SiteSession | null {
  if (!cookieValue) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(cookieValue)
  } catch {
    return null
  }

  let accessToken: string | undefined
  let refreshToken = ''
  let factors: unknown
  if (Array.isArray(parsed)) {
    accessToken = typeof parsed[0] === 'string' ? parsed[0] : undefined
    refreshToken = typeof parsed[1] === 'string' ? parsed[1] : ''
    factors = parsed[4]
  } else if (parsed && typeof parsed === 'object' && 'access_token' in parsed) {
    const record = parsed as { access_token?: unknown; refresh_token?: unknown }
    accessToken =
      typeof record.access_token === 'string' ? record.access_token : undefined
    refreshToken =
      typeof record.refresh_token === 'string' ? record.refresh_token : ''
  }
  if (!accessToken) return null

  const payload = decodeJwtPayload(accessToken)
  if (!payload || typeof payload.sub !== 'string') return null
  const expiresAt = typeof payload.exp === 'number' ? payload.exp : undefined
  if (!expiresAt || expiresAt * 1000 <= nowMs) return null

  const userMetadata =
    payload.user_metadata && typeof payload.user_metadata === 'object'
      ? (payload.user_metadata as Record<string, any>)
      : {}
  const appMetadata =
    payload.app_metadata && typeof payload.app_metadata === 'object'
      ? (payload.app_metadata as Record<string, any>)
      : {}

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    token_type: 'bearer',
    user: {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
      factors
    }
  }
}
