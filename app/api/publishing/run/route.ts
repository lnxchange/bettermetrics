import { NextRequest } from 'next/server'
import { PublishingRun } from '@/lib/publishing/run'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Vercel cron invokes this path with GET. POST is the same run. */
export function GET(req: NextRequest) {
  return PublishingRun.handle(req)
}

export function POST(req: NextRequest) {
  return PublishingRun.handle(req)
}
