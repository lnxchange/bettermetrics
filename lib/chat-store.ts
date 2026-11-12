import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Chat settings, usage, and saved reader keys.
 * These tables are on the CRM database. The token available here can create
 * tables on that project, and the site project refuses it.
 */
export function chatStore(): SupabaseClient | null {
  const crmUrl = process.env.CRM_SUPABASE_URL
  const crmKey = process.env.CRM_SUPABASE_SERVICE_ROLE_KEY
  const url = crmUrl && crmKey ? crmUrl : process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = crmUrl && crmKey ? crmKey : process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
