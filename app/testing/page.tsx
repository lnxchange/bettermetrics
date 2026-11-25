import type { Metadata } from 'next'
import { TestingDocument } from '@/components/testing-page'
import { testingMetadata } from '@/lib/testing-metadata'
import { emptyCorpusIndex } from '@/lib/treatise-citations'
import { loadCorpusIndex } from '@/lib/treatise'
import { TestingStatus } from '@/lib/testing-status'

export async function generateMetadata(): Promise<Metadata> {
  const status = await TestingStatus.load()
  return testingMetadata(status)
}

export default async function TestingPage() {
  const status = await TestingStatus.load()
  const index = status ? await corpusIndex() : emptyCorpusIndex()
  return <TestingDocument status={status} index={index} />
}

async function corpusIndex() {
  try {
    return await loadCorpusIndex()
  } catch (error) {
    console.warn(
      `[testing] Treatise index unavailable, basis left as text: ${
        error instanceof Error ? error.message : 'unknown error'
      }`
    )
    return emptyCorpusIndex()
  }
}
