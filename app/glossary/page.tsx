import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { GlossaryBrowser, GlossaryEntryView } from '@/components/glossary-browser'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Glossary',
  description:
    'Every defined term in Chapter 2 of the AIM Treatise, refreshed when that chapter changes.'
}

async function loadGlossary(): Promise<GlossaryEntryView[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data, error } = await supabase
    .from('glossary_entries')
    .select(
      'slug, term, letter, definition, explanation, derivation, epistemic_status, cross_references, notes'
    )
    .order('position', { ascending: true })
    .limit(1000)

  if (error) {
    throw new Error(`Glossary query failed: ${error.message}`)
  }
  return data ?? []
}

function GlossaryJsonLd({ entries }: { entries: GlossaryEntryView[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': 'https://aimtheory.org/glossary#termset',
        name: 'AIM Framework Glossary',
        description:
          'Definitions for the AIM Motivation Framework, taken from Chapter 2 of the AIM Treatise.',
        url: 'https://aimtheory.org/glossary',
        inLanguage: 'en',
        hasDefinedTerm: entries.map(entry => ({
          '@type': 'DefinedTerm',
          name: entry.term,
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            '@id': 'https://aimtheory.org/glossary#termset',
            name: 'AIM Framework Glossary'
          }
        }))
      },
      {
        '@type': 'WebPage',
        '@id': 'https://aimtheory.org/glossary',
        name: 'AIM Framework Glossary',
        description: `${entries.length} terms from Chapter 2 of the AIM Treatise.`,
        mainEntity: {
          '@id': 'https://aimtheory.org/glossary#termset'
        }
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
  const entries = await loadGlossary()
  return (
    <>
      <GlossaryJsonLd entries={entries} />
      <GlossaryBrowser entries={entries} />
    </>
  )
}
