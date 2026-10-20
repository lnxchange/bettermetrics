import { Metadata } from 'next'
import { GlossaryIndex } from '@/components/glossary-index'
import { loadGlossaryIndex } from '@/lib/glossary'
import { SITE_OG_IMAGE, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Glossary of the AIM Framework',
  description:
    'Every defined term in Chapter 2 of the AIM Treatise, refreshed when that chapter changes.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'Glossary | AIM Theory',
    description: 'Every defined term in Chapter 2 of the AIM Treatise.',
    url: '/glossary',
    images: [SITE_OG_IMAGE],
    type: 'article'
  }
}

function GlossaryJsonLd({ count }: { count: number }) {
  // Individual terms are described on their own pages (/glossary/[slug]) as
  // DefinedTerm nodes pointing back at this set.
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': `${SITE_URL}/glossary#termset`,
        name: 'AIM Framework Glossary',
        description:
          'Definitions for the AIM Motivation Framework, taken from Chapter 2 of the AIM Treatise.',
        url: `${SITE_URL}/glossary`,
        inLanguage: 'en'
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/glossary`,
        name: 'AIM Framework Glossary',
        description: `${count} terms from Chapter 2 of the AIM Treatise.`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/glossary#termset` }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default async function GlossaryPage() {
  const entries = await loadGlossaryIndex()
  return (
    <>
      <GlossaryJsonLd count={entries.length} />
      <GlossaryIndex entries={entries} />
    </>
  )
}
