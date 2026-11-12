import { decryptApiKey, encryptApiKey, isAnthropicApiKey } from '../lib/byok'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const previous = process.env.BYOK_ENCRYPTION_KEY
process.env.BYOK_ENCRYPTION_KEY = 'test-secret'

const sample = `sk-ant-api03-${'a'.repeat(80)}`
assert(isAnthropicApiKey(sample), 'a long sk-ant key is accepted')
assert(!isAnthropicApiKey('sk-live-not-anthropic'), 'another provider is rejected')
assert(!isAnthropicApiKey('sk-ant-short'), 'a short key is rejected')
assert(!isAnthropicApiKey(`sk-ant-${'a'.repeat(40)} extra`), 'whitespace is rejected')

const stored = encryptApiKey(sample)
assert(stored !== sample, 'the stored value is not the raw key')
assert(!stored.includes(sample.slice(10, 30)), 'the stored value does not contain the key')
assert(decryptApiKey(stored) === sample, 'decrypt returns the original key')

const [iv, tag, data] = stored.split('.')
let tampered = false
try {
  decryptApiKey(`${iv}.${tag}.${data.slice(0, -2)}xx`)
} catch {
  tampered = true
}
assert(tampered, 'a modified payload does not decrypt')

if (previous === undefined) delete process.env.BYOK_ENCRYPTION_KEY
else process.env.BYOK_ENCRYPTION_KEY = previous

console.log('byok tests passed')
