/**
 * Copy site accounts and stored contact-form messages into the CRM.
 *
 *   npx tsx scripts/sync-crm.ts
 *
 * Requires the site Supabase env and CRM_SUPABASE_URL, CRM_SUPABASE_ANON_KEY,
 * CRM_SUPABASE_SERVICE_ROLE_KEY.
 */
import { config } from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { syncSiteUsers, syncStoredContactMessages } from '../lib/crm/sync'

config({ path: path.join(process.cwd(), '.env.local') })

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }
  const site = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const users = await syncSiteUsers(site)
  const messages = await syncStoredContactMessages(site)
  console.log(`Synced ${users} site users and ${messages} contact messages`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
