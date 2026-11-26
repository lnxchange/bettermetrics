import { NextResponse } from 'next/server'
import { ArticleFeed } from '@/lib/publishing/feed'
import { PublicArticles } from '@/lib/publishing/public'
import { PublishingSettings } from '@/lib/publishing/settings'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await PublicArticles.list(await PublishingSettings.gate())
  const body = ArticleFeed.atom(
    articles.map(article => ({
      title: article.title,
      slug: article.slug,
      summary: article.meta_description || '',
      publishedAt: new Date(article.published_at || article.scheduled_publish_at || article.created_at || Date.now()),
      author: article.author
    })),
    SITE_URL
  )
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600'
    }
  })
}
