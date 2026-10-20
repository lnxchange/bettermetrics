import { NextRequest, NextResponse } from 'next/server'
import { extractTreatiseSection } from '@/lib/treatise-section'
import { loadTreatiseChapter } from '@/lib/treatise'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')?.trim()
  const section = req.nextUrl.searchParams.get('section')?.trim().toLowerCase()
  if (!slug || !section || slug === '2') {
    return NextResponse.json({ error: 'Missing section' }, { status: 400 })
  }

  const chapter = await loadTreatiseChapter(slug)
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }

  const slice = extractTreatiseSection(chapter.html, chapter.headings, section)
  return NextResponse.json({
    label: chapter.label,
    title: chapter.title,
    heading: slice?.heading ?? null,
    html: slice?.html ?? null,
    missing: slice ? null : section,
    href: `${chapter.href}#${section}`
  })
}
