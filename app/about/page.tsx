import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  AIMDefinitionsShort,
  AIMIntegrationEquation,
  NeuralCircuits,
  DescriptiveVsNormative,
  MimeticPremium
} from '@/components/aim-definitions'
import { PageWithToc } from '@/components/page-with-toc'

export const metadata: Metadata = {
  title: 'About the AIM Framework',
  description:
    'The AIM Motivation Framework: a theoretical synthesis resolving definitional inconsistencies across neuroscience, behavioral economics, and psychology through a three-source taxonomic model.'
}

export default function AboutPage() {
  return (
    <PageWithToc>
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            The AIM Motivation Framework
          </h1>
          <p className="text-xl text-gray-600">
            A neuroscience-grounded taxonomy for understanding how three distinct
            motivational sources combine in the brain&apos;s common-currency valuation system
          </p>
        </div>
      </section>

      {/* Framework Positioning Statement */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-8">
          <div className="mb-4 flex justify-center">
            <StatusBadge variant="synthesis" />
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Explanatory Synthesis of Existing Evidence
          </h2>
                  <div className="prose prose-lg max-w-none">
                    <p>
                      The AIM Motivation Framework does not introduce novel empirical claims requiring validation—it
                      <strong> organizes and explains documented phenomena</strong>. Like Darwin's synthesis of existing
                      observations (fossils, biogeography, comparative anatomy) into a coherent framework, AIM integrates
                      established findings from neuroscience (common-currency valuation, mirror neurons, homeostatic
                      regulation), Self-Determination Theory (40+ years of validation), and Girardian mimetic theory
                      into a unified taxonomic model.
                    </p>
                    <p>
                      The evidentiary base already exists across fragmented disciplines. AIM's contribution is <strong>translation
                      and reorganization</strong>: converting established neuroscience into behavioral diagnostics, explaining
                      what has already been observed (Easterlin Paradox, SDT boundary failures, mimetic market cascades),
                      and providing the missing taxonomy that resolves "gear grinding" between economics, psychology, and policy.
                    </p>
            <div className="my-6 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <strong>Framework Type:</strong> Explanatory synthesis
                <br />
                <strong>Evidence Base:</strong> Decades of peer-reviewed neuroscience, psychology, and economics
              </div>
              <div>
                <strong>Future Research:</strong> Calibration and refinement of weight estimation precision
                <br />
                <strong>Application:</strong> Cross-domain consistency testing and intervention optimization
              </div>
            </div>
            <p className="text-sm italic">
              Note: AIM is primarily a taxonomy and weighting system for existing neural processes,
              not a claim about new brain regions. The framework aims to plug into existing models
              rather than replace them, making sense of what behavioral science has already documented.
            </p>
          </div>
        </div>
      </section>

      {/* Canonical Definitions */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 id="three-sources" className="mb-4 text-4xl font-bold text-gray-900">
              The Three Motivational Sources
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              What ancient philosophy suspected—Plato&apos;s tripartite soul, Aristotle&apos;s motivational 
              distinctions—neuroscience now confirms: three functionally distinct sources that converge 
              on a common-currency valuation system
            </p>
          </div>

          <AIMDefinitionsShort />
        </div>
      </section>

      {/* Integration Equation */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="how-sources-combine" className="mb-4 text-4xl font-bold text-gray-900">
              How the Sources Combine
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              The three sources integrate through the brain&apos;s common-currency valuation system, 
              creating a unified motivational signal that determines our choices
            </p>
          </div>

          <AIMIntegrationEquation />
        </div>
      </section>

      {/* Neural Architecture */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="neural-foundation" className="mb-4 text-4xl font-bold text-gray-900">
              The Neural Foundation
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Each motivational source has distinct neural pathways identified in neuroscience literature
            </p>
          </div>

          <NeuralCircuits />
        </div>
      </section>

      {/* Descriptive vs Normative */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 id="descriptive-vs-normative" className="mb-4 text-4xl font-bold text-gray-900">
              What AIM Describes vs What It Recommends
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              AIM is first a descriptive taxonomy. The normative proposals flow directly from 
              that descriptive clarity.
            </p>
          </div>

          <DescriptiveVsNormative />
        </div>
      </section>

      {/* Buffer and Switching Mechanism */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="action-selection" className="mb-4 text-4xl font-bold text-gray-900">
              Action Selection: Buffer and Switching
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              How the brain decides which motivation to act on through threshold-and-switch mechanisms
            </p>
          </div>

          <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">The Buffer System</h3>
                <p className="mb-4 text-gray-700">
                  Motivational signals don&apos;t translate immediately into action. Instead, they enter a &quot;buffer&quot; 
                  where the brain maintains the current activity until a threshold is crossed. This creates 
                  behavioral stickiness and explains why we often continue what we&apos;re doing even when other 
                  motivations are building.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Switching Triggers</h3>
                <p className="mb-4 text-gray-700">
                  The brain switches from one motivation to another when specific conditions are met:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="font-semibold text-amber-900 mb-2">Completion</p>
                    <p className="text-sm text-amber-800">
                      Task finishes, goal is reached, or project naturally concludes
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="font-semibold text-red-900 mb-2">Boredom</p>
                    <p className="text-sm text-red-800">
                      Intrinsic engagement drops below threshold, activity no longer rewarding
                    </p>
                  </div>
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="font-semibold text-orange-900 mb-2">Frustration</p>
                    <p className="text-sm text-orange-800">
                      Obstacles prevent progress, competence signals drop, autonomy feels blocked
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-300 bg-red-100 p-4">
                    <p className="font-semibold text-red-900 mb-2">Urgent Appetite</p>
                    <p className="text-sm text-red-900">
                      Physiological need crosses critical threshold, hijacking the valuation signal
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <p className="font-semibold text-purple-900 mb-2">Social Salience</p>
                    <p className="text-sm text-purple-800">
                      High-status model&apos;s behavior triggers strong mimetic signal that overrides current activity
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-100 p-6">
                <p className="font-semibold text-blue-900 mb-2">Why This Matters</p>
                <p className="text-sm text-blue-800">
                  Understanding buffer and switching explains structural features of human experience: 
                  why we feel &quot;stuck&quot; in unrewarding activities, why hunger makes us irritable, why 
                  social media is so distracting, and why flow states are precious but fragile. It also 
                  informs better institutional design: protect people&apos;s buffers, reduce unnecessary 
                  switching costs, and respect the threshold dynamics of each motivational source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mimetic Premium */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="mimetic-premium" className="mb-4 text-4xl font-bold text-gray-900">
              A Key Concept: The Mimetic Premium
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Understanding how social signaling adds value separate from utility and quality
            </p>
          </div>

          <MimeticPremium />
        </div>
      </section>

      {/* Using AIM Without Ideology */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="using-aim" className="mb-4 text-4xl font-bold text-gray-900">
              Using AIM Without Turning It Into an Ideology
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Explicit safeguards against AIM becoming a prestige badge or tribal marker
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">What Is Ideology Through AIM?</h3>
              <p className="text-gray-700">
                An ideology, viewed through the AIM Framework, is a &quot;social operating system for wanting&quot; 
                that manipulates mimetic desire (M) and controls access to appetitive satisfaction (A) and 
                intrinsic projects (I). Ideologies weaponize the M-layer by making belief-adherence a 
                prerequisite for social belonging and material security.
              </p>
            </div>

            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">The Two Operational Tests</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-green-900 mb-2">1. Audience-Removal Test</p>
                  <p className="text-sm text-green-800">
                    If adopting AIM would feel pointless without an audience to observe your adoption, 
                    it has become mimetic signaling rather than genuine understanding. AIM should help 
                    you understand motivation even if no one else ever knows you use it.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-green-900 mb-2">2. Low-Cost Opt-Out Test</p>
                  <p className="text-sm text-green-800">
                    You should be able to reject or ignore AIM without material consequences to your 
                    income, safety, or basic respect. If &quot;being AIM-fluent&quot; becomes a promotion criterion 
                    or social requirement, it has crossed into ideological territory.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">The Reflexive Non-Ideology Principle</h3>
              <p className="mb-4 text-gray-700">
                AIM adoption should never be tied to income, safety, or basic respect. Organizations using 
                AIM must avoid making framework knowledge a status signal or requirement for belonging. 
                The moment AIM becomes a badge of prestige or a gatekeeper of opportunity, it violates its 
                own descriptive premises about how mimetic pressure distorts intrinsic engagement.
              </p>
              <p className="text-sm italic text-gray-600">
                This principle is not an optional add-on but follows directly from AIM&apos;s descriptive account: 
                if we understand how M can hijack A and I, we must deliberately prevent AIM itself from 
                becoming a mimetic weapon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-gray-900">
            Why This Framework Matters
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-gray-700">
              For centuries, we&apos;ve observed that people want different things in different ways, 
              but we&apos;ve lacked the precise categories to talk about it systematically across disciplines. 
              Economics, psychology, law, and policy have all developed their own vocabularies for 
              motivation, creating &quot;gear grinding&quot; between fields.
            </p>
            <p className="text-xl text-gray-700">
              AIM provides the missing taxonomy. It doesn&apos;t claim new neural mechanisms—it reclassifies 
              what we already know into three sources, each with different properties, policy levers, 
              and ethical implications. Once you can distinguish appetitive from intrinsic from mimetic 
              motivation, long-standing puzzles in market behavior, policy failure, and interpersonal 
              conflict become clearer.
            </p>
            <p className="text-xl font-semibold text-gray-900">
              The proposals about fairness, freedom, and justice follow from that clarity: if we respect 
              the different sources, we can design institutions that secure appetites, protect intrinsic 
              projects, and avoid weaponizing mimetic rivalry.
            </p>
          </div>
          
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/research-resources"
              className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
            >
              Explore the Research Programme
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/understand-your-motivations"
              className="inline-flex items-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              Apply It to Your Life
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PageWithToc>
  )
}
