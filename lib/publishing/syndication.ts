import { createHmac, randomBytes } from 'crypto'

export interface SyndicationInput {
  now: Date
  goLiveAt: Date
  syndicationEnabled: boolean
  previewOnly: boolean
  hasCredentials: boolean
}

export interface XCredentials {
  consumerKey: string
  consumerSecret: string
  token: string
  tokenSecret: string
}

/**
 * Optional post to X when an article first becomes public. Off unless
 * ARTICLE_SYNDICATION_ENABLED is true and the four X credentials are set.
 * Tests and anything before go-live never call the network.
 */
export class ArticleSyndication {
  static credentialNames = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'] as const

  static credentials(env: Record<string, string | undefined>): XCredentials | null {
    const consumerKey = env.X_API_KEY?.trim() || ''
    const consumerSecret = env.X_API_SECRET?.trim() || ''
    const token = env.X_ACCESS_TOKEN?.trim() || ''
    const tokenSecret = env.X_ACCESS_TOKEN_SECRET?.trim() || ''
    if (!consumerKey || !consumerSecret || !token || !tokenSecret) return null
    return { consumerKey, consumerSecret, token, tokenSecret }
  }

  static decide(input: SyndicationInput) {
    if (input.now.getTime() < input.goLiveAt.getTime()) return { post: false, reason: 'before-go-live' }
    if (!input.syndicationEnabled) return { post: false, reason: 'disabled' }
    if (input.previewOnly) return { post: false, reason: 'preview-only' }
    if (!input.hasCredentials) return { post: false, reason: 'missing-x-credentials' }
    return { post: true, reason: 'ok' }
  }

  static text(title: string, summary: string, url: string) {
    const suffix = `\n\n${url}`
    const room = 280 - suffix.length
    const line = summary ? `${title}\n${summary}` : title
    const body = line.length <= room ? line : `${line.slice(0, Math.max(0, room - 1)).trimEnd()}…`
    return `${body}${suffix}`
  }

  /**
   * One attempt. A test process, a closed gate, or missing credentials
   * returns without calling fetch. The fetch implementation is injected so
   * the caller can see that the network was not used.
   */
  static async deliver(
    env: Record<string, string | undefined>,
    article: { slug: string; title: string; summary: string; previewOnly: boolean },
    config: { now: Date; goLiveAt: Date; syndicationEnabled: boolean },
    siteUrl: string,
    fetchImpl: typeof fetch
  ) {
    if (env.NODE_ENV === 'test') return { posted: false, reason: 'test' }
    const decision = ArticleSyndication.decide({
      now: config.now,
      goLiveAt: config.goLiveAt,
      syndicationEnabled: config.syndicationEnabled,
      previewOnly: article.previewOnly,
      hasCredentials: ArticleSyndication.credentials(env) !== null
    })
    if (!decision.post) return { posted: false, reason: decision.reason }
    const credentials = ArticleSyndication.credentials(env)
    if (!credentials) return { posted: false, reason: 'missing-x-credentials' }
    const url = 'https://api.twitter.com/2/tweets'
    const nonce = randomBytes(12).toString('hex')
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const authorization = XOAuth.header('POST', url, credentials, nonce, timestamp)
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: ArticleSyndication.text(article.title, article.summary, `${siteUrl}/articles/${article.slug}`)
      })
    })
    if (!response.ok) return { posted: false, reason: `x-status-${response.status}` }
    return { posted: true, reason: 'posted' }
  }
}

export class XOAuth {
  static enc(value: string) {
    return encodeURIComponent(value).replace(/[!'()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
  }

  static header(method: string, url: string, credentials: XCredentials, nonce: string, timestamp: string) {
    const params: Record<string, string> = {
      oauth_consumer_key: credentials.consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: credentials.token,
      oauth_version: '1.0'
    }
    const pairs = Object.keys(params)
      .sort()
      .map(key => `${XOAuth.enc(key)}=${XOAuth.enc(params[key])}`)
      .join('&')
    const base = `${method.toUpperCase()}&${XOAuth.enc(url)}&${XOAuth.enc(pairs)}`
    const key = `${XOAuth.enc(credentials.consumerSecret)}&${XOAuth.enc(credentials.tokenSecret)}`
    const signature = createHmac('sha1', key).update(base).digest('base64')
    const signed: Record<string, string> = { ...params, oauth_signature: signature }
    const header = Object.keys(signed)
      .sort()
      .map(name => `${XOAuth.enc(name)}="${XOAuth.enc(signed[name])}"`)
      .join(', ')
    return `OAuth ${header}`
  }
}
