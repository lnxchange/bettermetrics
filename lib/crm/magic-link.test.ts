import assert from 'assert'
import {
  exchangeMagicLink,
  magicLinkVerifyBody,
  tokensFromVerifyResponse
} from './magic-link'

const hashBody = magicLinkVerifyBody(
  { hashed_token: 'hashed', email_otp: '123456' },
  'ada@example.com',
  false
)
assert.deepStrictEqual(hashBody, { type: 'email', token_hash: 'hashed' })

const otpBody = magicLinkVerifyBody(
  { hashed_token: 'hashed', email_otp: '123456' },
  'ada@example.com',
  true
)
assert.deepStrictEqual(otpBody, {
  type: 'email',
  email: 'ada@example.com',
  token: '123456'
})

assert.deepStrictEqual(
  tokensFromVerifyResponse({ access_token: 'a', refresh_token: 'r', user: {} }),
  { access_token: 'a', refresh_token: 'r' }
)
assert.deepStrictEqual(
  tokensFromVerifyResponse({
    session: { access_token: 'a', refresh_token: 'r' }
  }),
  { access_token: 'a', refresh_token: 'r' }
)
assert.equal(tokensFromVerifyResponse({ error: 'expired' }), null)

async function main() {
  let generated = 0
  const verified: Record<string, string>[] = []
  const tokens = await exchangeMagicLink({
    email: 'ada@example.com',
    async generateLink() {
      generated += 1
      return {
        hashed_token: `hash-${generated}`,
        email_otp: `otp-${generated}`
      }
    },
    async verify(body) {
      verified.push(body)
      return body.token === 'otp-2'
        ? { access_token: 'access', refresh_token: 'refresh' }
        : null
    }
  })

  assert.equal(generated, 2)
  assert.deepStrictEqual(verified[0], { type: 'email', token_hash: 'hash-1' })
  assert.deepStrictEqual(verified[1], {
    type: 'email',
    email: 'ada@example.com',
    token: 'otp-2'
  })
  assert.deepStrictEqual(tokens, {
    access_token: 'access',
    refresh_token: 'refresh'
  })
  console.log('magic link tests passed')
}

main()
