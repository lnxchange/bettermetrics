import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { crmConfig, splitName } from '@/lib/crm/config'

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
    return NextResponse.json({ error: 'Admin account has no email' }, { status: 400 })
  }

  const admin = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = session.user.email
  let crmUser: { id: string } | undefined
  for (let page = 1; page <= 5 && !crmUser; page += 1) {
    const { data: existing, error: lookupError } = await admin.auth.admin.listUsers({
      page,
      perPage: 200
    })
    if (lookupError) {
      console.error('CRM user lookup failed', lookupError.message)
      return NextResponse.json({ error: 'Could not open the CRM session' }, { status: 502 })
    }
    crmUser = existing.users.find(user => user.email?.toLowerCase() === email.toLowerCase())
    if (existing.users.length < 200) break
  }
  if (!crmUser) {
    const display =
      typeof session.user.user_metadata?.name === 'string'
        ? session.user.user_metadata.name
        : email
    const { firstName, lastName } = splitName(display)
    const { data: created, error: createError } = await admin.auth.admin.createUser({
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
      return NextResponse.json({ error: 'Could not open the CRM session' }, { status: 502 })
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

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email
  })
  const linkProperties = (
    link as { properties?: { email_otp?: string } } | null
  )?.properties
  if (linkError || !linkProperties?.email_otp) {
    console.error('CRM link failed', linkError?.message)
    return NextResponse.json({ error: 'Could not open the CRM session' }, { status: 502 })
  }

  const anon = createClient(config.url, config.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const { data: verified, error: verifyError } = await anon.auth.verifyOtp({
    type: 'magiclink',
    email,
    token: linkProperties.email_otp
  })
  if (verifyError || !verified.session) {
    console.error('CRM session verify failed', verifyError?.message)
    return NextResponse.json({ error: 'Could not open the CRM session' }, { status: 502 })
  }

  return NextResponse.json({
    access_token: verified.session.access_token,
    refresh_token: verified.session.refresh_token
  })
}
