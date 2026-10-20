import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowRight } from 'react-icons/hi'
import { AIMDefinitionsShort } from '@/components/aim-definitions'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { TwoQuestionDiagnostic } from '@/components/two-question-diagnostic'

export const metadata: Metadata = {
  title: 'AIM Framework | Use Better Metrics',
  description:
    'A general theory of human motivation. Three sources of wanting (Appetites, Intrinsic Motivation, Mimetic Desire), one decision signal, and what gets lost in the mixing.',
  openGraph: {
    title: 'AIM Framework | Use Better Metrics',
    description:
      'Three sources of wanting, one decision signal, and what gets lost in the mixing.',
    url: 'https://aimtheory.org',
    siteName: 'Use Better Metrics',
    images: [{ url: 'https://aimtheory.org/aim-og.png', width: 1200, height: 630, alt: 'AIM' }],
    locale: 'en_US',
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            A General Theory of Human Motivation
          </h1>
          <p className="mb-5 max-w-3xl text-xl text-blue-100">
            The human sciences stand roughly where medicine stood in 1850. Doctors could
            describe diseases in detail but could not say why they occurred or which
            treatments would work. Germ theory changed that with one idea: disease has a
            cause you can name. The AIM Framework is that idea for wanting. It is based on
            three sources — Appetites, Intrinsic Motivation, and Mimetic Desire — which the
            brain mixes into a single signal, and the mixing loses information that most of
            our institutions assume we still have.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <AskAI
              variant="button"
              question="Explain the AIM Framework to me in plain terms, as if I have never heard of it."
              label="Ask the AI to explain it"
              className="bg-white text-slate-900 hover:bg-blue-50"
            />
            <Link
              href="/theory"
              className="inline-flex items-center rounded-lg border-2 border-white px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Read the theory
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Three sources */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Three sources of wanting</h2>
          <p className="mb-8 max-w-3xl text-lg text-gray-600">
            Not categories invented for convenience. Each has its own neural pathway, its own
            satiation pattern, and its own tell.
          </p>
          <AIMDefinitionsShort />
          <AskAIGroup
            questions={[
              'Is wanting to be with other people Intrinsic or Mimetic?',
              'Can one object carry all three sources at once?',
              'Where does money fit: Appetite, Intrinsic, or Mimetic?'
            ]}
          />
        </div>
      </section>

      {/* What gets lost */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">What gets lost in the mix</h2>
          <p className="mb-4 text-lg text-gray-700">
            The brain cannot act on three signals at once, so it integrates them into one value
            per option. That output records <em>how much</em> you want something but not{' '}
            <em>why</em>. The source tags are not hidden; they are gone, the way red, green and
            blue paint stirred together cannot be separated by staring at the result.
          </p>
          <p className="mb-4 text-lg text-gray-700">
            Asked why you chose, the brain does not answer &ldquo;I don&apos;t know.&rdquo; It
            builds a plausible story and believes it. Socially caught wants are the most likely
            to be misfiled as your own, because they arrive before awareness and leave nothing
            behind to check.
          </p>
          <p className="text-lg text-gray-700">
            This is why asking people what they want, the foundation of consumer research,
            welfare economics and much of therapy, asks a question the architecture cannot
            reliably answer.
          </p>
          <AskAIGroup
            questions={[
              'Why is Source Opacity a mathematical result and not just a psychological observation?',
              'How can anything be done about a want I cannot see the source of?',
              'What does AIM mean by the Romantic Lie?'
            ]}
          />
        </div>
      </section>

      {/* Two-Question Diagnostic */}
      <section id="diagnostic" className="scroll-mt-20 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Try the Two-Question Diagnostic</h2>
          <p className="mb-6 text-lg text-gray-600">
            Introspection cannot read the source, but behaviour can be tested for it. Two
            questions, by elimination.
          </p>
          <TwoQuestionDiagnostic />
        </div>
      </section>

      {/* Where to go next */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Where to go next</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/theory"
              className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-900">The theory</h3>
              <p className="mb-3 text-sm text-gray-600">
                The architecture in seven short sections: sources, integration, opacity,
                confabulation, parasitism, satiation, and the patch.
              </p>
              <span className="inline-flex items-center text-sm text-blue-600 group-hover:underline">
                Read <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/axioms"
              className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-900">The nine axioms</h3>
              <p className="mb-3 text-sm text-gray-600">
                The premises everything is derived from, with what each one rests on and what
                would falsify it.
              </p>
              <span className="inline-flex items-center text-sm text-blue-600 group-hover:underline">
                Read <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/chat"
              className="group rounded-xl border border-blue-200 bg-blue-50 p-6 transition hover:border-blue-400 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-900">Ask the AI</h3>
              <p className="mb-3 text-sm text-gray-700">
                The corpus behind the chat is the full Treatise and research archive, kept
                current. Specific questions get specific answers.
              </p>
              <span className="inline-flex items-center text-sm text-blue-700 group-hover:underline">
                Open the chat <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Author strip */}
      <section className="py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Image
            src="/20250911-lex-nova-web-res-106.jpg"
            alt="Yule Guttenbeil"
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-full object-cover shadow"
          />
          <div>
            <p className="text-lg text-gray-800">
              AIM is the work of <strong>Yule Guttenbeil</strong>, a technology lawyer with a
              commerce degree in management. The framework is his account of wanting, written
              so psychology, economics and neuroscience can share one set of definitions.
            </p>
            <Link
              href="/about"
              className="mt-2 inline-flex items-center text-blue-600 hover:underline"
            >
              About the author and the book <HiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
