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
  const queued = articles.filter(
    article => article.pipeline === 'corpus' && !article.preview_only && article.scheduled_publish_at && article.editorial_status === 'approved'
  )
  const previews = articles.filter(article => article.preview_only)
  const taken = queued.map(article => new Date(article.scheduled_publish_at as string))
  const openFrom = now.getTime() < flags.goLiveAt.getTime() ? flags.goLiveAt : now
  const open = ArticleSchedule.openSlots(taken, openFrom, 6)

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Publishing schedule</h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            Approved articles go out at 7:00am Melbourne time on Mondays, Wednesdays and Fridays, starting Monday 11 January 2027. Nothing in this workflow is public before then.
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

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Queued</h2>
        {queued.length === 0 ? (
          <p className="mt-3 text-gray-600">No approved articles are on the public schedule yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {queued.map(article => (
              <li key={article.slug} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <Link href={`/admin/publishing/articles/${article.slug}`} className="font-medium text-primary-700 hover:underline">
                  {article.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {MelbourneTime.label(new Date(article.scheduled_publish_at as string))}
                  {article.status === 'published' ? ' · public' : ' · waiting'}
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

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Preview only</h2>
        <p className="mt-2 text-sm text-gray-600">These test articles are visible here and nowhere else. They do not take a Monday, Wednesday or Friday slot.</p>
        {previews.length === 0 ? (
          <p className="mt-3 text-gray-600">No test articles are loaded.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {previews.map(article => (
              <li key={article.slug} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                <Link href={`/admin/publishing/articles/${article.slug}`} className="font-medium text-primary-700 hover:underline">
                  {article.title}
                </Link>
                <span className="text-sm text-amber-800">Test · {article.editorial_status || article.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
