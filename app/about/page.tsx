import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowRight } from 'react-icons/hi'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { FrameworkCore } from '@/components/framework-core'
import { SITE_OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About the Author and the AIM Framework',
  description:
    'Who is behind the AIM Framework, what the Treatise claims and does not claim, and how to challenge it.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About the Author and the AIM Framework',
    description: 'The author, the book, its claims, and how to challenge it.',
    url: '/about',
    images: [SITE_OG_IMAGE],
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
  'That the AIM Framework is already validated. It is a coherent synthesis that generates testable predictions and awaits peer-reviewed validation. A validation roadmap is in the appendices.',
  'That the AIM Framework explains all of cognition, emotion or behaviour. It is a theory of motivation: how wanting arises, forms beliefs, and drives action.',
  'That the AIM Framework replaces other frameworks. Self-Determination Theory, behavioural economics, mimetic theory and drive theories remain valuable; the AIM Framework integrates and clarifies them.',
  'That applying it is simple. Identifying the dominant source and designing an intervention takes skill and judgement. The framework supplies diagnostics, not automatic answers.',
  'That interventions aligned with the AIM Framework always succeed. Correct diagnosis does not guarantee effective treatment.'
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
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <Image
              src="/20250911-lex-nova-web-res-106.jpg"
              alt="Yule Guttenbeil"
              width={160}
              height={160}
              className="h-40 w-40 shrink-0 rounded-lg object-cover shadow"
            />
            <div>
              <h2 className="mb-3 text-3xl font-bold text-gray-900">Yule Guttenbeil</h2>
              <p className="text-lg text-gray-700">
                I&apos;m <strong>Yule Guttenbeil</strong>, the person who formulated the AIM
                Framework and creator of aimtheory.org.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-lg text-gray-700">
            <p>
              The purpose of this website and the AIM Framework is to explain how recent
              neuroscientific discoveries shed light on where our motivations come from in the
              brain. These discoveries make it easier to understand ourselves, our relationships
              with others, and how society is arranged as a whole. The flow-on effects from how
              we understand our own motivations extend to how we think about most of the human
              behavioural sciences.
            </p>
            <p>
              I&apos;m a technology lawyer with a bachelor&apos;s degree in commerce majoring in
              management. Management is the study of how to align the motivations of the members
              of an organisation with the goals of that organisation. It adopts frameworks from
              many fields of the humanities that study motivation, many of which when examined
              closely and compared with each other can&apos;t be reconciled. I&apos;m also a{' '}
              <a
                href="https://libris.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                software developer
              </a>
              ,{' '}
              <a
                href="https://smbtech.au/news/attune-legals-yule-guttenbeil-awarded-ai-consultant-of-the-year-for-responsible-ai-advocacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                award winning AI ethicist and consultant
              </a>
              , and{' '}
              <a
                href="https://themusic.com.au/features/ulysses-wulf-brynn-davies/4ZHy9fT39vk/15-04-16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                musician
              </a>
              .
            </p>
            <p>
              While it might seem unusual for a lawyer to develop a framework of human
              motivation, my professional background, particularly in writing and analysing
              contracts, has given me a unique ability when assessing the literature I&apos;ve
              read across the human behavioural sciences (psychology, economics, philosophy,
              neuroscience, etc.). Writing contracts is like building a machine: every definition
              and term in a contract operates like a cog that must fit precisely with the others,
              or the machine breaks down.
            </p>
            <p>
              In behavioural science, I believe we&apos;ve been dealing with a definitional error
              that causes a kind of &quot;code drift&quot;, in how we define wants, needs, and
              preferences. The AIM Framework provides refined definitions that align more
              accurately with how our motivations work neurologically and play out in behaviour,
              allowing the reduction of friction in human interactions.
            </p>
            <p>
              Contracts exist to manage rivalry; they make implicit expectations explicit and
              help prevent conflict by clearly defining boundaries and roles. Without them,
              confusion and disputes arise because competing motivations remain unarticulated. In
              that sense, (despite the popular imagining) lawyers help grease the wheels of human
              relationships.
            </p>
            <p>
              In that light, I invite you to explore the resources I have made available on this
              website which are based on my own research. This is a living project, so the
              structure and information on this site will be updated as the theory, hypothesis
              and findings develop over time.
            </p>
            <div className="border-l-4 border-amber-400 bg-amber-50 p-6">
              <p>
                The AIM Framework is a synthetic theory. It provides a basis for
                hypothesising predictions and tightly boundered tests in order to validate its
                premise. I am not a professional psychologist, economist, philosopher or
                neuro-scientist. Though I have read broadly across those fields. Therefore, I am
                seeking assistance from experts in each of those fields to help me validate the
                theory, because if what the AIM Framework suggests is correct, it may provide a
                scientific basis for restructuring human societies, economies and governmental
                structures to enable human flourishing – by removing memetic noise and distortion
                from areas where it should not override the intrinsic motivations of every
                individual.
              </p>
            </div>

            <h3 className="pt-4 text-2xl font-bold text-gray-900">How It All Started</h3>
            <p>
              One of my strongest early memories is believing I was an alien. I was no older than
              4. I felt that my father didn&apos;t understand me and that I couldn&apos;t
              understand him. I couldn&apos;t relate to him or effectively communicate the
              importance of my wants and needs to him. That feeling persisted in various forms
              throughout my life and ultimately led me to therapy in 2010.
            </p>
            <p>
              It was here that I told my therapist that I didn&apos;t know whether I wanted things
              for myself because I genuinely wanted them, or because my dad wanted them for me.
              The therapist responded, &quot;Well, then that&apos;s where your work is — finding
              that out.&quot; The AIM Framework represents the culmination of that work. It
              appears to me that in answering that question for myself, I may have inadvertently
              answered the same question for everyone&apos;s self.
            </p>
          </div>
        </section>

        {/* The book */}
        <section id="book" className="scroll-mt-24 border-t border-gray-100 py-12">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">The book</h2>
          <p className="mb-1 text-xl font-semibold text-gray-800">
            A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and
            Mimetic Desire
          </p>
          <div className="mb-8">
            <FrameworkCore />
          </div>
          <p className="mb-6 text-gray-600">
            Twenty chapters and further appendices follow that pair. They explain the
            framework and show how it plays out, so that each step can be checked and each
            prediction tested. In active revision; the chat is always answering from the
            current text.
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
                The other appendices propose a validation roadmap and follow the architecture
                into particular cases, including artificial intelligence.
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
          <h2 className="mb-6 text-3xl font-bold text-gray-900">What the AIM Framework claims, and does not</h2>
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
              question="I'm a researcher. Which predictions of the AIM Framework are most tractable to test first, and what does the validation roadmap recommend?"
              label="Ask about testing the AIM Framework"
              className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
