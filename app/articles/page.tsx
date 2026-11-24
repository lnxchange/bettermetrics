import { Metadata } from 'next'
import Link from 'next/link'
import { PublicArticles } from '@/lib/publishing/public'
import { PublishingSettings } from '@/lib/publishing/settings'
import { SITE_OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: 'Articles Applying the AIM Framework' },
  description: 'Insights and analysis applying the AIM Framework to economics, psychology, law, organisations, and more.',
  alternates: {
    canonical: '/articles',
    types: {
      'application/rss+xml': '/articles/feed.xml',
      'application/atom+xml': '/articles/atom.xml'
    }
  },
  openGraph: {
    title: 'Articles Applying the AIM Framework',
    description: 'Applying the AIM Framework to economics, psychology, law, organisations, and everyday life.',
    url: '/articles',
    images: [SITE_OG_IMAGE],
    type: 'website'
  }
}

async function getPublishedArticles() {
  return PublicArticles.list(await PublishingSettings.gate())
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Melbourne'
  })
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Articles</h1>
          <p className="text-xl text-gray-600">
            Applying the AIM Framework to economics, psychology, law, organisations, and everyday life.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            <a href="/articles/feed.xml" className="hover:underline">RSS</a>
            <span className="mx-2">·</span>
            <a href="/articles/atom.xml" className="hover:underline">Atom</a>
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No articles published yet.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => (
              <article key={article.slug} className="py-10">
                <Link href={`/articles/${article.slug}`} className="group block">
                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-3">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition mb-2">
                    {article.title}
                  </h2>
                  {article.meta_description && (
                    <p className="text-gray-600 text-base mb-4 line-clamp-3">
                      {article.meta_description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {article.author && <span>By {article.author}</span>}
                    {(article.published_at || article.scheduled_publish_at) && (
                      <time dateTime={(article.published_at || article.scheduled_publish_at) as string}>
                        {formatDate((article.published_at || article.scheduled_publish_at) as string)}
                      </time>
                    )}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {article.tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
