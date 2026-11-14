import 'server-only'
import { randomBytes } from 'crypto'
import { createClient } from '@supabase/supabase-js'

import { chatStore } from '@/lib/chat-store'
import { crmConfig } from '@/lib/crm/config'
import { upsertSyncedContact } from '@/lib/crm/sync'
import { inviteTokenHash, maskEmail } from '@/lib/sponsored-budget'

export { maskEmail }

const INVITE_DAYS = 30

export type InviteRow = {
  id: number
  crm_contact_id: string
  email: string
  token_hash: string
  created_at: string
  expires_at: string
  redeemed_at: string | null
  redeemed_user_id: string | null
  revoked_at: string | null
}

export type InviteStatus = 'not_sent' | 'sent' | 'redeemed' | 'expired' | 'revoked'

export function inviteStatus(row: InviteRow | null, now = Date.now()): InviteStatus {
  if (!row) return 'not_sent'
  if (row.revoked_at) return 'revoked'
  if (row.redeemed_at) return 'redeemed'
  if (new Date(row.expires_at).getTime() <= now) return 'expired'
  return 'sent'
}

function siteAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

function crm() {
  const config = crmConfig()
  if (!config) return null
  return createClient(config.url, config.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function contactEmail(crmContactId: string): Promise<string | null> {
  const client = crm()
  if (!client) return null
  const { data, error } = await client
    .from('contacts')
    .select('id, email_jsonb, first_name, last_name')
    .eq('id', crmContactId)
    .maybeSingle()
  if (error || !data) return null
  const emails = Array.isArray(data.email_jsonb) ? data.email_jsonb : []
  const first = emails.find((item: { email?: string }) => typeof item?.email === 'string' && item.email.includes('@'))
  return first ? String(first.email).trim().toLowerCase() : null
}

export async function latestInvite(crmContactId: string): Promise<InviteRow | null> {
  const store = chatStore()
  if (!store) return null
  const { data } = await store
    .from('chat_invites')
    .select('id, crm_contact_id, email, token_hash, created_at, expires_at, redeemed_at, redeemed_user_id, revoked_at')
    .eq('crm_contact_id', crmContactId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as InviteRow | null) ?? null
}

export async function createInvite(crmContactId: string, origin: string): Promise<{ url: string; email: string } | { error: string }> {
  const email = await contactEmail(crmContactId)
  if (!email) return { error: 'That contact has no email address.' }
  const store = chatStore()
  if (!store) return { error: 'Invitation storage is not configured.' }
  const token = randomBytes(32).toString('base64url')
  const expires = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await store.from('chat_invites').insert({
    crm_contact_id: crmContactId,
    email,
    token_hash: inviteTokenHash(token),
    expires_at: expires
  })
  if (error) return { error: 'Could not create the invitation. Apply the sponsored chat migration.' }
  return { url: `${origin}/invite/${token}`, email }
}

export async function findInviteByToken(token: string): Promise<InviteRow | null> {
  const store = chatStore()
  if (!store) return null
  const { data } = await store
    .from('chat_invites')
    .select('id, crm_contact_id, email, token_hash, created_at, expires_at, redeemed_at, redeemed_user_id, revoked_at')
    .eq('token_hash', inviteTokenHash(token))
    .maybeSingle()
  return (data as InviteRow | null) ?? null
}

export function inviteBlockReason(row: InviteRow, now = Date.now()): string | null {
  if (row.redeemed_at) return 'This invitation has already been used. Sign in with the email it was sent to.'
  if (row.revoked_at) return 'This invitation has been revoked.'
  if (new Date(row.expires_at).getTime() <= now) return 'This invitation has expired.'
  return null
}

export async function revokeInvite(crmContactId: string): Promise<{ error?: string }> {
  const row = await latestInvite(crmContactId)
  if (!row) return { error: 'No invitation to revoke.' }
  const store = chatStore()
  if (!store) return { error: 'Invitation storage is not configured.' }
  const { error } = await store.from('chat_invites').update({ revoked_at: new Date().toISOString() }).eq('id', row.id)
  if (error) return { error: 'Could not revoke the invitation.' }
  if (row.redeemed_user_id) await setSponsored(row.redeemed_user_id, false)
  return {}
}

export async function setSponsored(userId: string, sponsored: boolean) {
  const auth = siteAuth()
  if (!auth) return
  const { data } = await auth.auth.admin.getUserById(userId)
  const current = (data.user?.app_metadata ?? {}) as Record<string, unknown>
  await auth.auth.admin.updateUserById(userId, {
    app_metadata: { ...current, chat_access: sponsored ? 'sponsored' : null }
  })
}

export async function redeemInvite(token: string, userId: string, email: string): Promise<{ error?: string }> {
  const row = await findInviteByToken(token)
  if (!row) return { error: 'This invitation is not valid.' }
  const blocked = inviteBlockReason(row)
  if (blocked) return { error: blocked }
  if (row.email.toLowerCase() !== email.toLowerCase()) {
    return { error: 'Sign in with the email this invitation was sent to.' }
  }
  const store = chatStore()
  if (!store) return { error: 'Invitation storage is not configured.' }
  const { error } = await store
    .from('chat_invites')
    .update({ redeemed_at: new Date().toISOString(), redeemed_user_id: userId })
    .eq('id', row.id)
    .is('redeemed_at', null)
    .is('revoked_at', null)
  if (error) return { error: 'Could not redeem the invitation.' }
  await setSponsored(userId, true)
  const client = crm()
  if (client) {
    await client.from('contacts').update({ site_user_id: userId }).eq('id', row.crm_contact_id)
  }
  return {}
}

export async function requestInvitation(input: { name: string; email: string; institution: string; interest: string }) {
  return upsertSyncedContact({
    email: input.email,
    fullName: input.name,
    companyName: input.institution,
    source: 'chat-request',
    tagNames: ['chat-request'],
    note: input.interest,
    askPolicy: 'do-not-ask'
  })
}

export async function inviteCounts() {
  const store = chatStore()
  if (!store) return { sent: 0, redeemed: 0, expired: 0 }
  const { data } = await store.from('chat_invites').select('redeemed_at, revoked_at, expires_at')
  const now = Date.now()
  let sent = 0
  let redeemed = 0
  let expired = 0
  for (const row of data ?? []) {
    if (row.redeemed_at) redeemed += 1
    else if (!row.revoked_at && new Date(row.expires_at).getTime() <= now) expired += 1
    else if (!row.revoked_at) sent += 1
  }
  return { sent, redeemed, expired }
}

export async function allowInviteAttempt(bucket: string, limit: number): Promise<boolean> {
  const store = chatStore()
  if (!store) return false
  const hour = new Date()
  hour.setMinutes(0, 0, 0)
  const windowStart = hour.toISOString()
  const { data, error } = await store
    .from('invite_rate_limits')
    .select('count')
    .eq('bucket', bucket)
    .eq('window_start', windowStart)
    .maybeSingle()
  if (error) return false
  const count = typeof data?.count === 'number' ? data.count : 0
  if (count >= limit) return false
  const { error: writeError } = await store.from('invite_rate_limits').upsert(
    { bucket, window_start: windowStart, count: count + 1 },
    { onConflict: 'bucket,window_start' }
  )
  return !writeError
}
