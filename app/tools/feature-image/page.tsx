import type { Metadata } from 'next'

import { FeatureImageTool } from '@/components/feature-image-tool'

/**
 * Unlisted tool for preparing article photographs. It is not linked from the
 * header, not listed in the sitemap, and marked noindex. Crawlers are also
 * pointed away from /tools in lib/crawlers.ts. The photograph never leaves
 * the browser.
 */
export const metadata: Metadata = {
  title: 'Feature image',
  description:
    'Turn a photograph into an article image in the AIM colours. The picture stays in the browser.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
}

export default function FeatureImagePage() {
  return <FeatureImageTool />
}
