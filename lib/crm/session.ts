import { createClient } from '@supabase/supabase-js'
import { crmConfig, splitName } from '@/lib/crm/config'

export type CrmAccess = {
  accessToken: string
  refreshToken: string
}

type SiteUser = {
  email: string
  name?: string | null
}

export async function openCrmSession(
  user: SiteUser
): Promise<{ session: CrmAccess } | { error: string; status: number }> {
  const config = crmConfig()
  if (!config) {
    return { error: 'CRM database is not configured', status: 503 }
  }

  const admin = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = user.email
  let crmUser: { id: string } | undefined
  for (let page = 1; page <= 5 && !crmUser; page += 1) {
    const { data: existing, error: lookupError } =
      await admin.auth.admin.listUsers({
        page,
        perPage: 200
      })
    if (lookupError) {
      console.error('CRM user lookup failed', lookupError.message)
      return { error: 'Could not open the CRM session', status: 502 }
    }
    crmUser = existing.users.find(
      listed => listed.email?.toLowerCase() === email.toLowerCase()
    )
    if (existing.users.length < 200) break
  }

  if (!crmUser) {
    const { firstName, lastName } = splitName(user.name || email)
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
      return { error: 'Could not open the CRM session', status: 502 }
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
    return { error: 'Could not open the CRM session', status: 502 }
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
    return { error: 'Could not open the CRM session', status: 502 }
  }

  return {
    session: {
      accessToken: verified.session.access_token,
      refreshToken: verified.session.refresh_token
    }
  }
}
