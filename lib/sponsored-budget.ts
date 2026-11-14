import { createHash } from 'crypto'

export type ModelPrice = {
  model: string
  inputUsdPerMtok: number
  outputUsdPerMtok: number
  cacheWrite5mUsdPerMtok: number
  cacheWrite1hUsdPerMtok: number
  cacheReadUsdPerMtok: number
}

export const PUBLISHED_PRICES: ModelPrice[] = [
  {
    model: 'claude-sonnet-5-5',
    inputUsdPerMtok: 2,
    outputUsdPerMtok: 10,
    cacheWrite5mUsdPerMtok: 2.5,
    cacheWrite1hUsdPerMtok: 4,
    cacheReadUsdPerMtok: 0.1
  },
  {
    model: 'claude-opus-5-5',
    inputUsdPerMtok: 4,
    outputUsdPerMtok: 20,
    cacheWrite5mUsdPerMtok: 5,
    cacheWrite1hUsdPerMtok: 8,
    cacheReadUsdPerMtok: 0.2
  }
]

export const SITE_PAID_MODEL = 'claude-sonnet-5-5'
export const READER_LIMIT_MESSAGE =
  "You've reached this month's limit for Ask the AI. You can keep going with your own Anthropic, OpenAI, Google or OpenRouter key, added on your profile page."
export const SITE_CAP_MESSAGE =
  'Ask the AI has reached its budget for this month. It resets on the 1st, or you can add your own key on your profile page.'

export function priceFor(model: string, prices: ModelPrice[]): ModelPrice | null {
  return prices.find(item => item.model === model) ?? PUBLISHED_PRICES.find(item => item.model === model) ?? null
}

export function cheaperSiteModel(prices: ModelPrice[]): string {
  const sonnet = priceFor('claude-sonnet-5-5', prices)
  const opus = priceFor('claude-opus-5-5', prices)
  if (!sonnet || !opus) return SITE_PAID_MODEL
  const sonnetCost = sonnet.inputUsdPerMtok + sonnet.outputUsdPerMtok
  const opusCost = opus.inputUsdPerMtok + opus.outputUsdPerMtok
  return sonnetCost <= opusCost ? sonnet.model : opus.model
}

/** USD for one call. Input tokens are the uncached input the API reports. */
export function callCostUsd(input: {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  ttl: '5m' | '1h'
  price: ModelPrice
}): number {
  const write = input.ttl === '1h' ? input.price.cacheWrite1hUsdPerMtok : input.price.cacheWrite5mUsdPerMtok
  const usd =
    (input.inputTokens * input.price.inputUsdPerMtok +
      input.cacheWriteTokens * write +
      input.cacheReadTokens * input.price.cacheReadUsdPerMtok +
      input.outputTokens * input.price.outputUsdPerMtok) /
    1_000_000
  return Math.round(usd * 1_000_000) / 1_000_000
}

export function estimateReserveUsd(input: {
  requestChars: number
  maxOutputTokens: number
  ttl: '5m' | '1h'
  price: ModelPrice
}): number {
  const inputTokens = Math.ceil(input.requestChars / 4)
  return callCostUsd({
    inputTokens,
    outputTokens: input.maxOutputTokens,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    ttl: input.ttl,
    price: input.price
  })
}

export type ReaderLimit = { allowed: true } | { allowed: false; reason: 'day' | 'month' }

export function readerWithinLimits(input: {
  questionsToday: number
  spentThisMonthUsd: number
  dailyQuestions: number
  monthlyUsd: number
}): ReaderLimit {
  if (input.questionsToday >= input.dailyQuestions) return { allowed: false, reason: 'day' }
  if (input.spentThisMonthUsd >= input.monthlyUsd) return { allowed: false, reason: 'month' }
  return { allowed: true }
}

export function capAllows(spentUsd: number, estimateUsd: number, capUsd: number): boolean {
  return spentUsd + estimateUsd <= capUsd
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '•••'
  return `${local.slice(0, 1)}•••@${domain}`
}

export function inviteTokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
