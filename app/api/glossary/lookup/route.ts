import { NextRequest, NextResponse } from 'next/server'
import { loadGlossaryEntry } from '@/lib/glossary'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')?.trim() || ''
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Missing term' }, { status: 400 })
  }
  try {
    const entry = await loadGlossaryEntry(slug)
    if (!entry) return NextResponse.json({ error: 'Missing term' }, { status: 404 })
    return NextResponse.json({
      slug: entry.slug,
      term: entry.term,
      definition: entry.definition,
      explanation: entry.explanation
    })
  } catch {
    return NextResponse.json({ error: 'Missing term' }, { status: 404 })
  }
}
