import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { axioms, STATUS_DESCRIPTIONS, type Axiom, type EpistemicStatus } from '@/lib/axioms-data'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { SITE_OG_IMAGE } from '@/lib/site'

function AxiomsJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ScholarlyArticle',
        '@id': 'https://aimtheory.org/axioms#article',
        headline: 'The Nine Axioms of the AIM Framework',
        description:
          'The nine axioms on which the AIM Framework rests, as stated in the AIM Treatise, Chapter 4, with their epistemic status and foundational citations.',
        author: {
          '@type': 'Person',
          '@id': 'https://aimtheory.org/#YuleGuttenbeil',
          name: 'Yule Guttenbeil'
        },
        publisher: { '@id': 'https://aimtheory.org/#organization' },
        mainEntityOfPage: 'https://aimtheory.org/axioms',
        about: {
          '@type': 'CreativeWork',
          '@id': 'https://aimtheory.org/#AIMFramework',
          name: 'AIM Motivation Framework'
        }
      },
      {
        '@type': 'ItemList',
        '@id': 'https://aimtheory.org/axioms#axiom-list',
        name: 'The Nine Axioms of the AIM Framework',
        numberOfItems: axioms.length,
        itemListElement: axioms.map(a => ({
          '@type': 'ListItem',
          position: a.number,
          name: a.title,
          description: a.statement
        }))
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

export const metadata: Metadata = {
  title: 'The Nine Axioms of Human Motivation',
  description:
    'The nine axioms of the AIM Framework: the premises from which the theory is derived, each with its epistemic status and foundational citations.',
  alternates: { canonical: '/axioms' },
  openGraph: {
    title: 'The Nine Axioms of Human Motivation | AIM Theory',
    description:
      'The premises from which the AIM Framework is derived, with epistemic status and citations.',
    url: '/axioms',
    images: [SITE_OG_IMAGE],
    type: 'article'
  }
}

const statusStyles: Record<EpistemicStatus, string> = {
  Inherited: 'bg-gray-100 text-gray-800 border-gray-200',
  'Mathematically entailed': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Novel synthesis': 'bg-amber-50 text-amber-900 border-amber-200'
}

function StatusBadge({ status }: { status: EpistemicStatus }) {
  return (
    <span
      title={STATUS_DESCRIPTIONS[status]}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

function AxiomCard({ axiom }: { axiom: Axiom }) {
  return (
    <article
      id={axiom.slug}
      className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
          {axiom.number}
        </span>
        <h2 className="text-xl font-bold text-gray-900">{axiom.title}</h2>
        <StatusBadge status={axiom.status} />
      </div>

      <p className="text-base leading-relaxed text-gray-800">{axiom.plain}</p>

      {axiom.statusNote && (
        <p className="mt-3 text-sm text-gray-600">{axiom.statusNote}</p>
      )}

      <details className="group mt-4">
        <summary className="cursor-pointer select-none text-sm font-medium text-blue-700 hover:underline">
          Canonical statement and citations
        </summary>
        <div className="mt-3 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
          <p className="text-sm text-gray-900">{axiom.statement}</p>
          <p className="mt-2 text-xs text-gray-500">AIM Treatise, Chapter 4, Section 4.3.{axiom.number}</p>
        </div>
        <ul className="mt-3 space-y-1">
          {axiom.citations.map((c, i) => (
            <li key={i} className="text-xs text-gray-600">
              {c.text}. <span className="italic">{c.source}</span> ({c.year})
            </li>
          ))}
        </ul>
      </details>

      <AskAIGroup questions={axiom.ask} heading={null} className="mt-4" />
    </article>
  )
}

export default function AxiomsPage() {
  return (
    <div className="bg-white">
      <AxiomsJsonLd />

      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The Nine Axioms
          </h1>
          <p className="text-lg text-gray-700">
            Everything in AIM is derived from these nine premises. Most are inherited from
            established science; one follows mathematically from another; three are AIM&apos;s
            own and are what the theory must defend. Any finding that contradicts one of them
            is evidence against the framework.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Jump to axiom">
            {axioms.map(a => (
              <a
                key={a.slug}
                href={`#${a.slug}`}
                className="rounded-md bg-white px-2.5 py-1 text-gray-700 ring-1 ring-gray-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {a.number}. {a.title.replace(/ \(.*\)$/, '')}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
          {axioms.map(axiom => (
            <AxiomCard key={axiom.number} axiom={axiom} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">How they fit together</h2>
          <ul className="space-y-1.5 text-gray-700">
            <li><strong>1 and 2</strong> set up the three sources and how they are combined.</li>
            <li><strong>3 and 4</strong> explain why the three are invisible to introspection.</li>
            <li><strong>5</strong> explains why M rides on A and I instead of standing alone.</li>
            <li><strong>6</strong> explains why satisfying each source has different results.</li>
            <li><strong>7</strong> fixes the timing that makes 3 and 4 unavoidable.</li>
            <li><strong>8</strong> explains how confabulated beliefs get entrenched and spread.</li>
            <li><strong>9</strong> explains why they take the shape of a culprit.</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AskAI
              variant="button"
              question="Walk me through how the nine AIM axioms depend on each other and what each one is load-bearing for."
              label="Ask how the axioms interlock"
            />
            <Link
              href="/theory"
              className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-5 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Read the theory
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
