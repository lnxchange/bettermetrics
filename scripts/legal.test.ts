import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ChatAudit, KeyAudit } from '../lib/chat-audit'
import { CrawlerPolicy } from '../lib/crawlers'
import { FrameworkUpdates } from '../lib/framework-updates'
import { LegalDocument } from '../lib/legal-document'
import { MailingList, type MailingPort } from '../lib/crm/mailing'
import { SafeLog } from '../lib/safe-log'
import { SignUp } from '../lib/sign-up'
import { SiteMail } from '../lib/site-mail'

const DUMMY_KEY = 'sk-ant-api03-DUMMYKEY-yule-legal-261123'
const MARKER = 'MARKERPHRASE-yule-legal-261123'

function source(path: string) {
  return readFileSync(path, 'utf8')
}

const terms = LegalDocument.html('terms')
const privacy = LegalDocument.html('privacy')

assert.equal(terms.includes('[CONFIRM'), false)
assert.equal(privacy.includes('[CONFIRM'), false)
assert.equal(terms.includes('[PUBLICATION'), false)
assert.equal(privacy.includes('[PUBLICATION'), false)
assert.equal(terms.includes('id="4-your-api-key"'), true)
assert.equal(terms.includes('id="7-licence-for-the-aim-framework-materials"'), true)
assert.equal(privacy.includes('id="6-your-api-key"'), true)
assert.equal(privacy.includes('stored only for your own history'), true)
assert.equal(privacy.includes('Washington, D.C.'), true)
assert.equal(privacy.includes('Mumbai, India'), true)
assert.equal(privacy.includes('Sydney, Australia'), true)
assert.equal(privacy.includes('G-8FH4WH9DQH'), true)
assert.equal(privacy.includes('kept for 1 day'), true)
assert.equal(privacy.includes('including from backups within 7 days'), true)
assert.equal(privacy.includes('for up to 7 days before it is overwritten'), true)
assert.equal(privacy.includes('23 November 2026'), true)
assert.equal(terms.includes('23 November 2026'), true)
assert.equal(privacy.toLowerCase().includes('not stored'), false)

const lines: string[] = []
SafeLog.capture(line => lines.push(line), () => {
  SafeLog.info('Saving chat', {
    id: 'chat-1',
    userId: 'user-1',
    title: MARKER,
    apiKey: DUMMY_KEY,
    messages: [{ content: MARKER }],
    question: MARKER,
    headers: { authorization: `Bearer ${DUMMY_KEY}` },
    body: MARKER,
    password: 'secret'
  })
  ChatAudit.saved({ id: 'chat-1', userId: 'user-1', messageCount: 2 })
  ChatAudit.failed()
  KeyAudit.failed('save')
  SafeLog.error(`provider rejected ${DUMMY_KEY}`)
})
const logged = lines.join('\n')
assert.equal(logged.includes(DUMMY_KEY), false)
assert.equal(logged.includes(MARKER), false)
assert.equal(logged.includes('[redacted]'), true)
assert.equal(logged.includes('chat-1'), true)
assert.equal(source('app/api/chat/route.ts').includes('ChatAudit.saved({ id, userId, messageCount'), true)
assert.equal(source('app/api/chat/route.ts').includes('terms_required'), false)
assert.equal(source('middleware.ts').includes('/accept-terms'), false)
assert.equal(source('app/api/account/api-key/route.ts').includes('Accept the Terms of Use'), false)
assert.equal(source('app/api/account/profile/route.ts').includes('Accept the Terms of Use'), false)
const filter = MailingList.newsletterContains('Ada@Example.com')
assert.equal(filter, '[{"email":"ada@example.com"}]')
assert.equal(`cs.${filter}`.includes('[object Object]'), false)

for (const file of ['app/api/chat/route.ts', 'app/api/account/api-key/route.ts']) {
  assert.equal(source(file).includes('console.'), false, `${file} still logs directly`)
}

const withoutUpdates = SignUp.parse({
  displayName: 'Ada',
  email: 'ada@example.com',
  password: 'secret'
})
assert.equal(withoutUpdates.ok, true)
if (withoutUpdates.ok) assert.equal(withoutUpdates.value.updatesOptIn, false)
const withUpdates = SignUp.parse({
  displayName: 'Ada',
  email: 'ada@example.com',
  password: 'secret',
  updatesOptIn: true
})
assert.equal(withUpdates.ok, true)
if (withUpdates.ok) assert.equal(withUpdates.value.updatesOptIn, true)

function port(): MailingPort & { calls: string[] } {
  const calls: string[] = []
  return {
    calls,
    async upsert() {
      calls.push('upsert')
      return true
    },
    async suppress(_email, _userId, reason) {
      calls.push(`suppress:${reason}`)
      return true
    },
    async clearOptOut() {
      calls.push('clear')
      return true
    }
  }
}

async function mailing() {
  const optedIn = port()
  assert.equal(await MailingList.optIn({ email: 'ada@example.com', displayName: 'Ada', userId: 'user-1' }, optedIn), true)
  assert.deepEqual(optedIn.calls, ['clear', 'upsert'])

  const optedOut = port()
  assert.equal(await MailingList.optOut('ada@example.com', 'user-1', optedOut), true)
  assert.deepEqual(optedOut.calls, ['suppress:opt-out'])

  const deleted = port()
  assert.equal(await MailingList.deleted('ada@example.com', 'user-1', deleted), true)
  assert.deepEqual(deleted.calls, ['suppress:account-deleted'])
}

const gpt = CrawlerPolicy.rules().find(rule => rule.userAgent === 'GPTBot')
assert.ok(gpt)
assert.equal(gpt.allow, '/')
assert.equal(gpt.disallow.includes('/account'), true)
assert.equal(gpt.disallow.includes('/api/'), true)
assert.equal(gpt.disallow.includes('/chat'), true)
assert.equal(gpt.disallow.includes('/'), false)

process.env.UNSUBSCRIBE_SECRET = 'legal-test-secret'
delete process.env.RESEND_FROM
assert.equal(SiteMail.from(), 'AIM Theory <notifications@aimtheory.org>')
process.env.RESEND_FROM = 'AIM Theory <override@aimtheory.org>'
assert.equal(SiteMail.from(), 'AIM Theory <override@aimtheory.org>')
delete process.env.RESEND_FROM
const message = FrameworkUpdates.message({
  to: 'ada@example.com',
  userId: 'user-1',
  subject: 'A chapter',
  text: 'The chapter is up.'
})
assert.equal(message.from, 'AIM Theory <notifications@aimtheory.org>')
assert.equal(message.text.includes('Yule Guttenbeil, aimtheory.org'), true)
assert.equal(message.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
assert.equal(message.html.includes('/unsubscribe?token='), true)

const robots = source('app/robots.ts')
assert.equal(robots.includes('CrawlerPolicy'), true)
const llms = source('public/llms.txt')
assert.equal(llms.includes('/architecture'), true)
assert.equal(llms.includes('](https://aimtheory.org/axioms)'), false)
const byok = source('lib/byok.ts')
assert.equal(byok.includes('aes-256-gcm'), true)
assert.equal(byok.includes('BYOK_ENCRYPTION_KEY'), true)
const notice = source('lib/chat-notice.ts')
assert.equal(notice.includes('decrypts it in server memory'), true)
assert.equal(notice.toLowerCase().includes('free to everyone'), false)

mailing().then(() => console.log('legal checks passed')).catch(error => {
  console.error(error)
  process.exit(1)
})
