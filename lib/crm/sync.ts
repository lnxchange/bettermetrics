import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  askPolicyForTags,
  crmConfig,
  noteForContactMessage,
  splitName,
  tagsForInterest
} from './config'

export type SyncedContact = {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  companyName?: string | null
  source: string
  externalId?: string | null
  tagNames?: string[]
  siteUserId?: string | null
  askPolicy?: 'do-not-ask' | 'may-ask-to-validate' | null
  note?: string | null
  title?: string | null
  background?: string | null
}

function crmClient(): SupabaseClient | null {
  const config = crmConfig()
  if (!config) return null
  return createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function upsertSyncedContact(contact: SyncedContact): Promise<boolean> {
  const client = crmClient()
  if (!client) return false

  const named = contact.fullName ? splitName(contact.fullName) : null
  const tags = contact.tagNames ?? []
  const { error } = await client.rpc('upsert_synced_contact', {
    p_email: contact.email ?? null,
    p_first_name: contact.firstName ?? named?.firstName ?? null,
    p_last_name: contact.lastName ?? named?.lastName ?? null,
    p_company_name: contact.companyName ?? null,
    p_source: contact.source,
    p_external_id: contact.externalId ?? null,
    p_tag_names: tags,
    p_site_user_id: contact.siteUserId ?? null,
    p_ask_policy: contact.askPolicy ?? (tags.length ? askPolicyForTags(tags) : null),
    p_note: contact.note ?? null,
    p_title: contact.title ?? null,
    p_background: contact.background ?? null
  })

  if (error) {
    console.error('CRM contact sync failed', error.message)
    return false
  }
  return true
}

type ContactMessageRow = {
  name?: string | null
  email?: string | null
  affiliation?: string | null
  interest?: string | null
  subject?: string | null
  message?: string | null
  paper_scope?: string | null
  paper_questions?: string | null
}

export async function syncContactMessage(row: ContactMessageRow): Promise<boolean> {
  if (!row.email && !row.name) return false
  const tags = tagsForInterest(row.interest)
  return upsertSyncedContact({
    email: row.email,
    fullName: row.name || undefined,
    companyName: row.affiliation,
    source: 'contact-form',
    tagNames: tags,
    askPolicy: askPolicyForTags(tags),
    note: noteForContactMessage(row),
    background: row.paper_scope
  })
}

export async function syncSiteUsers(site: SupabaseClient): Promise<number> {
  let page = 1
  let synced = 0
  for (;;) {
    const { data, error } = await site.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const users = data?.users ?? []
    for (const user of users) {
      if (!user.email) continue
      const metadata = user.user_metadata || {}
      const ok = await upsertSyncedContact({
        email: user.email,
        firstName: typeof metadata.first_name === 'string' ? metadata.first_name : null,
        lastName: typeof metadata.last_name === 'string' ? metadata.last_name : null,
        fullName:
          typeof metadata.first_name === 'string'
            ? null
            : typeof metadata.name === 'string'
              ? metadata.name
              : user.email,
        source: 'website-signup',
        externalId: `site-user:${user.id}`,
        tagNames: ['site-user'],
        siteUserId: user.id,
        askPolicy: 'may-ask-to-validate',
        companyName: typeof metadata.organization === 'string' ? metadata.organization : null
      })
      if (ok) synced += 1
    }
    if (users.length < 200) break
    page += 1
  }
  return synced
}

export async function syncStoredContactMessages(site: SupabaseClient): Promise<number> {
  const { data, error } = await site
    .from('contact_messages')
    .select('name, email, affiliation, interest, subject, message, paper_scope, paper_questions')
    .order('created_at', { ascending: true })
  if (error) throw error
  let synced = 0
  for (const row of data ?? []) {
    const ok = await syncContactMessage(row)
    if (ok) synced += 1
  }
  return synced
}
