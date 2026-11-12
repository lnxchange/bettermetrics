import {
  detectProvider,
  isModelId,
  keyMatchesProvider
} from '../lib/chat-provider-ids'
import {
  buildProviderMessages,
  openAIDeltaText,
  systemMessageContent,
  usageFromChunk
} from '../lib/chat-providers'

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

const blocks = [
  { type: 'text' as const, text: 'AIM prompt', cache_control: { type: 'ephemeral' as const } },
  { type: 'text' as const, text: 'Treatise context', cache_control: { type: 'ephemeral' as const } },
  { type: 'text' as const, text: 'Plain-English mode' }
]
const openai = systemMessageContent(blocks.slice(0, 2), 'openai')
assert(openai[1].prompt_cache_breakpoint?.mode === 'explicit', 'OpenAI caches the treatise block')
assert(!openai[1].cache_control, 'OpenAI uses its own cache marker')
const google = systemMessageContent(blocks.slice(0, 2), 'google')
assert(google[1].cache_control?.type === 'ephemeral', 'Google caches the treatise block')
assert(!google[1].prompt_cache_breakpoint, 'Google uses cache_control')
const router = systemMessageContent(blocks.slice(0, 2), 'openrouter')
assert(router[1].cache_control?.type === 'ephemeral', 'OpenRouter keeps the Anthropic marker')
assert(router[1].prompt_cache_breakpoint?.mode === 'explicit', 'OpenRouter keeps the OpenAI marker')

const messages = buildProviderMessages('openai', blocks, [{ role: 'user', content: 'Why?' }])
assert(messages.length === 3, 'the mode instructions are a separate system message')
assert(messages[0].role === 'system' && messages[1].role === 'system', 'both instructions stay system messages')
assert(messages[2].role === 'user', 'the question stays a user message')
const mode = messages[1]
assert(
  mode.role === 'system' &&
    Array.isArray(mode.content) &&
    mode.content[0].text === 'Plain-English mode' &&
    !mode.content[0].prompt_cache_breakpoint,
  'the mode instructions are sent and are not a cache boundary'
)

const usage = usageFromChunk({
  prompt_tokens: 100,
  completion_tokens: 20,
  prompt_tokens_details: { cached_tokens: 80, cache_write_tokens: 20 }
})
assert(usage.cached_tokens === 80 && usage.cache_write_tokens === 20, 'cache usage is recorded')

console.log('chat provider tests passed')
