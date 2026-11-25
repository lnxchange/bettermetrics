import type { Metadata } from 'next'
import { metaDescription, SITE_OG_IMAGE } from '@/lib/site'
import { TestingStatus, TestingStatusFile } from '@/lib/testing-status'

export function testingMetadata(status: TestingStatusFile | null): Metadata {
  const title = 'Testing the Framework | AIM Theory'
  const description = status
    ? metaDescription(status.page.summary)
    : TestingStatus.preparing
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: TestingStatus.path },
    openGraph: {
      title,
      description,
      url: TestingStatus.path,
      images: [SITE_OG_IMAGE],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_OG_IMAGE]
    }
  }
}
