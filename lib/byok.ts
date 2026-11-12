import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

/**
 * Encrypts a reader's API key before it is stored.
 * The raw key is only decrypted in the chat route, on the server.
 * Set BYOK_ENCRYPTION_KEY in production. If it is unset, the service role
 * key is the fallback, so rotating that key makes stored keys unreadable.
 */
function encryptionKey(): Buffer {
  const secret = process.env.BYOK_ENCRYPTION_KEY
  if (secret) return createHash('sha256').update(`aim-byok:${secret}`).digest()
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BYOK encryption secret is not configured')
  }
  const fallback = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!fallback) throw new Error('BYOK encryption secret is not configured')
  return createHash('sha256').update(`aim-byok-dev:${fallback}`).digest()
}

export function isAnthropicApiKey(value: string): boolean {
  const key = value.trim()
  return key.startsWith('sk-ant-') && key.length >= 40 && !/\s/.test(key)
}

export function encryptApiKey(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map(part => part.toString('base64url')).join('.')
}

export function decryptApiKey(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.')
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Malformed API key payload')
  }
  const decipher = createDecipheriv(
    'aes-256-gcm',
    encryptionKey(),
    Buffer.from(ivB64, 'base64url')
  )
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final()
  ]).toString('utf8')
}
