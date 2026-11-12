import {
  detectProvider,
  isModelId,
  keyMatchesProvider
} from '../lib/chat-provider-ids'
import { openAIDeltaText } from '../lib/chat-providers'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

assert(detectProvider('sk-ant-api03-' + 'a'.repeat(40)) === 'anthropic', 'anthropic prefix')
assert(detectProvider('sk-or-v1-' + 'a'.repeat(20)) === 'openrouter', 'openrouter prefix')
assert(detectProvider('AIza' + 'a'.repeat(30)) === 'google', 'google prefix')
assert(detectProvider('sk-proj-' + 'a'.repeat(20)) === 'openai', 'openai prefix')
assert(detectProvider('not-a-key') === null, 'unknown prefix')

assert(keyMatchesProvider('openai', 'sk-proj-' + 'b'.repeat(24)), 'openai key matches')
assert(!keyMatchesProvider('openai', 'sk-ant-' + 'b'.repeat(40)), 'anthropic key is not openai')
assert(!keyMatchesProvider('google', 'sk-proj-' + 'b'.repeat(24)), 'openai key is not google')

assert(isModelId('gpt-5.4'), 'a plain model id is accepted')
assert(isModelId('openai/gpt-5.4'), 'a namespaced model id is accepted')
assert(!isModelId('gpt 5'), 'spaces are rejected')
assert(!isModelId(''), 'an empty model id is rejected')

assert(openAIDeltaText({ choices: [{ delta: { content: 'Hello' } }] }) === 'Hello', 'string delta')
assert(
  openAIDeltaText({ choices: [{ delta: { content: [{ text: 'A' }, { text: 'B' }] } }] }) === 'AB',
  'array delta'
)
assert(openAIDeltaText({}) === '', 'a chunk without content adds nothing')

console.log('chat provider tests passed')
