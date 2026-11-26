export interface FeedArticle {
  title: string
  slug: string
  summary: string
  publishedAt: Date
  author: string | null
}

/** RSS 2.0 and Atom for the public article list. Callers pass only public rows. */
export class ArticleFeed {
  static rss(articles: FeedArticle[], siteUrl: string, now = new Date()) {
    const channel = `${siteUrl}/articles`
    const items = articles
      .map(article => {
        const link = `${siteUrl}/articles/${article.slug}`
        return [
          '    <item>',
          `      <title>${ArticleFeed.escape(article.title)}</title>`,
          `      <link>${ArticleFeed.escape(link)}</link>`,
          `      <guid isPermaLink="true">${ArticleFeed.escape(link)}</guid>`,
          `      <pubDate>${article.publishedAt.toUTCString()}</pubDate>`,
          `      <description>${ArticleFeed.escape(article.summary)}</description>`,
          article.author ? `      <author>${ArticleFeed.escape(article.author)}</author>` : '',
          '    </item>'
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n')
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      '  <channel>',
      '    <title>Articles from the AIM Framework</title>',
      `    <link>${ArticleFeed.escape(channel)}</link>`,
      '    <description>Articles applying the AIM Framework, a general theory of human motivation.</description>',
      '    <language>en-AU</language>',
      `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
      items,
      '  </channel>',
      '</rss>',
      ''
    ]
      .filter(line => line !== '')
      .join('\n')
  }

  static atom(articles: FeedArticle[], siteUrl: string, now = new Date()) {
    const channel = `${siteUrl}/articles`
    const self = `${siteUrl}/articles/atom.xml`
    const updated = (articles[0]?.publishedAt ?? now).toISOString()
    const entries = articles
      .map(article => {
        const link = `${siteUrl}/articles/${article.slug}`
        return [
          '  <entry>',
          `    <title>${ArticleFeed.escape(article.title)}</title>`,
          `    <link href="${ArticleFeed.escape(link)}"/>`,
          `    <id>${ArticleFeed.escape(link)}</id>`,
          `    <updated>${article.publishedAt.toISOString()}</updated>`,
          `    <summary>${ArticleFeed.escape(article.summary)}</summary>`,
          article.author ? `    <author><name>${ArticleFeed.escape(article.author)}</name></author>` : '',
          '  </entry>'
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n')
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      '  <title>Articles from the AIM Framework</title>',
      `  <link href="${ArticleFeed.escape(channel)}"/>`,
      `  <link rel="self" href="${ArticleFeed.escape(self)}"/>`,
      `  <updated>${updated}</updated>`,
      `  <id>${ArticleFeed.escape(channel)}</id>`,
      entries,
      '</feed>',
      ''
    ]
      .filter(line => line !== '')
      .join('\n')
  }

  static escape(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}
