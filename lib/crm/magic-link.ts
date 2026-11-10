export type AuthTokens = {
  access_token: string
  refresh_token: string
}

export type MagicLinkProperties = {
  hashed_token?: string
  email_otp?: string
}

// generateLink({ type: 'magiclink' }) stores an email OTP. Verifying it as
// type "magiclink" is rejected with "Token has expired or is invalid".
// type "email" matches both magic-link and signup tokens. The hash and the
// raw code are the same token, so only one of them can be submitted.
export function magicLinkVerifyBody(
  properties: MagicLinkProperties,
  email: string,
  preferOtp: boolean
): Record<string, string> | null {
  if (!preferOtp && properties.hashed_token) {
    return { type: 'email', token_hash: properties.hashed_token }
  }
  if (properties.email_otp) {
    return { type: 'email', email, token: properties.email_otp }
  }
  if (properties.hashed_token) {
    return { type: 'email', token_hash: properties.hashed_token }
  }
  return null
}

export function tokensFromVerifyResponse(body: unknown): AuthTokens | null {
  if (!body || typeof body !== 'object') return null
  const record = body as {
    access_token?: unknown
    refresh_token?: unknown
    session?: unknown
  }
  const session =
    record.session && typeof record.session === 'object'
      ? (record.session as { access_token?: unknown; refresh_token?: unknown })
      : record
  if (
    typeof session.access_token !== 'string' ||
    typeof session.refresh_token !== 'string'
  )
    return null
  if (!session.access_token || !session.refresh_token) return null
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token
  }
}

export async function exchangeMagicLink(input: {
  email: string
  generateLink: () => Promise<MagicLinkProperties | null>
  verify: (body: Record<string, string>) => Promise<AuthTokens | null>
}): Promise<AuthTokens | null> {
  let preferOtp = false
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const properties = await input.generateLink()
    if (!properties) return null
    const body = magicLinkVerifyBody(properties, input.email, preferOtp)
    if (!body) return null
    const tokens = await input.verify(body)
    if (tokens) return tokens
    preferOtp = !preferOtp
  }
  return null
}
