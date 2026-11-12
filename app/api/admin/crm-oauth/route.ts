import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { crmConfig } from '@/lib/crm/config'
import { openCrmSession } from '@/lib/crm/session'
import { syncSiteUsers } from '@/lib/crm/sync'

export const dynamic = 'force-dynamic'

const authorizationIdPattern = /^[A-Za-z0-9_-]{8,128}$/

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

async function adminCrmToken() {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user || session.user.user_metadata?.is_admin !== true) {
    return jsonError('Unauthorized', 401)
  }
  if (!session.user.email) {
    return jsonError('Admin account has no email', 400)
  }
  const opened = await openCrmSession({
    email: session.user.email,
    name:
      typeof session.user.user_metadata?.name === 'string'
        ? session.user.user_metadata.name
        : session.user.email
  })
  if ('error' in opened) return jsonError(opened.error, opened.status)

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const site = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    await syncSiteUsers(site).catch(error =>
      console.error('CRM user sync failed', error)
    )
  }

  return opened.session.accessToken
}

async function crmAuth(token: string, path: string, body?: unknown) {
  const config = crmConfig()
  if (!config) return jsonError('CRM database is not configured', 503)
  const response = await fetch(
    `${config.url.replace(/\/$/, '')}/auth/v1${path}`,
    {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store'
    }
  )
  const payload = (await response.json().catch(() => null)) as {
    msg?: string
    message?: string
    error_description?: string
    redirect_url?: string
    redirect_uri?: string
    scope?: string
    client?: { name?: string }
  } | null
  if (!response.ok) {
    const message =
      payload?.msg ||
      payload?.error_description ||
      payload?.message ||
      'The approval request could not be read'
    return jsonError(message, response.status)
  }
  return payload
}

export async function GET(request: Request) {
  const authorizationId =
    new URL(request.url).searchParams.get('authorization_id') || ''
  if (!authorizationIdPattern.test(authorizationId)) {
    return jsonError('This approval link has no approval id', 400)
  }
  const token = await adminCrmToken()
  if (token instanceof NextResponse) return token
  const payload = await crmAuth(
    token,
    `/oauth/authorizations/${authorizationId}`
  )
  if (payload instanceof NextResponse) return payload
  if (payload?.redirect_url && !payload.client) {
    return NextResponse.json({ redirect_url: payload.redirect_url })
  }
  return NextResponse.json({
    client_name: payload?.client?.name || 'Claude',
    redirect_uri: payload?.redirect_uri || '',
    scope: payload?.scope || ''
  })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    authorization_id?: string
    action?: string
  } | null
  const authorizationId = body?.authorization_id || ''
  if (!authorizationIdPattern.test(authorizationId)) {
    return jsonError('This approval link has no approval id', 400)
  }
  if (body?.action !== 'approve' && body?.action !== 'deny') {
    return jsonError('Choose approve or deny', 400)
  }
  const token = await adminCrmToken()
  if (token instanceof NextResponse) return token
  const payload = await crmAuth(
    token,
    `/oauth/authorizations/${authorizationId}/consent`,
    { action: body.action }
  )
  if (payload instanceof NextResponse) return payload
  if (!payload?.redirect_url) {
    return jsonError('The approval did not return a way back to Claude', 502)
  }
  return NextResponse.json({ redirect_url: payload.redirect_url })
}
