import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { PublishingConfig } from '@/lib/publishing/config'
import { ArticleSchedule } from '@/lib/publishing/schedule'
import { ArticleRecord } from '@/lib/publishing/public'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Publishing schedule',
  robots: { index: false, follow: false }
}

function flag(on: boolean) {
  return on ? 'On' : 'Off'
}

export default async function PublishingSchedulePage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const [{ data: rows }, { data: settings }] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, title, status, pipeline, editorial_status, scheduled_publish_at, preview_only, published_at')
      .order('scheduled_publish_at', { ascending: true }),
    supabase.from('publishing_settings').select('*').eq('id', 1).maybeSingle()
  ])
  const articles = (rows ?? []) as Pick<
    ArticleRecord,
    'slug' | 'title' | 'status' | 'pipeline' | 'editorial_status' | 'scheduled_publish_at' | 'preview_only' | 'published_at'
  >[]
  const flags = PublishingConfig.flags(process.env, settings)
  const now = new Date()
  const legacy = articles.filter(article => article.pipeline !== 'corpus' && article.status === 'published')
  const queue = articles
    .filter(article => {
      const reviewable = article.editorial_status === 'draft' || article.editorial_status === 'approved'
      if (!reviewable) return false
      if (article.preview_only) return true
      return article.pipeline === 'corpus'
    })
    .sort((a, b) => {
      const left = a.scheduled_publish_at ? new Date(a.scheduled_publish_at).getTime() : Number.POSITIVE_INFINITY
      const right = b.scheduled_publish_at ? new Date(b.scheduled_publish_at).getTime() : Number.POSITIVE_INFINITY
      if (left !== right) return left - right
      return a.slug.localeCompare(b.slug)
    })
  const taken = queue
    .filter(article => !article.preview_only && article.scheduled_publish_at)
    .map(article => new Date(article.scheduled_publish_at as string))
  const openFrom = now.getTime() < flags.goLiveAt.getTime() ? flags.goLiveAt : now
  const open = ArticleSchedule.openSlots(taken, openFrom, 6)

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Publishing schedule</h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            Drafts and approved articles sit on Monday, Wednesday and Friday at 7:00am Melbourne time, starting Monday 11 January 2027. A draft slot is tentative. Nothing is public until it is approved, the slot has passed, and the clock is on or after go-live.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">Go-live</dt>
            <dd className="mt-1 font-medium text-gray-900">{MelbourneTime.label(flags.goLiveAt)}</dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">Kill switch</dt>
            <dd className="mt-1 font-medium text-gray-900">{flag(flags.publishingPaused)}</dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">Retire the March 2026 articles</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {flag(flags.legacyRetirement)}
              {flags.legacyRetirement && now < flags.goLiveAt ? ' (waits for go-live)' : ''}
            </dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">X and other syndication</dt>
            <dd className="mt-1 font-medium text-gray-900">{flag(flags.syndicationEnabled)}</dd>
          </div>
        </dl>

        <p className="mt-6 text-sm text-gray-600">
          {legacy.length} articles published on 1 March 2026 stay on the site until the retirement switch is on, and that switch does nothing before go-live. Rows are kept either way. The{' '}
          <Link href="/admin/publishing/digest" className="text-primary-700 hover:underline">
            weekly digest
          </Link>{' '}
          is for pasting into Substack. It does not send anything.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Queue</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ordered by slot. Preview rows are tests: they stay in this list so they can be edited, and they do not reserve a slot.
        </p>
        {queue.length === 0 ? (
          <p className="mt-3 text-gray-600">No drafts or approved articles are queued yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {queue.map(article => (
              <li key={article.slug} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <Link href={`/admin/publishing/articles/${article.slug}`} className="font-medium text-primary-700 hover:underline">
                  {article.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {article.preview_only || !article.scheduled_publish_at
                    ? 'Not reserved'
                    : MelbourneTime.label(new Date(article.scheduled_publish_at))}
                  {' · '}
                  {article.preview_only ? `Preview · ${article.editorial_status || 'draft'}` : article.editorial_status === 'approved' ? 'Approved' : 'Draft'}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Next open slots</h2>
        <ul className="mt-4 space-y-2 text-gray-700">
          {open.map(slot => (
            <li key={slot.toISOString()}>{MelbourneTime.label(slot)}</li>
          ))}
        </ul>

      </section>
    </div>
  )
}
