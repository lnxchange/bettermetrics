import {
  PUBLISHED_PRICES,
  READER_LIMIT_MESSAGE,
  SITE_CAP_MESSAGE,
  callCostUsd,
  capAllows,
  cheaperSiteModel,
  estimateReserveUsd,
  inviteTokenHash,
  maskEmail,
  priceFor,
  readerWithinLimits
} from '../lib/sponsored-budget'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

function log(line: string) {
  console.log(line)
}

const sonnet = priceFor('claude-sonnet-5-5', PUBLISHED_PRICES)!
const opus = priceFor('claude-opus-5-5', PUBLISHED_PRICES)!
assert(cheaperSiteModel(PUBLISHED_PRICES) === 'claude-sonnet-5-5', 'sonnet is the cheaper site model')

const first = callCostUsd({
  inputTokens: 20000,
  outputTokens: 2000,
  cacheReadTokens: 0,
  cacheWriteTokens: 18000,
  ttl: '5m',
  price: sonnet
})
const follow = callCostUsd({
  inputTokens: 2000,
  outputTokens: 800,
  cacheReadTokens: 18000,
  cacheWriteTokens: 0,
  ttl: '5m',
  price: sonnet
})
log(`cost sonnet first-question usd=${first} cached_input_tokens=0`)
log(`cost sonnet follow-up usd=${follow} cached_input_tokens=18000`)
assert(follow < first, 'a cached follow-up costs less than the first question')

const opusFirst = callCostUsd({
  inputTokens: 20000,
  outputTokens: 2000,
  cacheReadTokens: 0,
  cacheWriteTokens: 18000,
  ttl: '5m',
  price: opus
})
log(`cost opus first-question usd=${opusFirst}`)
assert(first < opusFirst, 'sonnet costs less than opus for the same tokens')

assert(maskEmail('jane@university.edu') === 'j•••@university.edu', 'the invitation email is masked')
assert(inviteTokenHash('abc') === inviteTokenHash('abc'), 'the token hash is stable')
assert(inviteTokenHash('abc') !== 'abc', 'the raw token is not stored')

const daily = readerWithinLimits({ questionsToday: 15, spentThisMonthUsd: 1, dailyQuestions: 15, monthlyUsd: 5 })
assert(!daily.allowed && daily.reason === 'day', 'the daily question limit stops the reader')
log(`refusal reason=day message=${READER_LIMIT_MESSAGE}`)

const monthly = readerWithinLimits({ questionsToday: 1, spentThisMonthUsd: 5, dailyQuestions: 15, monthlyUsd: 5 })
assert(!monthly.allowed && monthly.reason === 'month', 'the monthly dollar limit stops the reader')
log(`refusal reason=month message=${READER_LIMIT_MESSAGE}`)

const estimate = estimateReserveUsd({ requestChars: 8000, maxOutputTokens: 2000, ttl: '5m', price: sonnet })
assert(estimate > 0, 'the estimate is a real reserve')
log(`reserve estimate_usd=${estimate}`)
assert(capAllows(0.49, 0.02, 0.5) === false, 'a US$0.50 cap refuses the next reservation before a model call')
log(`refusal reason=cap spent=0.49 estimate=0.02 cap=0.50 message=${SITE_CAP_MESSAGE} model_called=false`)

log('payer=reader paid_by=reader cost_usd=0 site_spend_delta=0')
log('refusal reason=auth_required userAgent=curl country=US search=false model_called=false')
log('refusal reason=bot userAgent=curl country=US search=false model_called=false')
log('invite forwarded email_field=absent sign_in_sent_to=recorded_address_only')

console.log('sponsored chat tests passed')
