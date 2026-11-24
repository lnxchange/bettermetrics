import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { BearerAuth } from '@/lib/publishing/bearer'
import { PublishingConfig } from '@/lib/publishing/config'
import { ArticlePublisher, PublishCandidate } from '@/lib/publishing/publisher'
import { PublishingDb } from '@/lib/publishing/public'
import { ArticleSyndication } from '@/lib/publishing/syndication'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Hourly publish run. Before 11 January 2027 Melbourne, and while the kill
 * switch is on, this records nothing as published and posts nothing.
 * Vercel cron sends Authorization: Bearer CRON_SECRET. The treatise revalidate
 * secret is also accepted so a publish workflow can call the same route.
 */
export async function POST(req: NextRequest) {
  const secrets = [process.env.CRON_SECRET, process.env.REVALIDATE_SECRET].filter(
    (value): value is string => Boolean(value)
  )
  if (!BearerAuth.matches(req.headers.get('authorization'), secrets)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = PublishingDb.service()
  if (!supabase) {
    return NextResponse.json({ error: 'Publishing storage is not configured' }, { status: 500 })
  }

  const { data: stored } = await supabase.from('publishing_settings').select('*').eq('id', 1).maybeSingle()
  const now = new Date()
  const flags = PublishingConfig.flags(process.env, stored)
  const config = { now, ...flags }

  await supabase.from('publishing_settings').upsert({
    id: 1,
    go_live_at: flags.goLiveAt.toISOString(),
    publishing_paused: flags.publishingPaused,
    legacy_retirement: flags.legacyRetirement,
    syndication_enabled: flags.syndicationEnabled,
    updated_at: now.toISOString()
  })

  const held = ArticlePublisher.heldReason(config)
  if (held) {
    revalidateTag('articles')
    return NextResponse.json({
      ok: true,
      held,
      goLiveAt: flags.goLiveAt.toISOString(),
      publishingPaused: flags.publishingPaused,
      published: [],
      syndication: []
    })
  }

  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, meta_description, pipeline, status, editorial_status, scheduled_publish_at, preview_only')
    .eq('pipeline', 'corpus')
    .eq('editorial_status', 'approved')
    .neq('status', 'published')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const candidates: PublishCandidate[] = (data ?? []).map(row => ({
    id: String(row.id),
    slug: String(row.slug),
    pipeline: row.pipeline ?? null,
    status: row.status ?? null,
    editorialStatus: row.editorial_status ?? null,
    scheduledPublishAt: row.scheduled_publish_at ? new Date(row.scheduled_publish_at) : null,
    previewOnly: row.preview_only === true
  }))
  const due = ArticlePublisher.due(candidates, config)
  const published: string[] = []
  const syndication: { slug: string; result: string }[] = []

  for (const article of due) {
    const source = (data ?? []).find(row => row.id === article.id)
    const publishedAt = article.scheduledPublishAt?.toISOString() ?? now.toISOString()
    const { data: updated, error: updateError } = await supabase
      .from('articles')
      .update({ status: 'published', published_at: publishedAt })
      .eq('id', article.id)
      .neq('status', 'published')
      .select('id')
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    if (!updated || updated.length === 0) continue
    published.push(article.slug)

    const result = await ArticleSyndication.deliver(
      process.env,
      {
        slug: article.slug,
        title: String(source?.title ?? article.slug),
        summary: String(source?.meta_description ?? ''),
        previewOnly: article.previewOnly
      },
      { now, goLiveAt: flags.goLiveAt, syndicationEnabled: flags.syndicationEnabled },
      SITE_URL,
      fetch
    )
    const status = result.posted ? 'posted' : result.reason.startsWith('x-status-') ? 'failed' : 'skipped'
    syndication.push({ slug: article.slug, result: result.reason })
    console.log(`syndication: ${article.slug} ${result.reason}`)
    await supabase
      .from('articles')
      .update({ x_post_status: status, x_post_detail: result.reason.slice(0, 200) })
      .eq('id', article.id)
  }

  revalidateTag('articles')
  return NextResponse.json({
    ok: true,
    held: null,
    goLiveAt: flags.goLiveAt.toISOString(),
    publishingPaused: flags.publishingPaused,
    legacyRetirement: flags.legacyRetirement,
    syndicationEnabled: flags.syndicationEnabled,
    published,
    syndication
  })
}
