import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { crmConfig, splitName } from '@/lib/crm/config'
import {
  exchangeMagicLink,
  tokensFromVerifyResponse,
  type AuthTokens
} from '@/lib/crm/magic-link'
import { syncSiteUsers } from '@/lib/crm/sync'

const pendingSessions = new Map<string, Promise<AuthTokens | null>>()

export async function GET() {
  const config = crmConfig()
  if (!config) {
    return NextResponse.json(
      { error: 'CRM database is not configured' },
      { status: 503 }
    )
  }

  const session = await auth({ cookieStore: cookies() })
  if (!session?.user || session.user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!session.user.email) {
    return NextResponse.json(
      { error: 'Admin account has no email' },
      { status: 400 }
    )
  }

  const admin = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = session.user.email
  let crmUser: { id: string } | undefined
  for (let page = 1; page <= 5 && !crmUser; page += 1) {
    const { data: existing, error: lookupError } =
      await admin.auth.admin.listUsers({
        page,
        perPage: 200
      })
    if (lookupError) {
      console.error('CRM user lookup failed', lookupError.message)
      return NextResponse.json(
        { error: 'Could not open the CRM session' },
        { status: 502 }
      )
    }
    crmUser = existing.users.find(
      user => user.email?.toLowerCase() === email.toLowerCase()
    )
    if (existing.users.length < 200) break
  }
  if (!crmUser) {
    const display =
      typeof session.user.user_metadata?.name === 'string'
        ? session.user.user_metadata.name
        : email
    const { firstName, lastName } = splitName(display)
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName || 'Admin',
          crm_staff: true
        }
      })
    if (createError || !created.user) {
      console.error('CRM user create failed', createError?.message)
      return NextResponse.json(
        { error: 'Could not open the CRM session' },
        { status: 502 }
      )
    }
    crmUser = created.user
  }

  const { error: staffError } = await admin
    .from('sales')
    .update({ administrator: true, disabled: false })
    .eq('user_id', crmUser.id)
  if (staffError) {
    console.error('CRM staff update failed', staffError.message)
  }

  const sessionKey = email.toLowerCase()
  let tokensPromise = pendingSessions.get(sessionKey)
  if (!tokensPromise) {
    tokensPromise = exchangeMagicLink({
      email,
      generateLink: async () => {
        const { data: link, error: linkError } =
          await admin.auth.admin.generateLink({
            type: 'magiclink',
            email
          })
        if (linkError || !link.properties) {
          console.error('CRM link failed', linkError?.message)
          return null
        }
        return {
          hashed_token: link.properties.hashed_token,
          email_otp: link.properties.email_otp
        }
      },
      verify: async body => {
        const response = await fetch(`${config.url}/auth/v1/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`
          },
          body: JSON.stringify(body)
        })
        const payload = await response.json().catch(() => null)
        const tokens = tokensFromVerifyResponse(payload)
        if (!response.ok || !tokens) {
          const message =
            payload && typeof payload === 'object'
              ? String(
                  (
                    payload as {
                      msg?: string
                      error_description?: string
                      error?: string
                    }
                  ).msg ||
                    (payload as { error_description?: string })
                      .error_description ||
                    (payload as { error?: string }).error ||
                    response.statusText
                )
              : response.statusText
          console.error('CRM session verify failed', message)
          return null
        }
        return tokens
      }
    }).finally(() => pendingSessions.delete(sessionKey))
    pendingSessions.set(sessionKey, tokensPromise)
  }

  const tokens = await tokensPromise
  if (!tokens) {
    return NextResponse.json(
      { error: 'Could not open the CRM session' },
      { status: 502 }
    )
  }

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

  return NextResponse.json(tokens)
}
