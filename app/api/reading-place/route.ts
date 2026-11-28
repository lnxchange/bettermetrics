import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { ReadingPlaces } from '@/lib/reading-place'
import { ReadingPlaceStore } from '@/lib/reading-place-store'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const places = ReadingPlaces.parseBody(await req.json().catch(() => null))
  if (!places)
    return NextResponse.json(
      { error: 'That place could not be saved.' },
      { status: 400 }
    )
  const saved = await ReadingPlaceStore.save(session.user.id, places)
  if (!saved)
    return NextResponse.json(
      { error: 'That place could not be saved.' },
      { status: 503 }
    )
  return NextResponse.json({ ok: true })
}
