/** Anonymous visitors may call the model only when this is exactly "true". */
export function guestsAllowed() {
  return process.env.CHAT_ALLOW_GUESTS === 'true'
}
