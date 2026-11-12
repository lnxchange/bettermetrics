import 'server-only'
import { createClient } from '@supabase/supabase-js'

import { decryptApiKey, encryptApiKey, isAnthropicApiKey } from '@/lib/byok'

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

export type StoredKey =
  | { key: string }
  | { key: null; reason: 'missing' | 'unavailable' }

export async function getUserApiKeyStatus(
  userId: string
): Promise<{ configured: boolean; hint: string | null }> {
  const supabase = serviceClient()
  if (!supabase) return { configured: false, hint: null }
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('hint')
    .eq('user_id', userId)
    .eq('provider', 'anthropic')
    .maybeSingle()
  if (error || !data) return { configured: false, hint: null }
  return { configured: true, hint: typeof data.hint === 'string' ? data.hint : null }
}

export async function readUserAnthropicKey(userId: string): Promise<StoredKey> {
  const supabase = serviceClient()
  if (!supabase) return { key: null, reason: 'unavailable' }
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('ciphertext')
    .eq('user_id', userId)
    .eq('provider', 'anthropic')
    .maybeSingle()
  if (error) {
    console.error('Reading a stored API key failed')
    return { key: null, reason: 'unavailable' }
  }
  if (!data?.ciphertext || typeof data.ciphertext !== 'string') {
    return { key: null, reason: 'missing' }
  }
  try {
    return { key: decryptApiKey(data.ciphertext) }
  } catch {
    console.error('Could not decrypt a stored API key')
    return { key: null, reason: 'unavailable' }
  }
}

export async function saveUserAnthropicKey(userId: string, apiKey: string) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const trimmed = apiKey.trim()
  const hint = trimmed.slice(-4)
  const { error } = await supabase.from('user_api_keys').upsert(
    {
      user_id: userId,
      provider: 'anthropic',
      ciphertext: encryptApiKey(trimmed),
      hint,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id,provider' }
  )
  if (error) throw new Error('Could not store the API key')
  return { hint }
}

export async function deleteUserAnthropicKey(userId: string) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const { error } = await supabase
    .from('user_api_keys')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'anthropic')
  if (error) throw new Error('Could not remove the API key')
}

/** Confirms the key with Anthropic before it is stored. The key is not logged. */
export async function anthropicKeyAccepted(
  apiKey: string
): Promise<'ok' | 'rejected' | 'unavailable'> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models?limit=1', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      signal: AbortSignal.timeout(10000)
    })
    if (response.ok) return 'ok'
    if (response.status === 401 || response.status === 403) return 'rejected'
    return 'unavailable'
  } catch {
    return 'unavailable'
  }
}

export { isAnthropicApiKey }
