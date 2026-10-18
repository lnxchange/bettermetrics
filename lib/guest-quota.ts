/**
 * Guest chat quota.
 *
 * Anonymous visitors may ask a small number of questions before being asked
 * to sign in. The count lives in a signed, httpOnly cookie so it survives
 * reloads without a database row. Enforcement happens server-side in
 * /api/chat; the client only displays what the server reports.
 *
 * Uses only Web APIs (TextEncoder, atob/btoa, crypto.subtle) so it runs in
 * both the Node and Edge runtimes.
 */

export const GUEST_COOKIE = 'aim_guest'
export const GUEST_LIMIT = 5
export const GUEST_REMAINING_HEADER = 'x-guest-remaining'

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

export interface GuestState {
  count: number
  /** Unix ms when the cookie was first issued */
  since: number
}

function getSecret(): string {
  return (
    process.env.GUEST_CHAT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'aim-guest-dev-secret'
  )
}

function toB64Url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const bin = atob(padded)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function encodeText(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

function decodeText(b: Uint8Array): string {
  return new TextDecoder().decode(b)
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encodeText(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encodeText(payload))
  return toB64Url(new Uint8Array(sig))
}

export async function signGuestState(state: GuestState): Promise<string> {
  const payload = toB64Url(encodeText(JSON.stringify(state)))
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

export async function verifyGuestCookie(
  value: string | undefined | null
): Promise<GuestState> {
  const fresh: GuestState = { count: 0, since: Date.now() }
  if (!value) return fresh
  const [payload, sig] = value.split('.')
  if (!payload || !sig) return fresh
  const expected = await hmac(payload)
  if (expected !== sig) return fresh
  try {
    const parsed = JSON.parse(decodeText(fromB64Url(payload))) as GuestState
    if (typeof parsed.count !== 'number' || typeof parsed.since !== 'number') {
      return fresh
    }
    return parsed
  } catch {
    return fresh
  }
}

/**
 * Display-only parse that does not verify the signature. Never use its
 * result for enforcement.
 */
export function peekGuestCount(value: string | undefined | null): number {
  if (!value) return 0
  const [payload] = value.split('.')
  if (!payload) return 0
  try {
    const parsed = JSON.parse(decodeText(fromB64Url(payload))) as Partial<GuestState>
    return typeof parsed.count === 'number' ? parsed.count : 0
  } catch {
    return 0
  }
}

export function guestCookieHeader(signed: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${GUEST_COOKIE}=${signed}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`
}
