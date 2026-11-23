import { createHmac, timingSafeEqual } from 'crypto'

export class UnsubscribeToken {
  static sign(userId: string, email: string): string {
    const payload = Buffer.from(
      JSON.stringify({ userId, email: email.trim().toLowerCase() })
    ).toString('base64url')
    const signature = createHmac('sha256', UnsubscribeToken.secret()).update(payload).digest('base64url')
    return `${payload}.${signature}`
  }

  static open(token: string): { userId: string; email: string } | null {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null
    const expected = createHmac('sha256', UnsubscribeToken.secret()).update(payload).digest('base64url')
    const left = Buffer.from(signature)
    const right = Buffer.from(expected)
    if (left.length !== right.length || !timingSafeEqual(left, right)) return null
    try {
      const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
        userId?: string
        email?: string
      }
      if (!parsed.userId || !parsed.email) return null
      return { userId: parsed.userId, email: parsed.email }
    } catch {
      return null
    }
  }

  private static secret(): string {
    const secret =
      process.env.UNSUBSCRIBE_SECRET ||
      process.env.BYOK_ENCRYPTION_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!secret) throw new Error('Unsubscribe secret is not configured')
    return secret
  }
}
