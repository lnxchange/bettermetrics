import { readFileSync } from 'fs'
import path from 'path'
import { ArticleHtml } from '../lib/publishing/article-html'
import { PublishingConfig } from '../lib/publishing/config'
import { WeeklyDigest } from '../lib/publishing/digest'
import { ArticleFeed } from '../lib/publishing/feed'
import { ArticleFrontmatter } from '../lib/publishing/frontmatter'
import { ArticleGate } from '../lib/publishing/gate'
import { LegacyArticlePath } from '../lib/publishing/legacy-path'
import { ArticleLoader } from '../lib/publishing/loader'
import { ArticleReview } from '../lib/publishing/review'
import { MelbourneTime } from '../lib/publishing/melbourne-time'
import { ArticlePublisher } from '../lib/publishing/publisher'
import { ArticleSchedule } from '../lib/publishing/schedule'
import { ArticleSyndication, XOAuth } from '../lib/publishing/syndication'
import { TreatiseRefLink } from '../lib/publishing/refs'
import { GateArticle, GateConfig } from '../lib/publishing/types'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const goLive = new Date('2027-01-11T00:00:00+11:00')
const monday = MelbourneTime.fromLocal(2027, 1, 11, 7, 0)
const wednesday = MelbourneTime.fromLocal(2027, 1, 13, 7, 0)
const friday = MelbourneTime.fromLocal(2027, 1, 15, 7, 0)

assert(monday.toISOString() === '2027-01-10T20:00:00.000Z', 'Monday 11 January 2027 7:00am Melbourne is the evening before in UTC')
assert(MelbourneTime.isSlot(monday), 'Monday 7:00am is a slot')
assert(MelbourneTime.isSlot(wednesday), 'Wednesday 7:00am is a slot')
assert(!MelbourneTime.isSlot(MelbourneTime.fromLocal(2027, 1, 12, 7, 0)), 'Tuesday is not a slot')
assert(MelbourneTime.nextSlotOnOrAfter(goLive).toISOString() === monday.toISOString(), 'go-live midnight opens onto Monday morning')
assert(
  MelbourneTime.nextSlotOnOrAfter(new Date(monday.getTime() + 60 * 1000)).toISOString() === wednesday.toISOString(),
  'a minute after Monday morning the next slot is Wednesday'
)
assert(
  MelbourneTime.slotForCalendarDate(MelbourneTime.fromLocal(2027, 1, 12, 15, 0)).toISOString() === wednesday.toISOString(),
  'a Tuesday date snaps forward to Wednesday morning'
)

const afterDst = MelbourneTime.fromLocal(2027, 4, 5, 7, 0)
assert(afterDst.toISOString() === '2027-04-04T21:00:00.000Z', 'the first Monday after the April clock change is UTC+10')
assert(MelbourneTime.fromLocal(2027, 10, 4, 7, 0).toISOString() === '2027-10-03T20:00:00.000Z', 'the first Monday of daylight saving is UTC+11')

function gate(now: Date, extra: Partial<GateConfig> = {}): GateConfig {
  return {
    now,
    goLiveAt: goLive,
    publishingPaused: false,
    legacyRetirement: false,
    ...extra
  }
}

const corpus = (extra: Partial<GateArticle> = {}): GateArticle => ({
  pipeline: 'corpus',
  status: 'scheduled',
  editorialStatus: 'approved',
  scheduledPublishAt: monday,
  previewOnly: false,
  ...extra
})

const before = new Date('2026-12-01T00:00:00+11:00')
assert(!ArticleGate.isPublic(corpus(), gate(before)), 'an approved article stays private before 11 January 2027')
assert(!ArticleGate.isPublic(corpus({ status: 'published' }), gate(before)), 'a published flag cannot bypass go-live')
assert(ArticleGate.isPublic(corpus({ status: 'published' }), gate(monday)), 'the same article is public at Monday 7:00am after go-live')
assert(
  !ArticleGate.isPublic(corpus({ status: 'published' }), gate(monday, { publishingPaused: true })),
  'the kill switch holds a due article back'
)
assert(!ArticleGate.isPublic(corpus({ previewOnly: true, status: 'published' }), gate(monday)), 'a preview article is never public')
assert(!ArticleGate.isPublic(corpus({ editorialStatus: 'draft' }), gate(monday)), 'a draft is not public')
assert(!ArticleGate.isPublic(corpus({ editorialStatus: 'retired' }), gate(monday)), 'a retired article is not public')
assert(
  !ArticleGate.isPublic(corpus({ scheduledPublishAt: wednesday }), gate(monday)),
  'a later slot stays private until it arrives'
)

const legacy: GateArticle = {
  pipeline: 'legacy',
  status: 'published',
  editorialStatus: null,
  scheduledPublishAt: null,
  previewOnly: false
}
assert(ArticleGate.isPublic(legacy, gate(before)), 'the March 2026 articles stay public before go-live')
assert(ArticleGate.isPublic(legacy, gate(monday)), 'they stay public after go-live while retirement is off')
assert(
  ArticleGate.isPublic(legacy, gate(before, { legacyRetirement: true })),
  'retirement does nothing before 11 January 2027'
)
assert(
  !ArticleGate.isPublic(legacy, gate(monday, { legacyRetirement: true })),
  'retirement hides them once go-live has arrived'
)
assert(ArticleGate.retirementTarget(null) === '/articles', 'with no replacement the redirect is the article index')
assert(ArticleGate.retirementTarget('a-new-piece') === '/articles/a-new-piece', 'a replacement slug is a 301 target')
assert(ArticleGate.blocksManualPublish(corpus(), gate(before)), 'the admin button cannot publish corpus work early')
assert(!ArticleGate.blocksManualPublish(legacy, gate(before)), 'legacy drafts can still be published by hand')

const assigned = ArticleSchedule.assign(
  [
    { slug: 'beta', editorialStatus: 'approved', explicitPublishAt: null, existingSlot: null, previewOnly: false },
    { slug: 'alpha', editorialStatus: 'approved', explicitPublishAt: null, existingSlot: null, previewOnly: false },
    { slug: 'gamma', editorialStatus: 'approved', explicitPublishAt: null, existingSlot: null, previewOnly: false },
    { slug: 'notes', editorialStatus: 'draft', explicitPublishAt: null, existingSlot: null, previewOnly: false },
    { slug: 'preview-test-appetites', editorialStatus: 'draft', explicitPublishAt: null, existingSlot: null, previewOnly: true }
  ],
  before,
  goLive
)
const slotOf = (slug: string) => assigned.find(item => item.slug === slug)?.slot?.toISOString()
assert(slotOf('alpha') === monday.toISOString(), 'the first new article, by slug, takes Monday')
assert(slotOf('beta') === wednesday.toISOString(), 'the second takes Wednesday')
assert(slotOf('gamma') === friday.toISOString(), 'the third takes Friday')
assert(
  slotOf('notes') === MelbourneTime.nextSlotAfter(friday).toISOString(),
  'a draft takes the next free slot after the approved ones'
)
assert(assigned.find(item => item.slug === 'notes')?.reason === 'draft', 'the draft slot is tentative')
assert(assigned.find(item => item.slug === 'preview-test-appetites')?.slot === null, 'a preview draft takes no slot')
const draftGate = corpus({ editorialStatus: 'draft', status: 'draft', scheduledPublishAt: assigned.find(item => item.slug === 'notes')?.slot ?? null })
assert(!ArticleGate.isPublic(draftGate, gate(before)), 'a draft with a slot stays private before go-live')
assert(
  !ArticleGate.isPublic(draftGate, gate(new Date('2027-06-01T00:00:00+10:00'))),
  'a draft with a past slot stays private after go-live'
)
const moved = ArticleSchedule.assign(
  [
    {
      slug: 'notes',
      editorialStatus: 'draft',
      explicitPublishAt: friday,
      existingSlot: monday,
      previewOnly: false
    }
  ],
  before,
  goLive
)
assert(moved[0]?.slot?.toISOString() === monday.toISOString(), 'a stored draft slot beats a later file date')
assert(ArticleReview.snap(new Date('2026-06-01T00:00:00+10:00'), goLive).toISOString() === monday.toISOString(), 'a draft date before go-live snaps to the first slot')
assert(ArticleReview.approve('draft').editorial_status === 'approved', 'approve sets the editorial status')
assert(ArticleReview.approve('draft').status === 'scheduled', 'approve does not mark the row published')
assert(ArticleReview.unapprove().status === 'draft' && ArticleReview.unapprove().editorial_status === 'draft', 'un-approve returns the row to draft')
assert(ArticleReview.collision([{ slug: 'other', at: monday.toISOString() }], 'notes', monday), 'a taken slot is rejected')
assert(!ArticleReview.collision([{ slug: 'notes', at: monday.toISOString() }], 'notes', monday), 'an article can keep its own slot')

const bumped = ArticleSchedule.assign(
  [
    {
      slug: 'tuesday-file',
      editorialStatus: 'approved',
      explicitPublishAt: MelbourneTime.fromLocal(2027, 1, 12, 18, 0),
      existingSlot: null,
      previewOnly: false
    },
    {
      slug: 'also-wednesday',
      editorialStatus: 'approved',
      explicitPublishAt: wednesday,
      existingSlot: null,
      previewOnly: false
    }
  ],
  before,
  goLive
)
assert(slotOfFrom(bumped, 'also-wednesday') === wednesday.toISOString(), 'the earlier slug keeps the Wednesday slot')
assert(slotOfFrom(bumped, 'tuesday-file') === friday.toISOString(), 'Tuesday snaps toward Wednesday, then moves on when that slot is taken')

function slotOfFrom(rows: { slug: string; slot: Date | null }[], slug: string) {
  return rows.find(item => item.slug === slug)?.slot?.toISOString()
}

const kept = ArticleSchedule.assign(
  [
    { slug: 'zebra', editorialStatus: 'approved', explicitPublishAt: null, existingSlot: monday, previewOnly: false },
    { slug: 'aardvark', editorialStatus: 'approved', explicitPublishAt: null, existingSlot: null, previewOnly: false }
  ],
  before,
  goLive
)
assert(slotOfFrom(kept, 'zebra') === monday.toISOString(), 'an article keeps the slot it was already given')
assert(slotOfFrom(kept, 'aardvark') === wednesday.toISOString(), 'a newer article does not take that slot')

const again = ArticleSchedule.assign(
  kept.map(item => ({
    slug: item.slug,
    editorialStatus: 'approved' as const,
    explicitPublishAt: null,
    existingSlot: item.slot,
    previewOnly: false
  })),
  before,
  goLive
)
assert(
  again.every(item => item.slot?.toISOString() === slotOfFrom(kept, item.slug)),
  'running the scheduler again does not move anyone'
)

const sample = `---
title: "Weights: a note"
slug: weights-a-note
summary: How the three weights sit together.
status: approved
publish_at: 2027-01-12
source_papers:
  - "260101 - Some Paper.md"
treatise_refs:
  - "4.2"
  - Chapter 7
tags: [appetites, "mimetic desire"]
feature_image: photos/harbour.jpg
image_alt: "Morning light on the harbour"
replaces:
  - old-note
---

Mimetic Desire is not an Appetite.

The weights meet in $w_A + w_I + w_M = 1$.
`
const parsed = ArticleFrontmatter.parse(sample, 'weights-a-note.md')
assert(parsed.ok, 'a contract file parses')
if (parsed.ok) {
  assert(parsed.article.summary.length <= 160, 'the summary is within 160 characters')
  assert(parsed.article.tags.length === 2, 'inline and block lists both work')
  assert(parsed.article.replaces[0] === 'old-note', 'replaces is kept')
  assert(parsed.article.featureImage === 'photos/harbour.jpg', 'a relative photo path is kept')
  assert(ArticleFrontmatter.publicImage(parsed.article.featureImage) === null, 'a repo path is not treated as a public URL')
  assert(ArticleFrontmatter.publicImage('/aim-og.png') === '/aim-og.png', 'a site path is public')
}
const tooLong = ArticleFrontmatter.parse(sample.replace('How the three weights sit together.', 'x'.repeat(161)), 'weights-a-note.md')
assert(!tooLong.ok, 'a summary over 160 characters is rejected')

const previewDir = path.join(process.cwd(), 'content/publishing/preview')
const seeds = ['preview-test-appetites.md', 'preview-test-wednesday.md'].map(name => ({
  name,
  raw: readFileSync(path.join(previewDir, name), 'utf8'),
  previewOnly: true
}))
for (const seed of seeds) {
  const result = ArticleFrontmatter.parse(seed.raw, seed.name)
  assert(result.ok, `${seed.name} parses`)
  if (!result.ok) continue
  assert(result.article.title.startsWith('TEST'), `${seed.name} is clearly marked as a test`)
  assert(result.article.summary.length <= 160, `${seed.name} summary fits`)
}

const planned = ArticleLoader.plan(
  [
    ...seeds,
    {
      name: 'first-real.md',
      raw: sample.replace('slug: weights-a-note', 'slug: first-real').replace('weights-a-note.md', 'first-real.md'),
      previewOnly: false
    }
  ],
  [],
  before,
  goLive,
  false
)
assert(planned.errors.length === 0, 'the seed files and a real file plan cleanly')
const wednesdaySeed = planned.upserts.find(row => row.slug === 'preview-test-wednesday')
assert(wednesdaySeed?.preview_only === true, 'the Wednesday test is preview only')
assert(wednesdaySeed?.status === 'draft', 'preview files are stored as drafts')
assert(wednesdaySeed?.scheduled_publish_at === null, 'the test does not occupy Wednesday')
assert(
  planned.upserts.find(row => row.slug === 'first-real')?.scheduled_publish_at === wednesday.toISOString(),
  'the real Tuesday file takes Wednesday, which the test did not reserve'
)
const second = ArticleLoader.plan(
  seeds.concat({
    name: 'first-real.md',
    raw: sample.replace('slug: weights-a-note', 'slug: first-real'),
    previewOnly: false
  }),
  planned.upserts.map(row => ({
    slug: row.slug,
    status: row.status,
    scheduledPublishAt: row.scheduled_publish_at,
    contentHash: row.content_hash,
    pipeline: 'corpus',
    previewOnly: row.preview_only,
    editorialStatus: row.editorial_status
  })),
  before,
  goLive,
  false
)
assert(second.upserts.every(row => row.changed === false), 'a second sync with the same files writes nothing')

const draftFile = `---
title: "A draft note"
slug: queue-note
summary: A draft waiting for review.
status: draft
---

The first wording.
`
const firstDraft = ArticleLoader.plan(
  [{ name: 'queue-note.md', raw: draftFile, previewOnly: false }],
  [],
  before,
  goLive,
  false
)
const draftRow = firstDraft.upserts[0]
assert(draftRow?.scheduled_publish_at === monday.toISOString(), 'a new draft takes Monday 11 January 2027')
assert(draftRow?.status === 'draft' && draftRow.editorial_status === 'draft', 'the draft is stored as a draft')
assert(
  !ArticleGate.isPublic(
    ArticleGate.fromRow({
      pipeline: 'corpus',
      status: draftRow?.status,
      editorial_status: draftRow?.editorial_status,
      scheduled_publish_at: draftRow?.scheduled_publish_at,
      preview_only: false
    }),
    gate(new Date('2027-06-01T00:00:00+10:00'))
  ),
  'loading a draft does not make it public'
)
const storedDraft = {
  slug: 'queue-note',
  status: 'draft',
  scheduledPublishAt: monday.toISOString(),
  contentHash: draftRow?.content_hash ?? null,
  pipeline: 'corpus',
  previewOnly: false,
  editorialStatus: 'draft',
  title: 'A draft note',
  summary: 'A draft waiting for review.',
  content: 'Lex rewrote this in the app.'
}
const edited = ArticleLoader.plan(
  [{ name: 'queue-note.md', raw: draftFile.replace('The first wording.', 'The file was rewritten.'), previewOnly: false }],
  [storedDraft],
  before,
  goLive,
  false
)
assert(edited.conflicts.length === 1 && edited.conflicts[0]?.reason === 'edited in the app', 'an in-app edit is reported as a conflict')
assert(edited.upserts[0]?.changed === false, 'the sync does not write over the edit')
assert(edited.upserts[0]?.content === 'Lex rewrote this in the app.', 'the in-app wording stays')
assert(edited.upserts[0]?.scheduled_publish_at === monday.toISOString(), 'the conflict keeps the slot')
assert(edited.upserts[0]?.editorial_status === 'draft', 'the conflict does not change the editorial status')
const promoted = ArticleLoader.plan(
  [{ name: 'queue-note.md', raw: draftFile.replace('status: draft', 'status: approved'), previewOnly: false }],
  [{ ...storedDraft, content: 'The first wording.' }],
  before,
  goLive,
  false
)
assert(promoted.conflicts.length === 0, 'an unedited draft can take an approval from the file')
assert(promoted.upserts[0]?.editorial_status === 'approved', 'approval is applied')
assert(promoted.upserts[0]?.scheduled_publish_at === monday.toISOString(), 'approval keeps the Monday slot')
assert(promoted.upserts[0]?.status === 'scheduled', 'approval does not publish the row')
assert(
  !ArticleGate.isPublic(
    ArticleGate.fromRow({
      pipeline: 'corpus',
      status: 'scheduled',
      editorial_status: 'approved',
      scheduled_publish_at: monday.toISOString(),
      preview_only: false
    }),
    gate(before)
  ),
  'an approved slot is still private before go-live'
)
const blocked = ArticleLoader.plan(
  [{ name: 'queue-note.md', raw: draftFile.replace('The first wording.', 'A later file.'), previewOnly: false }],
  [
    {
      ...storedDraft,
      status: 'scheduled',
      editorialStatus: 'approved',
      content: 'The first wording.',
      contentHash: promoted.upserts[0]?.content_hash ?? null
    }
  ],
  before,
  goLive,
  false
)
assert(blocked.conflicts.some(item => item.reason === 'approved in the app'), 'an approved article is not overwritten')
assert(blocked.upserts[0]?.content === 'The first wording.', 'the approved wording stays')
assert(blocked.upserts[0]?.editorial_status === 'approved', 'the approval stays')
assert(blocked.upserts[0]?.changed === false, 'the approved row is not written')

const earlyCandidate = {
  id: '1',
  slug: 'first-real',
  pipeline: 'corpus',
  status: 'scheduled',
  editorialStatus: 'approved',
  scheduledPublishAt: new Date('2026-06-01T00:00:00+10:00'),
  previewOnly: false
}
assert(ArticlePublisher.due([earlyCandidate], gate(before)).length === 0, 'the cron publishes nothing before go-live')
assert(
  ArticlePublisher.due(
    [{ ...earlyCandidate, editorialStatus: 'draft', status: 'draft', scheduledPublishAt: monday }],
    gate(new Date('2027-06-01T00:00:00+10:00'))
  ).length === 0,
  'the cron does not publish a draft, even after its slot and go-live'
)
assert(ArticlePublisher.heldReason(gate(before)) === 'before-go-live', 'the reason is the go-live gate')
assert(
  ArticlePublisher.due([{ ...earlyCandidate, scheduledPublishAt: monday, previewOnly: true }], gate(monday)).length === 0,
  'the cron skips preview articles'
)
assert(
  ArticlePublisher.due([{ ...earlyCandidate, scheduledPublishAt: monday }], gate(monday)).length === 1,
  'the cron releases a due article once go-live has passed'
)
assert(
  ArticlePublisher.due([{ ...earlyCandidate, scheduledPublishAt: monday }], gate(monday, { publishingPaused: true })).length === 0,
  'the cron respects the kill switch'
)

const flags = PublishingConfig.flags({})
assert(flags.goLiveAt.toISOString() === goLive.toISOString(), 'the default go-live is 11 January 2027 Melbourne')
assert(flags.publishingPaused === false, 'publishing is not paused by default')
assert(flags.legacyRetirement === false, 'retirement is off by default')
assert(flags.syndicationEnabled === false, 'syndication is off by default')
assert(PublishingConfig.flags({ ARTICLE_PUBLISHING_PAUSED: 'true' }).publishingPaused, 'the env kill switch turns on')
assert(!PublishingConfig.flags({ ARTICLE_PUBLISHING_PAUSED: 'false' }, { publishing_paused: true }).publishingPaused, 'an explicit false overrides the stored flag')

const header = XOAuth.header(
  'POST',
  'https://api.twitter.com/2/tweets',
  { consumerKey: 'ck', consumerSecret: 'cs-secret', token: 'tk', tokenSecret: 'ts-secret' },
  'nonce', '1700000000'
)
assert(header.startsWith('OAuth '), 'the X header is OAuth')
assert(!header.includes('cs-secret') && !header.includes('ts-secret'), 'secrets stay out of the header')
assert(
  ArticleSyndication.decide({
    now: before,
    goLiveAt: goLive,
    syndicationEnabled: true,
    previewOnly: false,
    hasCredentials: true
  }).reason === 'before-go-live',
  'X is not considered before go-live'
)
assert(
  ArticleSyndication.decide({
    now: monday,
    goLiveAt: goLive,
    syndicationEnabled: false,
    previewOnly: false,
    hasCredentials: true
  }).reason === 'disabled',
  'X stays off unless syndication is enabled'
)
assert(ArticleSyndication.credentials({}) === null, 'missing X credentials are absent')

const digest = WeeklyDigest.build(
  [
    { title: 'Monday piece', slug: 'monday-piece', summary: 'The Monday note.', publishedAt: monday },
    { title: 'Later', slug: 'later', summary: 'Not this week.', publishedAt: MelbourneTime.fromLocal(2027, 1, 20, 7, 0) }
  ],
  monday,
  'https://aimtheory.org'
)
assert(digest.count === 1, 'the digest contains only this week')
assert(digest.markdown.includes('Monday piece'), 'the week article is in the Markdown')
assert(!digest.markdown.includes('Not this week'), 'next week is left out')
assert(digest.html.includes('<h1>'), 'the digest also has HTML')
const emptyDigest = WeeklyDigest.build([], before, 'https://aimtheory.org')
assert(emptyDigest.count === 0 && emptyDigest.markdown.includes('No articles were published'), 'an empty week says so')

const feed = ArticleFeed.rss(
  [{ title: 'A & B', slug: 'a-b', summary: 'Safe <summary>', publishedAt: monday, author: 'Yule Guttenbeil' }],
  'https://aimtheory.org'
)
assert(feed.includes('A &amp; B') && feed.includes('Safe &lt;summary&gt;'), 'the feed escapes text')
assert(!feed.includes('preview-test'), 'the feed builder only prints what it is given')
const atom = ArticleFeed.atom(
  [{ title: 'Monday piece', slug: 'monday-piece', summary: 'The Monday note.', publishedAt: monday, author: null }],
  'https://aimtheory.org'
)
assert(atom.includes('<feed') && atom.includes('/articles/monday-piece'), 'Atom carries the canonical link')

assert(TreatiseRefLink.href('4.2') === '/treatise/chapter-4#4.2', 'a section ref links into the chapter')
assert(TreatiseRefLink.href('Chapter 7') === '/treatise/chapter-7', 'a chapter ref links to the chapter')
assert(TreatiseRefLink.href('Chapter 2') === '/glossary', 'chapter 2 is the glossary')

const html = ArticleHtml.render('Mimetic Desire weighs $w_M$.', {
  corpus: true,
  siteUrl: 'https://aimtheory.org',
  terms: [{ term: 'Mimetic Desire', slug: 'mimetic-desire-m' }]
})
assert(
  LegacyArticlePath.normalise('/articles/Report-14-The-Easterlin-Paradox.md') ===
    '/articles/report-14-the-easterlin-paradox',
  'an old filename becomes a slug'
)
assert(LegacyArticlePath.normalise('/articles/feed.xml') === null, 'the RSS feed is not rewritten')
assert(LegacyArticlePath.normalise('/articles/atom.xml') === null, 'the atom feed is not rewritten')
assert(LegacyArticlePath.normalise('/articles/weights/og') === null, 'the card image route is not rewritten')

assert(html.includes('data-glossary="mimetic-desire-m"'), 'defined terms link to the glossary')
assert(html.includes('<math'), 'KaTeX mathematics is rendered')

const testEnv = {
  NODE_ENV: 'test',
  ARTICLE_SYNDICATION_ENABLED: 'true',
  X_API_KEY: 'ck',
  X_API_SECRET: 'cs',
  X_ACCESS_TOKEN: 'tk',
  X_ACCESS_TOKEN_SECRET: 'ts'
}
let fetched = false
void ArticleSyndication.deliver(
  testEnv,
  { slug: 'first-real', title: 'Weights', summary: 'A note', previewOnly: false },
  { now: monday, goLiveAt: goLive, syndicationEnabled: true },
  'https://aimtheory.org',
  (async () => {
    fetched = true
    throw new Error('network')
  }) as typeof fetch
)
  .then(result => {
    assert(result.posted === false && result.reason === 'test', 'a test run does not post')
    assert(!fetched, 'a test run does not call fetch')
    console.log('publishing tests passed')
  })
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
