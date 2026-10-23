import { NextResponse } from 'next/server'
import { loadTreatiseTargets } from '@/lib/treatise'

export const runtime = 'nodejs'

// The section index and the record of where old section numbers moved.
// Chat reads this when it opens a saved conversation.
export async function GET() {
  try {
    const targets = await loadTreatiseTargets()
    return NextResponse.json(targets)
  } catch (error) {
    console.error('Treatise targets failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Treatise targets failed' },
      { status: 500 }
    )
  }
}
