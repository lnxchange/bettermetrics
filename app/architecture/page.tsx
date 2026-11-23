import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { ArchitectureHash } from '@/components/architecture-hash'
import { AIMIntegrationEquation } from '@/components/aim-definitions'
import { DecisionHubDiagram } from '@/components/decision-hub-diagram'
import {
  MinimalArchitecture,
  type ConstructionPremise,
  type PremiseStanding
} from '@/lib/architecture-data'
import { SITE_OG_IMAGE } from '@/lib/site'

const standingStyles: Record<PremiseStanding, string> = {
  'specified by the architecture': 'bg-blue-50 text-blue-900 border-blue-200',
  'derived from the architecture': 'bg-amber-50 text-amber-950 border-amber-200'
}

function ArchitectureJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ScholarlyArticle',
        '@id': 'https://aimtheory.org/architecture#article',
        headline: MinimalArchitecture.title,
        description: MinimalArchitecture.hero,
        author: {
          '@type': 'Person',
          '@id': 'https://aimtheory.org/#YuleGuttenbeil',
          name: 'Yule Guttenbeil'
        },
        publisher: { '@id': 'https://aimtheory.org/#organization' },
        mainEntityOfPage: 'https://aimtheory.org/architecture',
        about: {
          '@type': 'CreativeWork',
          '@id': 'https://aimtheory.org/#AIMFramework',
          name: 'AIM Framework'
        }
      },
      {
        '@type': 'ItemList',
        '@id': 'https://aimtheory.org/architecture#components',
        name: 'The four components and the Belief Register',
        numberOfItems: MinimalArchitecture.components.length,
        itemListElement: MinimalArchitecture.components.map(
          (component, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: component.name,
            description: component.text
          })
        )
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
  title: MinimalArchitecture.title,
  description: MinimalArchitecture.hero,
  alternates: { canonical: '/architecture' },
  openGraph: {
    title: 'The Minimal Architecture | The AIM Framework',
    description: MinimalArchitecture.hero,
    url: '/architecture',
    images: [SITE_OG_IMAGE],
    type: 'article'
  }
}

function PremiseCard({ premise }: { premise: ConstructionPremise }) {
  return (
    <article
      id={premise.slug}
      className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
          {premise.number}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{premise.title}</h3>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            standingStyles[premise.standing]
          }`}
        >
          {premise.standing}
        </span>
      </div>
      <p className="text-base leading-relaxed text-gray-800">
        {premise.statement}
      </p>
      {premise.gloss && (
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          {premise.gloss}
        </p>
      )}
      {premise.note && (
        <p className="mt-3 text-sm text-gray-600">{premise.note}</p>
      )}
      <p className="mt-3 text-sm text-gray-600">
        <span className="font-medium text-gray-800">Carried by: </span>
        {premise.carriedBy}
      </p>
      <details className="group mt-4">
        <summary className="cursor-pointer select-none text-sm font-medium text-blue-700 hover:underline">
          Foundational citations
        </summary>
        <p className="mt-3 text-xs text-gray-500">
          AIM Treatise, Chapter 4, Section 4.2.1
        </p>
        <ul className="mt-2 space-y-1">
          {premise.citations.map(citation => (
            <li key={citation} className="text-xs text-gray-600">
              {citation}
            </li>
          ))}
        </ul>
      </details>
      <AskAIGroup questions={premise.ask} heading={null} className="mt-4" />
    </article>
  )
}

export default function ArchitecturePage() {
  return (
    <div className="bg-white">
      <ArchitectureJsonLd />
      <ArchitectureHash />

      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The Minimal Architecture
          </h1>
          {MinimalArchitecture.lead.map(paragraph => (
            <p
              key={paragraph.slice(0, 24)}
              className="mb-4 text-lg leading-relaxed text-gray-700"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-sm text-gray-500">
            AIM Treatise, Chapter 4, Sections 4.3 and 4.3.6.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            The four components and the Belief Register
          </h2>
          <div className="space-y-6">
            {MinimalArchitecture.components.map(component => (
              <article
                key={component.slug}
                id={component.slug}
                className="scroll-mt-24"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {component.name}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Section {component.section}
                  </span>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-gray-800">
                  {component.text}
                </p>
              </article>
            ))}
          </div>

          <p className="mb-4 mt-10 text-base leading-relaxed text-gray-800">
            The four processing components and the Belief Register, with their
            inputs, their outputs, their termination conditions, and their
            AIM-instantiation identities, are summarised below.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm text-gray-800">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 pr-3 font-semibold">Component</th>
                  <th className="py-2 pr-3 font-semibold">Primary purpose</th>
                  <th className="py-2 pr-3 font-semibold">Input</th>
                  <th className="py-2 pr-3 font-semibold">Output</th>
                  <th className="py-2 pr-3 font-semibold">Termination</th>
                  <th className="py-2 font-semibold">AIM instantiation</th>
                </tr>
              </thead>
              <tbody>
                {MinimalArchitecture.componentTable.map(row => (
                  <tr
                    key={row.component}
                    className="border-b border-gray-200 align-top"
                  >
                    <th className="py-3 pr-3 font-medium">{row.component}</th>
                    <td className="py-3 pr-3">{row.purpose}</td>
                    <td className="py-3 pr-3">{row.input}</td>
                    <td className="py-3 pr-3">{row.output}</td>
                    <td className="py-3 pr-3">{row.termination}</td>
                    <td className="py-3">{row.instantiation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The Observer row is read subject to the Minimum Installation
            Condition (4.3.3.1): in the social special case its output
            terminates asymmetrically, positive-valence installation being
            interminable in the M-channel until acquisition, which then re-ranks
            the Object-field, and negative-valence installation terminating
            pursuit while retaining monitoring-Salience. AIM Treatise, Chapter
            4, Section 4.4.2.
          </p>

          <div className="mt-10 space-y-8">
            <DecisionHubDiagram />
            <AIMIntegrationEquation />
          </div>
        </div>
      </section>

      <section
        id="operational-loop"
        className="scroll-mt-24 border-t border-gray-100 bg-gray-50 py-12"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            The operational loop
          </h2>
          {MinimalArchitecture.loop.map(paragraph => (
            <p
              key={paragraph.slice(0, 24)}
              className="mb-4 text-base leading-relaxed text-gray-800"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-base leading-relaxed text-gray-800">
            {MinimalArchitecture.appendix.split('Appendix A')[0]}
            <Link
              href="/treatise/appendix-a"
              className="font-semibold text-blue-700 underline hover:text-blue-800"
            >
              Appendix A
            </Link>
            {MinimalArchitecture.appendix.split('Appendix A')[1]}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            AIM Treatise, Chapter 4, Sections 4.4 and 4.6.6.
          </p>
        </div>
      </section>

      <section
        id={MinimalArchitecture.premisesAnchor}
        className="scroll-mt-24 py-12"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            What it was built from
          </h2>
          {MinimalArchitecture.builtFrom.map(paragraph => (
            <p
              key={paragraph.slice(0, 24)}
              className="mb-4 text-base leading-relaxed text-gray-800"
            >
              {paragraph}
            </p>
          ))}
          <nav
            className="mb-6 flex flex-wrap gap-2 text-sm"
            aria-label="Construction Premises"
          >
            {MinimalArchitecture.premises.map(premise => (
              <a
                key={premise.slug}
                href={`#${premise.slug}`}
                className="rounded-md bg-white px-2.5 py-1 text-gray-700 ring-1 ring-gray-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {premise.number}. {premise.title.replace(/ \(.*\)$/, '')}
              </a>
            ))}
          </nav>
          <div className="space-y-6">
            {MinimalArchitecture.premises.map(premise => (
              <PremiseCard key={premise.number} premise={premise} />
            ))}
          </div>

          <h2 className="mb-4 mt-12 text-2xl font-bold text-gray-900">
            Where the Construction Premises are carried
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm text-gray-800">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 pr-4 font-semibold">
                    Construction Premise
                  </th>
                  <th className="py-2 font-semibold">Carried by</th>
                </tr>
              </thead>
              <tbody>
                {MinimalArchitecture.premises.map(premise => (
                  <tr
                    key={premise.number}
                    className="border-b border-gray-200 align-top"
                  >
                    <th className="py-3 pr-4 font-medium">
                      {premise.number}. {premise.title}
                    </th>
                    <td className="py-3">{premise.carriedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-base leading-relaxed text-gray-800">
            {MinimalArchitecture.premiseNine}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            AIM Treatise, Chapter 4, Sections 4.2.1 and 4.4.2.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AskAI
              variant="button"
              question="Walk me through how the four components, the Belief Register and the operational loop fit together."
              label="Ask how the architecture fits together"
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
