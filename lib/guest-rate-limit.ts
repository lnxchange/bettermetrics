import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

/**
 * Server-side daily limits on guest chat questions.
 *
 * The signed cookie in guest-quota.ts is a convenience: a client that never
 * sends it is treated as a new visitor. These limits are what actually bound
 * guest spend. Each guest question is counted per hashed IP address and
 * site-wide, per UTC day, in Supabase (consume_guest_chat, migration
 * 20261112000000_guest_chat_usage.sql).
 *
 * If the count cannot be checked (Supabase unreachable, migration not applied)
 * the guest question is refused. Signed-in users are not affected.
 */

function intFromEnv(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] ?? '', 10)
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

/** Guest questions per IP address per UTC day. */
export const GUEST_DAILY_LIMIT_PER_IP = intFromEnv('GUEST_DAILY_LIMIT_PER_IP', 5)
/** Guest questions across the whole site per UTC day. */
export const GUEST_DAILY_LIMIT_GLOBAL = intFromEnv('GUEST_DAILY_LIMIT_GLOBAL', 100)

export type GuestLimitResult =
  | { allowed: true }
  | { allowed: false; reason: 'ip' | 'global' | 'unavailable' }

export function clientIp(req: Request): string {
  // Vercel sets x-forwarded-for (client first) and x-real-ip.
  const forwarded = req.headers.get('x-forwarded-for')
  const first = forwarded?.split(',')[0]?.trim()
  return first || req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function hashIp(ip: string) {
  const salt =
    process.env.GUEST_CHAT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

export async function consumeGuestQuestion(req: Request): Promise<GuestLimitResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Guest rate limit: Supabase service role not configured')
    return { allowed: false, reason: 'unavailable' }
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
    const { data, error } = await (supabase.rpc as any)('consume_guest_chat', {
      p_ip_hash: hashIp(clientIp(req)),
      p_ip_limit: GUEST_DAILY_LIMIT_PER_IP,
      p_global_limit: GUEST_DAILY_LIMIT_GLOBAL
    })
    if (error) throw error
    const result = data as { allowed?: boolean; reason?: string } | null
    if (result?.allowed) return { allowed: true }
    if (result?.reason === 'ip' || result?.reason === 'global') {
      console.warn('Guest rate limit reached:', result)
      return { allowed: false, reason: result.reason }
    }
    return { allowed: false, reason: 'unavailable' }
  } catch (error) {
    console.error('Guest rate limit check failed:', error)
    return { allowed: false, reason: 'unavailable' }
  }
}
