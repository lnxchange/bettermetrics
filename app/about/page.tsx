import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from '@/components/ui/status-badge'
import { generateArticleMetadata, generateArticleStructuredData } from '@/lib/metadata'

export const metadata: Metadata = generateArticleMetadata({
  title: 'About the AIM Framework',
  description:
    'Learn about the AIM Motivation Framework, its origins, theoretical foundations, and how it transforms understanding of human choice.',
  path: '/about',
  publishedTime: '2025-10-01T00:00:00Z',
  modifiedTime: '2025-10-29T00:00:00Z',
  tags: ['AIM Framework', 'motivation', 'neuroscience', 'psychology', 'behavioral science']
})

export default function AboutPage() {
  const structuredData = generateArticleStructuredData({
    title: 'About the AIM Framework',
    description:
      'Learn about the AIM Motivation Framework, its origins, theoretical foundations, and how it transforms understanding of human choice.',
    path: '/about',
    publishedTime: '2025-10-01T00:00:00Z',
    modifiedTime: '2025-10-29T00:00:00Z'
  })

  return (
    <div className="bg-white">
      {/* Structured Data for SEO and Safari Reader */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            The AIM Motivation Framework
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive foundation for understanding how people choose what
            to pursue
          </p>
        </div>
      </section>

      {/* Hypothesis Statement */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-8">
          <div className="mb-4 flex justify-center">
            <StatusBadge variant="pre-empirical" />
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            The AIM Hypothesis: A Novel Theoretical Framework
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              The AIM Motivation Framework is a{' '}
              <strong>proposed theoretical synthesis</strong> that distinguishes
              three neural sources of human motivation. It has{' '}
              <strong>not yet been empirically validated</strong> through
              peer-reviewed research, though it synthesizes established findings
              from neuroscience, behavioral economics, and psychology.
            </p>
            <div className="my-6 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <strong>Status:</strong> Pre-empirical validation (October 2025)
                <br />
                <strong>Grounding:</strong> Theoretical synthesis of existing
                neuroscience literature
              </div>
              <div>
                <strong>Seeking:</strong> Research collaborators for empirical
                testing
                <br />
                <strong>Falsifiability:</strong> See testable predictions below
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AIM Represents a Paradigm Shift */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why AIM Represents a Paradigm Shift
            </h2>
            <p className="mx-auto max-w-4xl text-xl text-gray-600">
              Not Just New Mechanisms—New Categories for Understanding Human
              Motivation
            </p>
          </div>

          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            {/* Current Theories */}
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Current Theoretical Limitations
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Self-Determination Theory
                  </h4>
                  <p className="text-sm text-gray-700">
                    Lumps appetitive needs and mimetic desires together as
                    &quot;extrinsic motivation,&quot; missing the crucial
                    distinction between biological necessity and social
                    signaling.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Behavioral Economics
                  </h4>
                  <p className="text-sm text-gray-700">
                    Treats all social influence as one mechanism, unable to
                    distinguish between helpful social learning and harmful
                    status competition.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Mimetic Theory
                  </h4>
                  <p className="text-sm text-gray-700">
                    Underspecifies biological needs and intrinsic motivation,
                    focusing primarily on social dynamics without grounding in
                    neuroscience.
                  </p>
                </div>
                <div className="rounded-lg bg-red-100 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    Result: Theories conflict, predictions fail, policy
                    backfires
                  </p>
                </div>
              </div>
            </div>

            {/* AIM's Solution */}
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                AIM&apos;s Revolutionary Approach
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Three Functionally Distinct Sources
                  </h4>
                  <p className="text-sm text-gray-700">
                    Each with different neural circuits, behavioral signatures,
                    and policy levers— enabling precise interventions rather
                    than one-size-fits-all approaches.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Neuroscientifically Grounded
                  </h4>
                  <p className="text-sm text-gray-700">
                    Based on established neuroscience rather than philosophical
                    speculation, enabling testable predictions and falsifiable
                    hypotheses.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    Cross-Disciplinary Integration
                  </h4>
                  <p className="text-sm text-gray-700">
                    Provides uniform framework for economics, law, psychology,
                    and policy— resolving conflicts between different
                    fields&apos; approaches to human behavior.
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    Enables: Scientific definitions, market failure prediction,
                    institutional design
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-primary-200 rounded-xl border-2 bg-gradient-to-r from-primary-50 to-blue-50 p-8">
            <h3 className="mb-4 text-center text-2xl font-bold text-gray-900">
              The Core Innovation: Tri-Source Classification
            </h3>
            <div className="prose prose-lg max-w-none text-center">
              <p>
                Most theories propose new mechanisms. AIM proposes new{' '}
                <strong>categories</strong>. This isn&apos;t an incremental
                improvement—it&apos;s a fundamental reorganization of how we
                understand human motivation.
              </p>
              <p className="text-primary-800 font-semibold">
                If validated, AIM would provide the first neuroscientific basis
                for cross-disciplinary definitions of fundamental human concepts
                like freedom, respect, fairness, and privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="prose prose-lg mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2>A New Understanding of Human Choice</h2>
        <p>
          For decades, researchers across economics, psychology, and
          neuroscience have struggled with a fundamental question: Why do we
          want what we want? Traditional models treat &ldquo;preference&rdquo;
          or &ldquo;desire&rdquo; as a single, undifferentiated force. But the
          reality is far more nuanced.
        </p>
        <p>
          The AIM Motivation Framework provides the answer by distinguishing
          three distinct neural sources of motivation that integrate through the
          brain&apos;s common-currency valuation system.
        </p>

        <h2>The Three Sources in Detail</h2>

        <div className="not-prose my-8 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
          <h3 className="mb-3 flex items-center text-2xl font-bold text-gray-900">
            <span className="mr-3 text-4xl">🍽️</span>
            Appetites (A): Homeostatic Motivation
          </h3>
          <p className="mb-4 text-gray-700">
            Motivations arising from physiological deficits—hunger, thirst,
            thermoregulation, fatigue, sexual drive—that originate in
            homeostatic monitoring systems.
          </p>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Key Characteristics:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• State-dependent intensity</li>
                <li>• Cyclical (return as need rebuilds)</li>
                <li>• Terminal satisfiability</li>
                <li>• Rapid value collapse after satiety</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Neural Basis:
              </h4>
              <p className="text-gray-600">
                Hypothalamus → orbitofrontal cortex → ventral striatum
              </p>
            </div>
          </div>
          <p className="mt-4 font-semibold text-gray-700">
            Why it matters: Unmet appetites hijack decision-making. When
            sleep-deprived or hungry, choices shift dramatically because A
            dominates the valuation signal.
          </p>
        </div>

        <div className="not-prose my-8 rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
          <h3 className="mb-3 flex items-center text-2xl font-bold text-gray-900">
            <span className="mr-3 text-4xl">💡</span>
            Intrinsic Motivation (I): Process-Rewarding Engagement
          </h3>
          <p className="mb-4 text-gray-700">
            Internal, self-endorsed engagement in activities rewarding in the
            doing—curiosity, exploration, mastery, autonomous choice, play,
            aesthetic creation, flow.
          </p>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Key Characteristics:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Persistent across contexts and time</li>
                <li>• Process-focused (doing is the reward)</li>
                <li>• Autonomy-sensitive</li>
                <li>• Privately valued</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Neural Basis:
              </h4>
              <p className="text-gray-600">
                VTA dopamine → hippocampus coupling → prefrontal cortex
              </p>
            </div>
          </div>
          <p className="mt-4 font-semibold text-gray-700">
            Why it matters: Intrinsic motivation is the foundation of freedom,
            creativity, and lasting satisfaction. When I leads, people persist
            through setbacks and experience well-being independent of social
            approval.
          </p>
        </div>

        <div className="not-prose my-8 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
          <h3 className="mb-3 flex items-center text-2xl font-bold text-gray-900">
            <span className="mr-3 text-4xl">👥</span>
            Mimetic Desire (M): Socially Transmitted Wanting
          </h3>
          <p className="mb-4 text-gray-700">
            Desires sparked by observing others&apos; goal-directed actions,
            social opinions, prestige cues, and status signals. You want
            something because you see others wanting it.
          </p>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Key Characteristics:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Observability-dependent</li>
                <li>• Pre-conscious (don&apos;t remember source)</li>
                <li>• Rivalry-prone</li>
                <li>• Visibility-sensitive</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Neural Basis:
              </h4>
              <p className="text-gray-600">
                Mirror neurons (parietal/premotor) → ventral striatum
              </p>
            </div>
          </div>
          <p className="mt-4 font-semibold text-gray-700">
            Why it matters: Mimetic desire explains herding, bubbles, social
            anxiety, and status competition. It&apos;s not inherently bad—it
            enables culture and learning—but becomes problematic when it creates
            rivalry or overrides intrinsic aims.
          </p>
        </div>

        <h2>The Common-Currency Integration System</h2>
        <p>
          The brain doesn&apos;t maintain separate decision systems for each
          source. Instead, the
          <strong> ventromedial prefrontal cortex (vmPFC)</strong> and{' '}
          <strong>ventral striatum (VS)</strong>
          compute a unified &ldquo;common currency&rdquo; of subjective value
          that integrates A, I, and M into a single priority signal used for
          choice.
        </p>

        <div className="not-prose my-6 rounded-lg bg-gray-50 p-6">
          <p className="text-center font-mono text-lg">
            U(x) = w<sub>A</sub>U<sub>A</sub>(x) + w<sub>I</sub>U<sub>I</sub>(x)
            + w<sub>M</sub>U<sub>M</sub>(x)
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Where w<sub>A</sub>, w<sub>I</sub>, w<sub>M</sub> are normalized
            weights (sum to 1) representing the proportional influence of each
            source
          </p>
        </div>

        <h2>After a Motivation Channel Wins</h2>
        <p>
          When one motivation channel — Appetite (A), Intrinsic Motivation (I), or 
          Mimetic Desire (M) — becomes dominant, it doesn&apos;t instantly control 
          behavior. Instead, it&apos;s given priority in the brain&apos;s decision queue. 
          The &ldquo;winning&rdquo; channel influences the next stage by shaping attention 
          and emotional energy. However, competing motivations don&apos;t disappear; 
          they remain active as background signals, ready to challenge the leading 
          drive if context changes.
        </p>

        <h3>The Buffer and Stickiness</h3>
        <p>
          The system includes a natural buffer — a short delay that prevents constant 
          switching between motivations. This delay, or &ldquo;stickiness,&rdquo; ensures 
          behavior feels stable and purposeful rather than erratic. For example, if an 
          appetite-based urge temporarily wins, the buffer keeps attention and energy 
          focused long enough to act meaningfully before letting other motivations 
          re-enter competition. This stickiness enables us to stay focussed on the 
          current task and allows habits, commitments, and goals to take root.
        </p>

        <h3>When Action is Taken</h3>
        <p>
          A decision becomes actionable when the leading motivation continues to 
          dominate through the buffer period. Only then does cognitive control — what 
          we experience as &ldquo;deciding&rdquo; — trigger a coordinated response between 
          thought, emotion, and movement. In simple terms, a choice is converted into 
          action when it remains the most compelling option over time, not just for a 
          fleeting moment. This can occur at a natural decision point, such as when 
          we complete a task, or when the priority signal of the motivation exceeds the 
          buffer threshold (e.g. &ldquo;Excuse me, I just need to go to the toilet&rdquo;.)
        </p>

        <p>
          This flow — competition, buffering, persistence, and action — is how the 
          AIM Framework models motivated behavior. It explains why people sometimes 
          hesitate, sometimes act with conviction, and how clarity emerges from 
          complexity.
        </p>

        <h2>About the Researcher</h2>
        <div className="not-prose my-8 rounded-xl bg-gray-50 p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <Image
                src="/Yule Guttenbeil Profile.jpg"
                alt="Yule Guttenbeil"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Yule Guttenbeil
              </h3>
              <p className="mb-3 text-gray-700">
                Yule Guttenbeil is a practicing lawyer and independent
                researcher who developed the AIM Framework through deep
                interdisciplinary synthesis. His background in law provided a
                unique lens: the need for precise definitions and clear
                boundaries that prevent conflation—the same rigor required for
                good contracts.
              </p>
              <p className="italic text-gray-700">
                &ldquo;I wasn&apos;t trying to invent new data or observations.
                All the neuroscience, all the behavioral evidence was already
                there. I just needed to put better boundaries around the
                categories of motivation. Once I did that, suddenly everything
                clicked.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="not-prose border-primary-200 mt-12 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Join the Research
          </h2>
          <p className="mb-6 text-gray-700">
            AIM is a living framework. We&apos;re actively seeking researchers
            to test predictions, practitioners to apply interventions, and
            organizations to pilot system redesigns.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Contact Us to Collaborate
          </Link>
        </div>
      </article>
    </div>
  )
}
