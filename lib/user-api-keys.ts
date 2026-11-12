import 'server-only'
import { createClient } from '@supabase/supabase-js'

import { decryptApiKey, encryptApiKey } from '@/lib/byok'
import {
  ChatProvider,
  isChatProvider,
  isModelId
} from '@/lib/chat-provider-ids'

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

export type KeyStatus = {
  configured: boolean
  hint: string | null
  provider: ChatProvider | null
  model: string | null
}

export type StoredKey =
  | { key: string; provider: ChatProvider; model: string | null }
  | { key: null; reason: 'missing' | 'unavailable' }

const emptyStatus: KeyStatus = {
  configured: false,
  hint: null,
  provider: null,
  model: null
}

export async function getUserApiKeyStatus(userId: string): Promise<KeyStatus> {
  const supabase = serviceClient()
  if (!supabase) return emptyStatus
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('hint, provider, model')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data || !isChatProvider(data.provider)) return emptyStatus
  return {
    configured: true,
    hint: typeof data.hint === 'string' ? data.hint : null,
    provider: data.provider,
    model: typeof data.model === 'string' && isModelId(data.model) ? data.model : null
  }
}

export async function readUserChatKey(userId: string): Promise<StoredKey> {
  const supabase = serviceClient()
  if (!supabase) return { key: null, reason: 'unavailable' }
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('ciphertext, provider, model')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error('Reading a stored API key failed')
    return { key: null, reason: 'unavailable' }
  }
  if (!data?.ciphertext || typeof data.ciphertext !== 'string' || !isChatProvider(data.provider)) {
    return { key: null, reason: 'missing' }
  }
  try {
    return {
      key: decryptApiKey(data.ciphertext),
      provider: data.provider,
      model: typeof data.model === 'string' && isModelId(data.model) ? data.model : null
    }
  } catch {
    console.error('Could not decrypt a stored API key')
    return { key: null, reason: 'unavailable' }
  }
}

export async function saveUserChatKey(
  userId: string,
  provider: ChatProvider,
  apiKey: string,
  model: string | null
) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const trimmed = apiKey.trim()
  const hint = trimmed.slice(-4)
  const { error: removed } = await supabase
    .from('user_api_keys')
    .delete()
    .eq('user_id', userId)
    .neq('provider', provider)
  if (removed) throw new Error('Could not store the API key')
  const { error } = await supabase.from('user_api_keys').upsert(
    {
      user_id: userId,
      provider,
      ciphertext: encryptApiKey(trimmed),
      hint,
      model,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id,provider' }
  )
  if (error) throw new Error('Could not store the API key')
  return { hint, provider, model }
}

export async function deleteUserChatKey(userId: string) {
  const supabase = serviceClient()
  if (!supabase) throw new Error('Supabase service role is not configured')
  const { error } = await supabase.from('user_api_keys').delete().eq('user_id', userId)
  if (error) throw new Error('Could not remove the API key')
}
