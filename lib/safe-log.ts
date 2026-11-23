const KEY = /\b(?:sk-ant-|sk-or-|sk-proj-|sk-|AIza)[A-Za-z0-9_\-]{8,}/g

const DROPPED = new Set([
  'apikey',
  'api_key',
  'authorization',
  'body',
  'ciphertext',
  'content',
  'cookie',
  'cookies',
  'headers',
  'messages',
  'password',
  'question',
  'title'
])

export class SafeLog {
  private static sink: ((line: string) => void) | null = null

  /** Tests capture lines instead of writing them to the console. */
  static capture(sink: (line: string) => void, run: () => void) {
    const previous = SafeLog.sink
    SafeLog.sink = sink
    try {
      run()
    } finally {
      SafeLog.sink = previous
    }
  }

  static redact(value: string): string {
    return value.replace(KEY, '[redacted]')
  }

  static info(message: string, fields?: Record<string, unknown>) {
    SafeLog.write('log', message, fields)
  }

  static error(message: string, fields?: Record<string, unknown>) {
    SafeLog.write('error', message, fields)
  }

  private static write(level: 'log' | 'error', message: string, fields?: Record<string, unknown>) {
    const safeMessage = SafeLog.redact(message)
    const safeFields = fields ? SafeLog.fields(fields) : undefined
    const line = safeFields ? `${safeMessage} ${JSON.stringify(safeFields)}` : safeMessage
    if (SafeLog.sink) {
      SafeLog.sink(line)
      return
    }
    if (level === 'error') console.error(line)
    else console.log(line)
  }

  private static fields(fields: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (DROPPED.has(key.toLowerCase())) continue
      if (typeof value === 'string') out[key] = SafeLog.redact(value)
      else if (typeof value === 'number' || typeof value === 'boolean' || value === null) out[key] = value
    }
    return out
  }
}
