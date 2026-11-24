import { timingSafeEqual } from 'crypto'

/** Bearer comparison for the cron route. The token is never logged. */
export class BearerAuth {
  static matches(header: string | null, secrets: string[]) {
    const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
    if (!token) return false
    const given = Buffer.from(token)
    return secrets.some(secret => {
      const expected = Buffer.from(secret)
      if (given.length !== expected.length || expected.length === 0) return false
      return timingSafeEqual(given, expected)
    })
  }
}
