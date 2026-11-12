import { CHAT_PROVIDERS, ChatProvider } from '@/lib/chat-provider-ids'

const SITE_KEY_ENV: Record<ChatProvider, string[]> = {
  anthropic: ['ANTHROPIC_API_KEY'],
  openai: ['OPENAI_API_KEY'],
  google: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
  openrouter: ['OPENROUTER_API_KEY']
}

/** The site key for one provider, when that variable is set. Never log the return value. */
export function siteKeyFor(provider: ChatProvider): string | null {
  for (const name of SITE_KEY_ENV[provider]) {
    const value = process.env[name]?.trim()
    if (value) return value
  }
  return null
}

/**
 * The key an admin uses when they have not saved their own.
 * Anthropic is first because that is the site key chat used before bring-your-own-key.
 */
export function adminSiteKey(
  providersEnabled: Partial<Record<ChatProvider, boolean>>
): { provider: ChatProvider; apiKey: string } | null {
  for (const provider of CHAT_PROVIDERS) {
    if (providersEnabled[provider] === false) continue
    const apiKey = siteKeyFor(provider)
    if (apiKey) return { provider, apiKey }
  }
  return null
}

export function isSiteAdmin(user: { user_metadata?: { is_admin?: unknown } } | null | undefined) {
  return user?.user_metadata?.is_admin === true
}
