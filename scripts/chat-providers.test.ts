import { detectProvider, isModelId } from '../lib/chat-provider-ids'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

assert(detectProvider('sk-ant-api03-' + 'a'.repeat(40)) === 'anthropic', 'anthropic prefix')
assert(detectProvider('sk-or-v1-' + 'a'.repeat(20)) === 'openrouter', 'openrouter prefix')
assert(detectProvider('AIza' + 'a'.repeat(30)) === 'google', 'google prefix')
assert(detectProvider('sk-proj-' + 'a'.repeat(20)) === 'openai', 'openai prefix')
assert(detectProvider('not-a-key') === null, 'unknown prefix')

assert(isModelId('gpt-5.4'), 'a plain model id is accepted')
assert(isModelId('openai/gpt-5.4'), 'a namespaced model id is accepted')
assert(!isModelId('gpt 5'), 'spaces are rejected')
assert(!isModelId(''), 'an empty model id is rejected')

console.log('chat provider tests passed')
