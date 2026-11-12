import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Chat settings, usage, and saved reader keys.
 * These tables are on the site database. The CRM database is only for contacts.
 */
export function chatStore(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
