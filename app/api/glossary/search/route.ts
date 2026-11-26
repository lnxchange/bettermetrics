import { NextRequest, NextResponse } from 'next/server'
import { loadGlossarySearchCorpus } from '@/lib/glossary'
import { GlossarySearch } from '@/lib/glossary-search'

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 200)
  if (query.length < 2) return NextResponse.json({ results: [] })
  try {
    const corpus = await loadGlossarySearchCorpus()
    const hits = GlossarySearch.matches(corpus, query, { namedLimit: 5, focusLimit: 3 })
    const results = hits
      .filter(hit => hit.document.slug)
      .map(hit => ({
        slug: hit.document.slug,
        term: hit.document.term,
        letter: hit.document.letter || letterOf(hit.document.term),
        preview: GlossarySearch.preview(hit.document, query, hit.tier)
      }))
    return NextResponse.json(
      { results },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=3600' } }
    )
  } catch {
    return NextResponse.json({ results: [] })
  }
}

function letterOf(term: string) {
  return (term.match(/[A-Za-z]/)?.[0] ?? '#').toUpperCase()
}
