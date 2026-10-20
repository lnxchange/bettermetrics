import { NextRequest, NextResponse } from 'next/server'
import { adjacentSections, extractTreatiseSection } from '@/lib/treatise-section'
import { loadTreatiseChapter } from '@/lib/treatise'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')?.trim()
  const section = req.nextUrl.searchParams.get('section')?.trim().toLowerCase() || ''
  if (!slug || slug === '2') {
    return NextResponse.json({ error: 'Missing section' }, { status: 400 })
  }

  const chapter = await loadTreatiseChapter(slug)
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }

  const resolved = section || chapter.headings[0]?.id || ''
  const slice = resolved ? extractTreatiseSection(chapter.html, chapter.headings, resolved) : null
  const neighbors = slice ? adjacentSections(chapter.headings, resolved) : { previous: null, next: null }
  return NextResponse.json({
    label: chapter.label,
    title: chapter.title,
    heading: slice?.heading ?? null,
    html: slice?.html ?? null,
    missing: slice ? null : section || null,
    href: resolved ? `${chapter.href}#${resolved}` : chapter.href,
    section: slice ? resolved : null,
    previous: neighbors.previous,
    next: neighbors.next
  })
}
