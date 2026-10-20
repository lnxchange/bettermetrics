import { NextResponse } from 'next/server'

/**
 * IndexNow key file (https://www.indexnow.org/documentation).
 *
 * IndexNow verifies ownership by fetching a text file containing the key.
 * Rather than committing the key to the repo as `public/<key>.txt`, it is
 * served from here using the `INDEXNOW_KEY` environment variable, and the
 * ping script submits `keyLocation: https://aimtheory.org/indexnow-key.txt`.
 * The same value must be set in Vercel (Production) and as the GitHub secret.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const key = process.env.INDEXNOW_KEY?.trim()
  if (!key) {
    return new NextResponse('IndexNow is not configured.', { status: 404 })
  }
  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400'
    }
  })
}
