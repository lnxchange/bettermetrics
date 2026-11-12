import { NextResponse } from 'next/server'
import { loadGlossaryIndex } from '@/lib/glossary'

export async function GET() {
  try {
    const index = await loadGlossaryIndex()
    const terms = index
      .map(entry => ({ term: entry.term.trim(), slug: entry.slug }))
      .filter(entry => entry.term.length >= 2 && entry.slug)
    return NextResponse.json({ terms })
  } catch {
    return NextResponse.json({ terms: [] })
  }
}
