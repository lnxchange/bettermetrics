/** Anonymous visitors may call the model only when this is exactly "true". */
export function guestsAllowed() {
  return process.env.CHAT_ALLOW_GUESTS === 'true'
}

/**
 * A signed-in reader who has not added a key may use ANTHROPIC_API_KEY
 * only when this is exactly "true".
 */
export function platformKeyAllowed() {
  return process.env.CHAT_ALLOW_PLATFORM_KEY === 'true'
}
