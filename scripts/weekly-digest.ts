/**
 * Print this week's Substack digest. Nothing is posted.
 *
 *   npx tsx scripts/weekly-digest.ts
 *   npx tsx scripts/weekly-digest.ts --week 2027-01-11
 */
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { MelbourneTime } from '../lib/publishing/melbourne-time'
import { PublicArticles } from '../lib/publishing/public'
import { PublishingConfig } from '../lib/publishing/config'
import { WeeklyDigest } from '../lib/publishing/digest'
import { SITE_URL } from '../lib/site'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

async function main() {
  const weekFlag = process.argv.indexOf('--week')
  const weekText = weekFlag >= 0 ? process.argv[weekFlag + 1] : ''
  const weekOf = weekText && /^\d{4}-\d{2}-\d{2}$/.test(weekText)
    ? MelbourneTime.fromLocal(...(weekText.split('-').map(Number) as [number, number, number]), 12, 0)
    : new Date()
  const config = PublishingConfig.gate(process.env, new Date())
  const articles = await PublicArticles.list(config)
  const digest = WeeklyDigest.build(
    articles.map(article => ({
      title: article.title,
      slug: article.slug,
      summary: article.meta_description || '',
      publishedAt: new Date(article.published_at || article.scheduled_publish_at || 0)
    })),
    weekOf,
    SITE_URL
  )
  process.stdout.write(digest.markdown)
  if (!digest.markdown.endsWith('\n')) process.stdout.write('\n')
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Digest failed')
  process.exitCode = 1
})
