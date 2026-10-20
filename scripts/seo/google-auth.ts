/**
 * Minimal Google service-account OAuth (JWT bearer grant) using Node's
 * crypto, so the monitor does not need the `googleapis` package.
 *
 * Accepts the service account JSON either as a raw JSON string or base64
 * (GitHub secrets are easier to paste as base64).
 */
import crypto from 'node:crypto'

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri?: string
}

export function parseServiceAccount(raw: string | undefined): ServiceAccount | null {
  if (!raw) return null
  const trimmed = raw.trim()
  try {
    if (trimmed.startsWith('{')) return JSON.parse(trimmed)
    return JSON.parse(Buffer.from(trimmed, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const tokenCache = new Map<string, { token: string; expiresAt: number }>()

export async function getAccessToken(account: ServiceAccount, scopes: string[]): Promise<string> {
  const cacheKey = `${account.client_email}|${scopes.join(' ')}`
  const cached = tokenCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: scopes.join(' '),
      aud: account.token_uri || 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    })
  )
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${header}.${claims}`), account.private_key)
  const assertion = `${header}.${claims}.${base64url(signature)}`

  const response = await fetch(account.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  })
  if (!response.ok) {
    throw new Error(`Google token exchange failed: ${response.status} ${await response.text()}`)
  }
  const json = (await response.json()) as { access_token: string; expires_in: number }
  tokenCache.set(cacheKey, { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 })
  return json.access_token
}

export async function googleFetch(account: ServiceAccount, scopes: string[], url: string, init: RequestInit = {}) {
  const token = await getAccessToken(account, scopes)
  return fetch(url, {
    ...init,
    headers: { ...(init.headers || {}), authorization: `Bearer ${token}`, 'content-type': 'application/json' }
  })
}

export const SCOPES = {
  searchConsole: ['https://www.googleapis.com/auth/webmasters'],
  searchConsoleReadonly: ['https://www.googleapis.com/auth/webmasters.readonly'],
  indexing: ['https://www.googleapis.com/auth/indexing'],
  analyticsReadonly: ['https://www.googleapis.com/auth/analytics.readonly']
}
