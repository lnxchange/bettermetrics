import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowRight } from 'react-icons/hi'
import { AIMDefinitionsShort } from '@/components/aim-definitions'
import { FrameworkCore } from '@/components/framework-core'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { TwoQuestionDiagnostic } from '@/components/two-question-diagnostic'
import { DecisionHubDiagram } from '@/components/decision-hub-diagram'

export const metadata: Metadata = {
  title: { absolute: 'AIM Theory | A General Theory of Human Motivation' },
  description:
    'A general theory of human motivation: three sources of wanting (Appetites, Intrinsic Motivation, Mimetic Desire), one decision signal, and what mixing hides.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AIM Theory | A General Theory of Human Motivation',
    description:
      'Three sources of wanting, one decision signal, and what gets lost in the mixing.',
    url: '/',
    images: [{ url: '/aim-og.png', width: 1200, height: 630, alt: 'AIM: Appetites, Intrinsic Motivation, Mimetic Desire' }],
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
            AIM is a model of the system that produces wanting. Three systems in the brain
            each send a signal to one decision centre. One tracks what the body needs
            (Appetites). One tracks what is rewarding to do for its own sake (Intrinsic
            Motivation). One tracks what stands out as valuable around you (Mimetic Desire).
            The decision centre merges them into a single sense of how much you want
            something, and acts on it.
          </p>
          <p className="max-w-3xl text-lg text-blue-200">
            The framework is derived, not asserted. It starts from{' '}
            <Link href="/axioms" className="font-semibold text-white underline hover:text-blue-100">
              nine stated premises
            </Link>
            , each tied to established neuroscience and each with a stated way it could be
            proved wrong, and the rest follows from them.
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

      {/* How the system works */}
      <section id="how-it-works" className="scroll-mt-20 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">How the system works</h2>
          <p className="mb-6 text-lg text-gray-700">
            A Body Manager reports bodily deficit, a Thinker pursues what is rewarding in the
            doing, and an Observer continuously reads which objects in the surrounding field
            stand out as valuable. All three feed a Decision Hub (the ventromedial prefrontal
            cortex and ventral striatum), which converts them into one value per option and
            selects an action.
          </p>
          <DecisionHubDiagram />

          <h3 className="mb-3 mt-10 text-2xl font-bold text-gray-900">
            The asymmetry: two gaps and one pointer
          </h3>
          <p className="mb-4 text-lg text-gray-700">
            The three signals are not the same kind of report. Appetites and Intrinsic
            Motivation each report a gap: something is missing, and the right object or
            activity would close it. Hunger ends when you eat. The Observer reports something
            else, which is where value appears to be. It has no gap to close, so it has no off
            switch.
          </p>

          <h3 className="mb-3 mt-8 text-2xl font-bold text-gray-900">M is a salience signal</h3>
          <p className="mb-4 text-lg text-gray-700">
            Mimetic Desire is named after its strongest cue, which is what other people
            visibly want. The signal itself is simply salience: <em>this stands out as worth
            having</em>. It works the same way for a limited edition, a new phone in a shop
            window or a queue outside a door as it does for a friend&apos;s new car. Valuing
            what others value is one case of salience, not a separate mechanism.
          </p>

          <h3 className="mb-3 mt-8 text-2xl font-bold text-gray-900">What the merge loses</h3>
          <p className="mb-4 text-lg text-gray-700">
            The Hub adds the three signals into one value. A want of strength 6 could be
            2&nbsp;+&nbsp;1&nbsp;+&nbsp;3 or 0&nbsp;+&nbsp;0&nbsp;+&nbsp;6, and nothing that sees
            only the 6 can tell which. Because the Hub has only one category to receive them
            in, a salience reading arrives feeling like a gap. That is why getting something
            you caught from others so often satisfies nothing: there was no gap to close.
          </p>
          <p className="mb-8 text-lg text-gray-700">
            Because what one person&apos;s Observer reads is what other people are pursuing,
            the same loop also runs between people. The framework builds outward from there
            without adding new parts.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h4 className="mb-2 font-bold text-gray-900">Taken from established research</h4>
              <p className="text-sm text-gray-700">
                The brain converts different kinds of value into one common currency before
                choosing. People sincerely invent reasons for choices they cannot introspect.
                Much of what people value is learned from others.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h4 className="mb-2 font-bold text-gray-900">What AIM adds</h4>
              <p className="text-sm text-gray-700">
                The split into three sources with different satiation patterns. The asymmetry
                between the two gap signals and the salience signal. What follows, by
                derivation, once they are merged.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            AIM is a theory of motivation, not of all cognition, and it builds on
            Self-Determination Theory, behavioural economics and mimetic theory rather than
            replacing them.{' '}
            <Link href="/about#claims" className="text-blue-600 hover:underline">
              What it claims and does not claim
            </Link>
          </p>
          <AskAIGroup
            questions={[
              'Why does merging three signals into one make the source unrecoverable?',
              'How can M be a salience signal when it feels like a need?',
              'Which parts of AIM are established science and which are new?'
            ]}
          />
        </div>
      </section>

      {/* Three sources */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Three sources of wanting</h2>
          <p className="mb-8 max-w-3xl text-lg text-gray-600">
            Each has its own neural pathway, its own satiation pattern, and its own tell.
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

      {/* Why it matters */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Why it matters</h2>
          <p className="mb-4 text-lg text-gray-700">
            The merged value records <em>how much</em> you want something but not{' '}
            <em>why</em>. Asked why you chose, the brain does not answer &ldquo;I don&apos;t
            know.&rdquo; It builds a plausible story and believes it. Salience-driven wants are
            the most likely to be misfiled as your own, because they arrive before awareness
            and leave nothing behind to check.
          </p>
          <p className="mb-4 text-lg text-gray-700">
            So asking people what they want, which is the foundation of consumer research,
            welfare economics and much of therapy, asks a question the architecture cannot
            reliably answer.
          </p>
          <p className="text-lg text-gray-700">
            If that is right, the human sciences stand roughly where medicine stood in 1850.
            Doctors could describe diseases in detail but could not say why they occurred or
            which treatments would work. Germ theory changed that by naming a cause. AIM aims
            to do the same for wanting.
          </p>
          <AskAIGroup
            questions={[
              'How can anything be done about a want I cannot see the source of?',
              'What does AIM mean by the Romantic Lie?'
            ]}
          />
        </div>
      </section>

      {/* Two-Question Diagnostic */}
      <section id="diagnostic" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Try the Two-Question Diagnostic</h2>
          <p className="mb-6 text-lg text-gray-600">
            Introspection cannot read the source, but behaviour can be tested for it. Two
            questions, by elimination.
          </p>
          <TwoQuestionDiagnostic />
        </div>
      </section>

      {/* The framework */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">The framework itself</h2>
          <FrameworkCore />
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
