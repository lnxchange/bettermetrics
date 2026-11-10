import assert from 'assert'
import {
  applySetCookieHeaders,
  isAdminPath,
  readSession,
  safeNextPath
} from './session-cookie'

function jwt(payload: Record<string, unknown>): string {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString('base64url')
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.sig`
}

const future = Math.floor(Date.now() / 1000) + 3600
const accessToken = jwt({
  sub: 'user-1',
  email: 'ada@example.com',
  exp: future,
  user_metadata: { is_admin: true, name: 'Ada Lovelace' },
  app_metadata: { provider: 'email' }
})

assert.equal(safeNextPath(null), '/')
assert.equal(safeNextPath('https://evil.example/phish'), '/')
assert.equal(safeNextPath('//evil.example'), '/')
assert.equal(safeNextPath('/sign-in?redirectedFrom=/admin'), '/')
assert.equal(safeNextPath('/admin?tab=users'), '/admin?tab=users')
assert.equal(isAdminPath('/admin'), true)
assert.equal(isAdminPath('/admin/users'), true)
assert.equal(isAdminPath('/sign-in'), false)
assert.equal(isAdminPath('/administrator'), false)

const replaced = applySetCookieHeaders('supabase.auth.token=old; theme=light', [
  `supabase.auth.token=${encodeURIComponent(
    JSON.stringify([accessToken, 'refresh'])
  )}; Path=/; Max-Age=3600`
])
assert.equal(replaced.includes('theme=light'), true)
assert.equal(replaced.includes(accessToken), true)
assert.equal(replaced.includes('old'), false)

const cleared = applySetCookieHeaders('supabase.auth.token=old; theme=light', [
  'supabase.auth.token=; Max-Age=0; Path=/'
])
assert.equal(cleared, 'theme=light')

const session = readSession(JSON.stringify([accessToken, 'refresh-1']))
assert.equal(session?.user.id, 'user-1')
assert.equal(session?.user.email, 'ada@example.com')
assert.equal(session?.user.user_metadata.is_admin, true)
assert.equal(session?.refresh_token, 'refresh-1')

const expired = jwt({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) - 10 })
assert.equal(readSession(JSON.stringify([expired, 'refresh-1'])), null)
assert.equal(readSession('not-json'), null)

console.log('session cookie tests passed')
