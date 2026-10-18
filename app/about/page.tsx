import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowRight } from 'react-icons/hi'
import { AskAI, AskAIGroup } from '@/components/ask-ai'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who is behind the AIM Framework, what the Treatise claims and does not claim, and how to challenge it.',
  openGraph: {
    title: 'About | AIM Framework',
    description: 'The author, the book, its claims, and how to challenge it.',
    url: 'https://www.usebettermetrics.com/about',
    type: 'website'
  }
}

const claims = [
  'Human motivation decomposes into three neurologically distinct sources: Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).',
  'A and I report deficits; M reports Salience. The three converge through Common-Currency Integration in the Decision Hub, which produces a single decision signal.',
  'The architecture does not stop at the boundary of the individual. It is one coupled system, the same loops at every scale, with no new primitives beyond the first.',
  'After integration, which source produced which part of the signal is lost (Source Opacity). A Salience signal is therefore felt as a deficit.',
  'The brain compensates by generating sincere but often inaccurate narratives about why it chose (Confabulation).',
  'The three sources satiate differently. A and I close when repaired; M has no terminal value and so no natural stopping point.',
  'These features, with the preconscious transmission of M, produce predictable patterns of individual dysfunction and collective crisis.',
  'Thin normative concepts (freedom, fairness, justice, coercion, consent, harm, dignity, well-being) can be derived from the architecture without importing moral premises.',
  'Institutions can be evaluated by how well they secure basic needs, protect the space in which I operates, and manage the M dynamics that lead to crisis.'
]

const nonClaims = [
  'That only three categories can ever exist. Three is the most parsimonious decomposition consistent with current evidence; a fourth would require revision.',
  'That AIM is already validated. It is a coherent synthesis that generates testable predictions and awaits peer-reviewed validation. A validation roadmap is in the appendices.',
  'That AIM explains all of cognition, emotion or behaviour. It is a theory of motivation: how wanting arises, forms beliefs, and drives action.',
  'That AIM replaces other frameworks. Self-Determination Theory, behavioural economics, mimetic theory and drive theories remain valuable; AIM integrates and clarifies them.',
  'That applying it is simple. Identifying the dominant source and designing an intervention takes skill and judgement. The framework supplies diagnostics, not automatic answers.',
  'That AIM-aligned interventions always succeed. Correct diagnosis does not guarantee effective treatment.'
]

const partOne = [
  'Introduction', 'Definitions and Glossary', 'System Scope and OCEP', 'The Axiomatic and Architectural Foundation of AIM',
  'Why Motivation Requires Disaggregation', 'Appetites', 'Intrinsic Motivation', 'Mimetic Desire',
  'Neural Integration and Source Opacity', 'The Evolutionary Mismatch Hypothesis', 'Confabulation, Projection and the Scapegoat Mechanism',
  'Money, Debt and the Architecture of Mimetic Extraction', 'Bayesian Belief Dynamics', 'Quantum Epistemology'
]
const partTwo = [
  'The Bayesian Self-Model', 'Conflict and Justice', 'Violence as Architectural Output', 'The Knowledge Patch',
  'The Dissolution of Individualism and the Derivation of Relationalism', 'The Governance Architecture'
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">About</h1>
          <p className="text-lg text-gray-700">
            The author, the book, what it claims and does not claim, and where it can be
            challenged.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Author */}
        <section id="author" className="scroll-mt-24 py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Image
              src="/20250911-lex-nova-web-res-106.jpg"
              alt="Yule Guttenbeil"
              width={160}
              height={160}
              className="h-40 w-40 shrink-0 rounded-lg object-cover shadow"
            />
            <div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900">Yule Guttenbeil</h2>
              <p className="mb-4 text-lg text-gray-700">
                Principal commercial lawyer and the author of the AIM Framework. Contract work
                is definitional work: a system fails when two parties are using slightly
                different meanings of the same word. Reading across psychology, economics and
                neuroscience, the same failure was visible. Each field had its own drifting
                definitions of wants, needs and preferences, and the gears no longer lined up.
                AIM is an attempt to repair that drift with tighter, neurologically grounded
                definitions that can be applied back onto what the fields have already
                observed.
              </p>
              <p className="text-lg text-gray-700">
                The personal version is shorter. In 2010 I told a therapist I could not tell
                whether I wanted things because I wanted them or because my father wanted
                them for me. She said: then that is where your work is. The framework is the
                result of taking that seriously, and discovering that the question was not
                only mine. It is the question Source Opacity leaves every one of us unable to
                answer by introspection alone.
              </p>
            </div>
          </div>
        </section>

        {/* The book */}
        <section id="book" className="scroll-mt-24 border-t border-gray-100 py-12">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">The book</h2>
          <p className="mb-1 text-xl font-semibold text-gray-800">
            A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and
            Mimetic Desire
          </p>
          <p className="mb-6 text-gray-600">
            Twenty chapters and appendices, stated axiomatically so that each step can be
            checked and each prediction tested. In active revision; the chat is always
            answering from the current text.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Part I: Diagnosis
              </h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
                {partOne.map(c => <li key={c}>{c}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Part II: Response
              </h3>
              <ol start={15} className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
                {partTwo.map(c => <li key={c}>{c}</li>)}
              </ol>
              <p className="mt-3 text-sm text-gray-600">
                Appendices: the mathematical structure of the AIM system, a proposed validation
                roadmap, and the architecture applied to artificial intelligence.
              </p>
            </div>
          </div>
          <AskAIGroup
            questions={[
              'Give me a chapter-by-chapter summary of the AIM Treatise.',
              'What is in Appendix A, the mathematical structure of the AIM system?',
              'What does the validation roadmap in Appendix B propose?'
            ]}
          />
        </section>

        {/* Claims */}
        <section id="claims" className="scroll-mt-24 border-t border-gray-100 py-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">What AIM claims, and does not</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Claims</h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                {claims.map((c, i) => <li key={i}>{c}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Does not claim</h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                {nonClaims.map((c, i) => <li key={i}>{c}</li>)}
              </ol>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">From the Treatise, Chapter 1, Section 1.4.</p>
        </section>

        {/* How to challenge */}
        <section id="research" className="scroll-mt-24 border-t border-gray-100 py-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">How to challenge it</h2>
          <p className="mb-4 text-lg text-gray-700">
            The framework is stated axiomatically to maximise the number of ways it can be
            shown wrong, and to make each cheap to test. Most of its components are inherited
            from established literatures; one is mathematically entailed; the contestable part
            reduces to two assertions:
          </p>
          <ol className="mb-6 list-decimal space-y-3 pl-5 text-gray-700">
            <li>
              That A, I and M are the correct decomposition, exactly these three and not two or
              four. Defended by the bidirectional consilience argument in Chapter 4 and the
              Fourth-Source Objection analysis there. A critic proposing a fourth source must
              identify its distinct neural substrate, its satiation dynamics, and behavioural
              signatures that cannot be decomposed into A, I or M.
            </li>
            <li>
              That M operates through the specific mechanisms claimed: preconscious social
              observation circuits, Object Parasitism, and non-satiation.
            </li>
          </ol>
          <p className="mb-6 text-lg text-gray-700">
            Everything downstream, from Source Opacity to the scapegoat mechanism to the
            Knowledge Patch, is derived from those two plus the inherited architecture. Each
            derivation is stated so the step can be checked. Rejecting a derivation means
            identifying the step that fails; rejecting an inherited premise means engaging the
            literature it comes from; a replacement theory must account for the same record
            with equal or greater parsimony.
          </p>
          <AskAIGroup
            questions={[
              'What would falsify the AIM Framework?',
              'What is the Fourth-Source Objection and how does Chapter 4 answer it?',
              'What is the bidirectional consilience argument?',
              'What is the Replacement Requirement in Chapter 3?'
            ]}
          />
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 border-t border-gray-100 py-12">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">Get in touch</h2>
          <p className="mb-6 text-lg text-gray-700">
            Peer review, falsification attempts, research collaboration and corrections are all
            welcome. For questions about the theory itself, the chat will usually be faster and
            more precise than I can be by email.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Contact
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <AskAI
              variant="button"
              question="I'm a researcher. Which AIM predictions are most tractable to test first, and what does the validation roadmap recommend?"
              label="Ask about testing AIM"
              className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
