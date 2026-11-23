import type { MetadataRoute } from 'next'
import { CrawlerPolicy } from '@/lib/crawlers'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: CrawlerPolicy.rules(),
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  }
}
