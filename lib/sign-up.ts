export type SignUpInput = {
  displayName: string
  email: string
  password: string
  updatesOptIn: boolean
}

export class SignUp {
  static parse(body: unknown): { ok: true; value: SignUpInput } | { ok: false; error: string } {
    const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
    const displayName = typeof record.displayName === 'string' ? record.displayName.trim() : ''
    const email = typeof record.email === 'string' ? record.email.trim() : ''
    const password = typeof record.password === 'string' ? record.password : ''
    if (!displayName || displayName.length > 80) {
      return { ok: false, error: 'Enter a display name.' }
    }
    if (!email.includes('@') || email.length > 200) {
      return { ok: false, error: 'Enter a valid email address.' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }
    return {
      ok: true,
      value: {
        displayName,
        email,
        password,
        updatesOptIn: record.updatesOptIn === true
      }
    }
  }
}
