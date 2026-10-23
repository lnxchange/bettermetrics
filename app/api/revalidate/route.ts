import { timingSafeEqual } from 'crypto'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Drops the treatise page cache after the publish Action writes new chapters.
// The Action sends Authorization: Bearer <REVALIDATE_SECRET>.
function authorized(header: string | null, secret: string) {
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
  const given = Buffer.from(token)
  const expected = Buffer.from(secret)
  if (given.length !== expected.length) return false
  return timingSafeEqual(given, expected)
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || !authorized(req.headers.get('authorization'), secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidateTag('treatise')
  return NextResponse.json({ revalidated: true, tag: 'treatise' })
}
