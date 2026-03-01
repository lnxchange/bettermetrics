import { Metadata } from 'next'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

export const metadata: Metadata = {
  title: 'Articles | AIM Framework',
  description: 'Insights and analysis applying the AIM Motivation Framework to economics, psychology, law, organisations, and more.',
}

async function getPublishedArticles() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore
  })

  const { data } = await supabase
    .from('articles')
    .select('slug, title, meta_description, author, published_at, category, tags, featured_image_url')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return data || []
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
                    {article.published_at && (
                      <time dateTime={article.published_at}>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
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
