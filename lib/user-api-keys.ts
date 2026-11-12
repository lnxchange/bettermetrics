import 'server-only'

import { decryptApiKey, encryptApiKey } from '@/lib/byok'
import { chatStore } from '@/lib/chat-store'
import { ChatProvider, isChatProvider } from '@/lib/chat-provider-ids'

function serviceClient() {
  return chatStore()
}

export type SavedKey = {
  provider: ChatProvider
  hint: string
  active: boolean
}

export type StoredKey =
  | { key: string; provider: ChatProvider }
  | { key: null; reason: 'missing' | 'unavailable' }

export async function listUserKeys(userId: string): Promise<SavedKey[]> {
  const supabase = serviceClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('provider, hint, active')
    .eq('user_id', userId)
  if (error || !data) return []
  return data.flatMap(row => {
    if (!isChatProvider(row.provider) || typeof row.hint !== 'string') return []
    return [{ provider: row.provider, hint: row.hint, active: row.active === true }]
  })
}

export async function readActiveKey(userId: string): Promise<StoredKey> {
  const supabase = serviceClient()
  if (!supabase) return { key: null, reason: 'unavailable' }
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('ciphertext, provider, active')
    .eq('user_id', userId)
  if (error) {
    console.error('Reading a stored API key failed')
    return { key: null, reason: 'unavailable' }
  }
  const rows = (data ?? []).filter(row => isChatProvider(row.provider) && typeof row.ciphertext === 'string')
  if (rows.length === 0) return { key: null, reason: 'missing' }
  const chosen = rows.find(row => row.active) ?? (rows.length === 1 ? rows[0] : undefined)
  if (!chosen || !isChatProvider(chosen.provider)) return { key: null, reason: 'missing' }
  try {
    return { key: decryptApiKey(chosen.ciphertext), provider: chosen.provider }
  } catch {
    console.error('Could not decrypt a stored API key')
    return { key: null, reason: 'unavailable' }
  }
}

export async function saveUserChatKey(userId: string, provider: ChatProvider, apiKey: string) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const trimmed = apiKey.trim()
  await supabase.from('user_api_keys').update({ active: false }).eq('user_id', userId)
  const { error } = await supabase.from('user_api_keys').upsert(
    {
      user_id: userId,
      provider,
      ciphertext: encryptApiKey(trimmed),
      hint: trimmed.slice(-4),
      active: true,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id,provider' }
  )
  if (error) throw new Error('Could not store the API key')
  return { provider, hint: trimmed.slice(-4), active: true }
}

export async function activateUserKey(userId: string, provider: ChatProvider) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const { data } = await supabase
    .from('user_api_keys')
    .select('provider')
    .eq('user_id', userId)
    .eq('provider', provider)
    .maybeSingle()
  if (!data) throw new Error('missing')
  await supabase.from('user_api_keys').update({ active: false }).eq('user_id', userId)
  const { error } = await supabase
    .from('user_api_keys')
    .update({ active: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('provider', provider)
  if (error) throw new Error('Could not choose that provider')
}

export async function deleteUserChatKey(userId: string, provider: ChatProvider) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const { error } = await supabase.from('user_api_keys').delete().eq('user_id', userId).eq('provider', provider)
  if (error) throw new Error('Could not remove the API key')
  const { data } = await supabase.from('user_api_keys').select('provider, active').eq('user_id', userId)
  const rows = data ?? []
  if (rows.length === 1 && rows[0].active !== true && isChatProvider(rows[0].provider)) {
    await supabase.from('user_api_keys').update({ active: true }).eq('user_id', userId).eq('provider', rows[0].provider)
  }
}

export async function consumeKeySave(
  userId: string,
  ipHash: string
): Promise<'ok' | 'limited' | 'unavailable'> {
  const supabase = serviceClient()
  if (!supabase) return 'unavailable'
  const hour = new Date()
  hour.setMinutes(0, 0, 0)
  const windowStart = hour.toISOString()
  const buckets = [
    { bucket: `user:${userId}`, limit: 5 },
    { bucket: `ip:${ipHash}`, limit: 20 }
  ]
  for (const item of buckets) {
    const { data, error: readError } = await supabase
      .from('api_key_save_attempts')
      .select('count')
      .eq('bucket', item.bucket)
      .eq('window_start', windowStart)
      .maybeSingle()
    if (readError) return 'unavailable'
    const count = typeof data?.count === 'number' ? data.count : 0
    if (count >= item.limit) return 'limited'
    const { error } = await supabase.from('api_key_save_attempts').upsert(
      { bucket: item.bucket, window_start: windowStart, count: count + 1 },
      { onConflict: 'bucket,window_start' }
    )
    if (error) return 'unavailable'
  }
  return 'ok'
}
