import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { AIMDefinitionsShort, AIMIntegrationEquation, MimeticPremium } from '@/components/aim-definitions'
import { AskAI, AskAIGroup } from '@/components/ask-ai'
import { Mermaid } from '@/components/ui/mermaid'

export const metadata: Metadata = {
  title: 'The Theory',
  description:
    'The AIM architecture in seven short sections: three sources, the Decision Hub, Source Opacity, Confabulation, Object Parasitism, Differential Satiation, and the Knowledge Patch.',
  openGraph: {
    title: 'The Theory | AIM Framework',
    description: 'The AIM architecture in seven short sections.',
    url: 'https://www.usebettermetrics.com/theory',
    type: 'article'
  }
}

const architectureChart = `flowchart LR
  BM["Body Manager<br/>(Appetites: deficit)"] --> DH["Decision Hub<br/>(Common-Currency Integration)"]
  TH["Thinker<br/>(Intrinsic Motivation: priors, I-Override)"] --> DH
  OB["Observer<br/>(Mimetic Desire: Salience)"] --> DH
  DH --> SC["One Scalar value per Object<br/>(source tags gone)"]
  SC --> ACT["Action"]
  SC -. tag-stripped .-> TH
  TH <--> BR["Belief Register"]
  BR -. conditions .-> OB`

const sections = [
  { id: 'sources', label: 'Three sources' },
  { id: 'integration', label: 'One signal' },
  { id: 'opacity', label: 'Source Opacity' },
  { id: 'confabulation', label: 'Confabulation' },
  { id: 'parasitism', label: 'Object Parasitism' },
  { id: 'satiation', label: 'Satiation' },
  { id: 'patch', label: 'The Knowledge Patch' },
  { id: 'applications', label: 'Applications' }
]

const applications: { domain: string; question: string }[] = [
  { domain: 'Economics', question: 'How does AIM explain the Easterlin Paradox and Veblen goods?' },
  { domain: 'Money and debt', question: 'Why does the AIM Treatise describe interest as a pure Mimetic Premium?' },
  { domain: 'Law and justice', question: 'How does AIM define freedom, coercion and justice without importing moral premises?' },
  { domain: 'Psychology', question: 'How does AIM relate to Self-Determination Theory, and where do they differ?' },
  { domain: 'Organisations', question: 'What does AIM say about status tournaments at work and how to protect intrinsic motivation?' },
  { domain: 'Health and policy', question: 'How would AIM separate need from socially amplified demand in health policy?' },
  { domain: 'Marketing', question: 'What is the AIM account of why some products go viral and others do not?' },
  { domain: 'Education', question: 'How does AIM explain the crowding-out of curiosity by grades and status?' },
  { domain: 'Social media', question: 'What does AIM predict about high-visibility platforms and mimetic crisis?' },
  { domain: 'Artificial intelligence', question: 'What does Appendix C of the Treatise say about applying the AIM architecture to AI?' },
  { domain: 'Violence and crisis', question: 'How does AIM derive violence and scapegoating as architectural outputs?' },
  { domain: 'Governance', question: 'What is the AIM governance architecture and what does it try to secure?' }
]

function Section({
  id,
  number,
  title,
  children
}: {
  id: string
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-gray-100 py-12 first:border-t-0">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">Part {number}</p>
      <h2 className="mb-5 text-3xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-lg leading-relaxed text-gray-700">{children}</p>
)

export default function TheoryPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The theory
          </h1>
          <p className="text-lg text-gray-700">
            Enough of the architecture to know what question you want to ask. Each part ends
            with questions the chat can answer from the Treatise itself.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Sections">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-md bg-white px-2.5 py-1 text-gray-700 ring-1 ring-gray-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Section id="sources" number={1} title="Three sources of wanting">
          <P>
            Every motivational signal entering the brain&apos;s decision system comes from one
            of three sources. They are distinct neural systems with different properties, and
            the same object can carry weight from all three at once: a meal addresses hunger
            (A), can be a pleasure in the eating (I), and can signal status through what it
            cost (M).
          </P>
          <AIMDefinitionsShort />
          <AskAIGroup
            questions={[
              'Why does AIM say loneliness and the desire to connect are Intrinsic, not Mimetic?',
              'What would a fourth source of motivation have to show to be admitted?'
            ]}
          />
        </Section>

        <Section id="integration" number={2} title="One signal: the Decision Hub">
          <P>
            The brain cannot act on three signals at once. A Body Manager reports bodily
            deficit, a Thinker holds priors and pursues intrinsic engagement, and an Observer
            continuously reads which objects the surrounding field marks as valued. All three
            feed a Decision Hub (the ventromedial prefrontal cortex and ventral striatum) that
            converts them into one value per option and selects an action.
          </P>
          <Mermaid chart={architectureChart} />
          <AIMIntegrationEquation />
          <AskAIGroup
            questions={[
              'What are the four components of the AIM architecture and what does each do?',
              'What is the Belief Register and how does it condition the Observer?'
            ]}
          />
        </Section>

        <Section id="opacity" number={3} title="Source Opacity">
          <P>
            Summing three quantities into one is a many-to-one map. Whatever the sum, a whole
            family of A, I, M combinations could have produced it, so no process downstream of
            the sum can recover which one did. Introspection reads the sum. The loss is not a
            failure of self-awareness; it is information theory.
          </P>
          <P>
            It is worse than losing a label. Two of the inputs report a deficit that an object
            would close. The third, the Observer&apos;s, reports where value sits in the field
            and carries no termination condition at all. After integration the Hub has only one
            category to receive them in, so a pointer to where value is located arrives feeling
            like a lack. Acquiring the object then closes nothing, because nothing was open.
          </P>
          <AskAIGroup
            questions={[
              'Explain the Salience-Deficit Conflation Principle with an everyday example.',
              'If Source Opacity is permanent, what does the Two-Question Diagnostic actually read?'
            ]}
          />
        </Section>

        <Section id="confabulation" number={4} title="Confabulation, and why it points at people">
          <P>
            Asked why, the brain does not report &ldquo;no data.&rdquo; It constructs a
            plausible narrative from available material and presents it as the true reason.
            The person sincerely believes it. Challenge produces elaboration, and each
            articulation is new evidence for the self-model, so the story deepens under
            scrutiny rather than correcting.
          </P>
          <P>
            The stories have a characteristic shape. Causal cognition is built to track
            agents, who generate dense, fast-changing evidence; systemic causes generate almost
            none and have to be constructed deliberately. So the gap is filled with an author:
            &ldquo;I chose this because of who I am,&rdquo; or, when a population is in
            distress, &ldquo;they did this to us.&rdquo; The scapegoat mechanism follows.
          </P>
          <AskAIGroup
            questions={[
              'How does the Agent-Based Causal Default produce scapegoating from collective distress?',
              'What is the Presumption Against Scapegoating and its Three-Test Battery?'
            ]}
          />
        </Section>

        <Section id="parasitism" number={5} title="Object Parasitism and the Mimetic Premium">
          <P>
            Mimetic Desire does not invent its own objects. It attaches to things that already
            serve the body or an intrinsic pursuit and inflates their value by a Mimetic
            Premium that feels like a property of the thing. That is what makes it hard to
            detect: the A and I reasons for wanting the bigger house are genuinely present, and
            the premium rides on top of them with no phenomenology of its own.
          </P>
          <P>
            Every price can therefore be decomposed into an A-functional price, an I-adequate
            price, and a Mimetic Premium. The premium is paid as though status could be bought,
            but status is computed in other people&apos;s heads, is zero-sum across the group,
            and is not for sale.
          </P>
          <MimeticPremium />
          <AskAIGroup
            questions={[
              'What is the Status-Premium Duality?',
              'Why did black pepper stop being a status good, and what does that show about M?'
            ]}
          />
        </Section>

        <Section id="satiation" number={6} title="Why some wants end and one never does">
          <P>
            Appetites satiate and recur: eat, and hunger ends until it returns. Intrinsic
            engagement deepens rather than ending: mastery opens new frontiers, though the
            tools it needs do satiate once they are adequate. Mimetic Desire has no stopping
            point, because the Observer is reading an unbounded field, not measuring an
            internal shortfall. Achieving a status goal simply resets the comparison.
          </P>
          <P>
            This is why societies can reach material abundance without reaching widespread
            wellbeing. Surplus flows into status competition rather than intrinsic engagement,
            spending rises, and welfare plateaus. It is also, in the formal treatment, why
            mimetic crises crash rather than oscillate.
          </P>
          <AskAIGroup
            questions={[
              'What is the Mimetic Treadmill and the Reference-Set Reset?',
              'Why does the Treatise say mimetic crises end in a fold rather than a cycle?'
            ]}
          />
        </Section>

        <Section id="patch" number={7} title="The Knowledge Patch">
          <P>
            If the source cannot be read by introspection, it can still be inferred from how a
            want behaves across contexts. The Treatise&apos;s intervention, the Knowledge Patch,
            is seven operations that work by generating doubt where a belief system has settled
            on a false prior:
          </P>
          <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-gray-700">
            <li><strong>AIM Vocabulary Acquisition</strong>, so the mimetic hypothesis is even representable.</li>
            <li><strong>Epistemic Suspension</strong>, tolerating &ldquo;I don&apos;t know&rdquo; as a stable state.</li>
            <li><strong>The Two-Question Diagnostic</strong>, source identification by elimination.</li>
            <li><strong>Behavioural Signatures</strong>, reading the pattern over time, in oneself and others.</li>
            <li><strong>The Presumption Against Scapegoating</strong>, with the Grievance Gateway and Three-Test Battery.</li>
            <li><strong>The Push-Pull Obligation Principle</strong>, for interpersonal obligation.</li>
            <li><strong>The Normality Fiction Breaker</strong>, for self-comparison against a mimetic template.</li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <AskAI
              variant="button"
              question="Explain the seven operations of the Knowledge Patch and why the Treatise says vocabulary acquisition has to come first."
              label="Ask about the Knowledge Patch"
            />
            <Link
              href="/#diagnostic"
              className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-white px-5 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Try the diagnostic
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </Section>

        <Section id="applications" number={8} title="Applications">
          <P>
            The same architecture, traced through markets, law, institutions and relationships.
            The Treatise and research corpus cover these in depth; the chat is the fastest route
            into any of them.
          </P>
          <div className="grid gap-3 sm:grid-cols-2">
            {applications.map(a => (
              <AskAI
                key={a.domain}
                question={a.question}
                className="h-auto justify-start rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm hover:border-blue-400"
                label={`${a.domain}: ${a.question}`}
              />
            ))}
          </div>
        </Section>

        <div className="border-t border-gray-100 py-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/axioms"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              The nine axioms
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-5 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Glossary
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
