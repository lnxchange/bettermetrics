import { marked } from 'marked'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'

export interface DigestArticle {
  title: string
  slug: string
  summary: string
  publishedAt: Date
}

/**
 * A Monday-to-Sunday Melbourne week, as Markdown Lex can paste into Substack
 * and as HTML for a quick read. Only articles that are already public are
 * passed in. An empty week says so, and nothing is sent anywhere.
 */
export class WeeklyDigest {
  static build(articles: DigestArticle[], weekOf: Date, siteUrl: string) {
    const start = MelbourneTime.weekStart(weekOf)
    const end = MelbourneTime.addDays(start, 7)
    const included = articles
      .filter(article => article.publishedAt.getTime() >= start.getTime() && article.publishedAt.getTime() < end.getTime())
      .sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
    const heading = `AIM this week, ${MelbourneTime.dayLabel(start)}`
    const lines = [`# ${heading}`, '']
    if (included.length === 0) {
      lines.push('No articles were published this week.', '')
    } else {
      lines.push('Notes from the AIM Framework this week.', '')
      for (const article of included) {
        lines.push(`## ${article.title}`, '', article.summary, '', `[Read it](${siteUrl}/articles/${article.slug})`, '')
      }
    }
    const markdown = lines.join('\n')
    const html = marked.parse(markdown, { async: false }) as string
    return { markdown, html, count: included.length, start, end }
  }
}
