import { SafeLog } from '@/lib/safe-log'

/**
 * The only log lines the chat and key routes may write.
 * Question text, API keys, request bodies and headers are not accepted.
 */
export class ChatAudit {
  static requested(fields: {
    provider: string
    payer: string
    model: string
    userId: string
    messageCount: number
    contextChars: number
  }) {
    SafeLog.info('Making chat request', fields)
  }

  static answered(fields: {
    provider: string
    model: string
    userId: string
    inputTokens: number
    outputTokens: number
    cachedTokens: number
    contextChars: number
  }) {
    SafeLog.info('Chat response received', fields)
  }

  static saved(fields: { id: string; userId: string; messageCount: number }) {
    SafeLog.info('Chat saved', fields)
  }

  static providerFailed(fields: {
    code: string
    provider: string
    model: string
    userId: string
    messageCount: number
  }) {
    SafeLog.error('Chat provider error', fields)
  }

  static failed() {
    SafeLog.error('Chat request failed')
  }
}

export class KeyAudit {
  static failed(action: 'save' | 'remove') {
    SafeLog.error(action === 'save' ? 'Saving an API key failed' : 'Removing an API key failed')
  }
}
