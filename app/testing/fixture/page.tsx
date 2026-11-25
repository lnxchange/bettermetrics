import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TestingDocument } from '@/components/testing-page'
import { testingMetadata } from '@/lib/testing-metadata'
import { emptyCorpusIndex } from '@/lib/treatise-citations'
import { loadCorpusIndex } from '@/lib/treatise'
import { TestingStatus } from '@/lib/testing-status'
import fixture from '@/test/sample-testing-status.json'

/**
 * Test-only render of test/sample-testing-status.json.
 *
 * The live file is uploaded by the treatise publish workflow, which has not
 * run for this page yet. Preview and local builds open /testing/fixture to
 * read the layout against the fixture. Production (VERCEL_ENV=production)
 * returns 404. The route is not linked and is not in the sitemap.
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  if (process.env.VERCEL_ENV === 'production')
    return { robots: { index: false, follow: false } }
  const status = TestingStatus.parse(fixture)
  return {
    ...testingMetadata(status),
    robots: { index: false, follow: false },
    alternates: { canonical: '/testing' }
  }
}

export default async function TestingFixturePage() {
  if (process.env.VERCEL_ENV === 'production') notFound()
  const status = TestingStatus.parse(fixture)
  let index = emptyCorpusIndex()
  if (status) {
    try {
      index = await loadCorpusIndex()
    } catch (error) {
      console.warn(
        `[testing] Treatise index unavailable for the fixture: ${
          error instanceof Error ? error.message : 'unknown error'
        }`
      )
    }
  }
  return <TestingDocument status={status} index={index} />
}
