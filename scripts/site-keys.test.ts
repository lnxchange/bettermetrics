import { adminSiteKey, isSiteAdmin, siteKeyFor } from '../lib/site-keys'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const previous = {
  anthropic: process.env.ANTHROPIC_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  google: process.env.GOOGLE_API_KEY,
  gemini: process.env.GEMINI_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY
}

function restore() {
  const assign = (name: string, value: string | undefined) => {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
  assign('ANTHROPIC_API_KEY', previous.anthropic)
  assign('OPENAI_API_KEY', previous.openai)
  assign('GOOGLE_API_KEY', previous.google)
  assign('GEMINI_API_KEY', previous.gemini)
  assign('OPENROUTER_API_KEY', previous.openrouter)
}

delete process.env.ANTHROPIC_API_KEY
delete process.env.OPENAI_API_KEY
delete process.env.GOOGLE_API_KEY
delete process.env.GEMINI_API_KEY
delete process.env.OPENROUTER_API_KEY

assert(adminSiteKey({ anthropic: true }) === null, 'no site key means no admin fallback')

process.env.OPENAI_API_KEY = 'sk-openai-test'
process.env.ANTHROPIC_API_KEY = 'sk-ant-test'
const chosen = adminSiteKey({ anthropic: true, openai: true })
assert(chosen?.provider === 'anthropic', 'anthropic is the admin key when it is set')
assert(chosen?.apiKey === 'sk-ant-test', 'the anthropic value is the one used')

const openai = adminSiteKey({ anthropic: false, openai: true })
assert(openai?.provider === 'openai', 'a turned-off provider is skipped')
assert(siteKeyFor('google') === null, 'google is absent until its variable is set')
process.env.GEMINI_API_KEY = 'AIza-test'
assert(siteKeyFor('google') === 'AIza-test', 'GEMINI_API_KEY supplies Google')

assert(isSiteAdmin({ user_metadata: { is_admin: true } }), 'an admin flag is recognised')
assert(!isSiteAdmin({ user_metadata: { is_admin: false } }), 'a reader is not an admin')
assert(!isSiteAdmin(null), 'a missing session is not an admin')

restore()
console.log('site key tests passed')
