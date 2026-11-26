/**
 * Public pages are open to every crawler, including AI crawlers.
 * Only signed-in, private, and unlisted tool paths are disallowed. The lists
 * are the same for every user agent so no crawler is treated differently.
 */
export class CrawlerPolicy {
  static readonly agents = [
    '*',
    'GPTBot',
    'ClaudeBot',
    'Google-Extended',
    'CCBot',
    'PerplexityBot',
    'Applebot-Extended'
  ]

  static readonly disallow = [
    '/account',
    '/admin',
    '/api/',
    '/chat',
    '/reset-password',
    '/share/',
    '/sign-in',
    '/sign-up',
    '/tools',
    '/unsubscribe',
    '/update-password'
  ]

  static rules() {
    return CrawlerPolicy.agents.map(userAgent => ({
      userAgent,
      allow: '/',
      disallow: CrawlerPolicy.disallow
    }))
  }
}
