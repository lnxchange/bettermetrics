import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { Database } from '@/lib/db_types'
import { ArticleReview } from '@/lib/publishing/review'
import { MelbourneTime } from '@/lib/publishing/melbourne-time'
import { PublishingConfig } from '@/lib/publishing/config'
import { isSiteAdmin } from '@/lib/site-keys'

export const dynamic = 'force-dynamic'

interface ReviewBody {
  action?: string
  title?: string
  summary?: string
  content?: string
  date?: string
}

/**
 * Admin edits for one queued article. The cookie session must be an admin,
 * the same check as the rest of /admin. Saving does not change
 * editorial_status or content_hash, so a later file sync can see the edit.
 * Approve and un-approve keep the slot and never set status to published.
 */
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (!isSiteAdmin(session?.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  const { data: existing, error: readError } = await supabase.from('articles').select('*').eq('slug', params.slug).maybeSingle()
  if (readError || !existing) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
  const article = existing as {
    slug: string
    pipeline: string | null
    preview_only: boolean | null
    status: string | null
    editorial_status: string | null
    scheduled_publish_at: string | null
  }
  if (article.pipeline !== 'corpus' && article.preview_only !== true) {
    return NextResponse.json({ error: 'This editor is for the publishing queue.' }, { status: 404 })
  }

  let body: ReviewBody
  try {
    body = (await req.json()) as ReviewBody
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 })
  }

  const action = body.action
  if (action !== 'save' && action !== 'approve' && action !== 'unapprove') {
    return NextResponse.json({ error: 'Choose save, approve, or unapprove.' }, { status: 400 })
  }

  const title = (body.title ?? '').trim()
  const summary = (body.summary ?? '').trim()
  const content = body.content ?? ''
  if (!title || !summary || !content.trim()) {
    return NextResponse.json({ error: 'Title, summary and body are required.' }, { status: 400 })
  }
  if (summary.length > 160) {
    return NextResponse.json({ error: 'The summary must be 160 characters or fewer.' }, { status: 400 })
  }

  const update: Record<string, string | null> = {
    title,
    meta_description: summary,
    content
  }

  if (action === 'save' && body.date && article.preview_only !== true) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(body.date)
    if (!match) return NextResponse.json({ error: 'Use a date as YYYY-MM-DD.' }, { status: 400 })
    const { data: settings } = await supabase.from('publishing_settings').select('*').eq('id', 1).maybeSingle()
    const flags = PublishingConfig.flags(process.env, settings)
    const snapped = ArticleReview.snap(
      MelbourneTime.fromLocal(Number(match[1]), Number(match[2]), Number(match[3]), 12, 0),
      flags.goLiveAt
    )
    const { data: rows } = await supabase
      .from('articles')
      .select('slug, scheduled_publish_at, pipeline, preview_only')
      .eq('pipeline', 'corpus')
    const occupied = ((rows ?? []) as { slug: string; scheduled_publish_at: string | null; preview_only: boolean | null }[])
      .filter(row => row.preview_only !== true)
      .map(row => ({ slug: row.slug, at: row.scheduled_publish_at }))
    if (ArticleReview.collision(occupied, article.slug, snapped)) {
      return NextResponse.json(
        { error: `${MelbourneTime.label(snapped)} is already taken. Pick another Monday, Wednesday or Friday.` },
        { status: 409 }
      )
    }
    update.scheduled_publish_at = snapped.toISOString()
  }

  if (action === 'approve') {
    if (article.preview_only === true) {
      update.editorial_status = 'approved'
      update.status = 'draft'
    } else {
      const next = ArticleReview.approve(article.status)
      update.editorial_status = next.editorial_status
      update.status = article.scheduled_publish_at || update.scheduled_publish_at ? next.status : 'draft'
    }
  } else if (action === 'unapprove') {
    const next = ArticleReview.unapprove()
    update.editorial_status = next.editorial_status
    update.status = next.status
  }

  const { data: saved, error: writeError } = await supabase
    .from('articles')
    .update(update)
    .eq('slug', article.slug)
    .select('slug, title, meta_description, editorial_status, status, scheduled_publish_at')
    .maybeSingle()
  if (writeError || !saved) {
    return NextResponse.json({ error: 'The change was not saved.' }, { status: 403 })
  }
  const row = saved as {
    editorial_status: string | null
    status: string | null
    scheduled_publish_at: string | null
  }
  const date = row.scheduled_publish_at ? MelbourneTime.calendarDate(new Date(row.scheduled_publish_at)) : ''
  const message =
    action === 'approve'
      ? 'Approved. It still publishes only after 11 January 2027, through the hourly job.'
      : action === 'unapprove'
        ? 'Back to draft. The slot is unchanged.'
        : 'Saved as a draft.'
  return NextResponse.json({
    editorial_status: row.editorial_status,
    status: row.status,
    date,
    message
  })
}
