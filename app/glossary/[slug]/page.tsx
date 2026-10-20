import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { AskAI } from '@/components/ask-ai'
import { MathText } from '@/components/math-text'
import { TreatiseCitation } from '@/components/treatise-citation'
import { loadGlossaryContext, loadGlossaryEntry, previewOf } from '@/lib/glossary'
import { SITE_OG_IMAGE, SITE_URL, metaDescription } from '@/lib/site'

interface GlossaryTermPageProps {
  params: { slug: string }
}

function glossaryTitle(term: string) {
  const plain = `${term} | AIM Theory Glossary`
  // Short terms ("Art", "Action") get a descriptor so the title says what the page is.
  return plain.length >= 30 ? plain : `${term} (AIM Framework term) | AIM Theory Glossary`
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const entry = await loadGlossaryEntry(params.slug)
  if (!entry) return { title: 'Term not found', robots: { index: false } }
  const path = `/glossary/${entry.slug}`
  const description = metaDescription(previewOf(entry.definition, 158), 158, ' A defined term in the AIM Framework, a general theory of human motivation.')
  return {
    title: { absolute: glossaryTitle(entry.term) },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${entry.term} | AIM Theory Glossary`,
      description,
      url: path,
      type: 'article',
      images: [SITE_OG_IMAGE],
      modifiedTime: entry.updated_at
    }
  }
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const [entry, context] = await Promise.all([
    loadGlossaryEntry(params.slug),
    loadGlossaryContext(params.slug)
  ])
  if (!entry) notFound()

  const related = entry.cross_references
    .map(name => ({ name, target: context.resolve(name) }))
    .filter((item, index, list) => list.findIndex(other => other.name === item.name) === index)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        '@id': `${SITE_URL}/glossary/${entry.slug}#term`,
        name: entry.term,
        description: entry.definition,
        url: `${SITE_URL}/glossary/${entry.slug}`,
        inDefinedTermSet: { '@id': `${SITE_URL}/glossary#termset` }
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/glossary/${entry.slug}`,
        name: `${entry.term}: definition in the AIM Framework`,
        description: previewOf(entry.definition, 158),
        dateModified: entry.updated_at,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/glossary/${entry.slug}#term` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${SITE_URL}/glossary` },
            { '@type': 'ListItem', position: 3, name: entry.term, item: `${SITE_URL}/glossary/${entry.slug}` }
          ]
        }
      }
    ]
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/glossary" className="hover:text-blue-700">
                Glossary
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/glossary#letter-${entry.letter}`} className="hover:text-blue-700">
                {entry.letter}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">AIM Framework glossary</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{entry.term}</h1>
        </header>

        <section className="mb-8 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-5">
          <h2 className="mb-2 text-xs font-semibold uppercase text-blue-700">Canonical definition</h2>
          <p className="whitespace-pre-wrap text-base font-medium leading-relaxed text-gray-900">
            <MathText text={entry.definition} />
          </p>
        </section>

        {entry.explanation && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Explanation</h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
              <MathText text={entry.explanation} />
            </p>
          </section>
        )}

        {entry.epistemic_status && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Epistemic status</h2>
            <p className="text-base leading-relaxed text-gray-700">
              <MathText text={entry.epistemic_status} />
            </p>
          </section>
        )}

        {entry.derivation && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Derivation</h2>
            <p className="text-base leading-relaxed text-gray-700">
              <TreatiseCitation text={entry.derivation} />
            </p>
          </section>
        )}

        {entry.notes && (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Also in the entry</h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
              <MathText text={entry.notes} />
            </p>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Related terms</h2>
            <ul className="flex flex-wrap gap-2">
              {related.map(item => (
                <li key={item.name}>
                  {item.target ? (
                    <Link
                      href={`/glossary/${item.target.slug}`}
                      className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="inline-block rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-500">{item.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mb-10">
          <AskAI
            question={`In the AIM Framework, explain "${entry.term}" and how it connects to the rest of the architecture.`}
            label={`Ask the AI to explain "${entry.term}" in context`}
          />
        </div>

        <nav className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between" aria-label="Adjacent terms">
          {context.previous ? (
            <Link href={`/glossary/${context.previous.slug}`} className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-700">
              <HiArrowLeft className="mr-2 h-4 w-4" />
              {context.previous.term}
            </Link>
          ) : (
            <span />
          )}
          {context.next ? (
            <Link href={`/glossary/${context.next.slug}`} className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 sm:text-right">
              {context.next.term}
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  )
}
