import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'AIM and Existing Theories | AIM Framework',
  description:
    'How the AIM Framework relates to Self-Determination Theory, Girard&apos;s mimetic theory, behavioral economics, and motivational neuroscience.'
}

export default function TheoriesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            AIM and Existing Theories
          </h1>
          <p className="text-xl text-gray-600">
            How the AIM Framework relates to, extends, and integrates with established 
            theories across psychology, economics, and social philosophy
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            A Framework for Integration, Not Replacement
          </h2>
          <p className="mb-4 text-lg text-gray-700">
            The AIM Framework is designed as a <strong>plug-in</strong> to existing theories, 
            not a wholesale replacement. It provides a neurologically grounded taxonomy that 
            clarifies how different theories capture different parts of the motivational landscape.
          </p>
          <p className="text-lg text-gray-700">
            Rather than dismissing established literatures, AIM shows how Self-Determination Theory, 
            Girard&apos;s mimetic theory, behavioral economics, and neuroscience research all describe 
            real phenomena—but through slightly different lenses. By providing unified categories 
            (Appetites, Intrinsic Motivation, Mimetic Desire), AIM helps reconcile apparent conflicts 
            between theories.
          </p>
        </div>
      </section>

      {/* Self-Determination Theory */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Self-Determination Theory (SDT)
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              How AIM extends SDT by adding the appetitive layer below and the mimetic layer above
            </p>
          </div>

          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            {/* SDT Overview */}
            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">SDT Framework</h3>
              <p className="mb-4 text-gray-700">
                <strong>Core Insight:</strong> Three universal psychological needs—autonomy, 
                competence, and relatedness—are essential for intrinsic motivation and well-being.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-teal-900">Autonomy</p>
                  <p className="text-sm text-gray-700">Self-endorsed choice and volition</p>
                </div>
                <div>
                  <p className="font-semibold text-teal-900">Competence</p>
                  <p className="text-sm text-gray-700">Mastery and effective action</p>
                </div>
                <div>
                  <p className="font-semibold text-teal-900">Relatedness</p>
                  <p className="text-sm text-gray-700">Connection and belonging</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                <strong>50+ years of validation</strong> (Deci & Ryan): Shows that extrinsic 
                rewards often crowd out intrinsic motivation.
              </p>
            </div>

            {/* AIM Extension */}
            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">How AIM Extends SDT</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-amber-900 mb-2">A-Layer Below SDT</p>
                  <p className="text-sm text-amber-800">
                    Adds physiological and safety needs (food, shelter, security) as the foundation. 
                    <strong> SDT&apos;s autonomy/competence/relatedness cannot flourish without appetitive 
                    sufficiency.</strong>
                  </p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <p className="font-semibold text-teal-900 mb-2">I-Layer Maps to SDT</p>
                  <p className="text-sm text-teal-800">
                    Intrinsic motivation in AIM directly corresponds to SDT&apos;s autonomy, competence, 
                    and relatedness—but situates them within the broader three-source framework.
                  </p>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <p className="font-semibold text-purple-900 mb-2">M-Layer Above SDT</p>
                  <p className="text-sm text-purple-800">
                    <strong>Critically adds what SDT omits:</strong> status-seeking, social comparison, 
                    and mimetic desire as distinct from intrinsic motivation. SDT lumps these under 
                    "extrinsic motivation" without distinguishing them from appetites.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Why This Matters</h3>
            <p className="mb-4 text-lg text-gray-700">
              <strong>AIM predicts when SDT interventions will succeed or fail:</strong>
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-green-600">✓</span>
                <span>
                  <strong>Success:</strong> Autonomy-supportive workplaces/schools work when A-layer 
                  is secure (stable wages, safe environment) and M-layer is managed (compressed status 
                  hierarchies, reduced competition).
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-600">✗</span>
                <span>
                  <strong>Failure:</strong> "Empower autonomy" policies fail when A-layer is 
                  precarious (food insecurity, housing instability) or M-layer is intense 
                  (visible pay gaps, public rankings, status tournaments).
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 italic">
              Many SDT studies implicitly assume A-layer security and ignore M-layer effects, 
              leading to inconsistent results across contexts.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="mt-8 overflow-hidden rounded-xl border-2 border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Layer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SDT Definition</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AIM Extension</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Real-World Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4 font-semibold text-amber-700">A</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Not formally included</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Physiological needs, safety, stability</td>
                  <td className="px-6 py-4 text-sm text-gray-700">SDT effects reduced if A unmet</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-teal-700">I</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Autonomy, Competence, Relatedness</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Intrinsic Motivation (maps directly to SDT)</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Suppressed by A/M threats</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-purple-700">M</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Excluded or lumped with extrinsic</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Mimetic Desire, status, comparison</td>
                  <td className="px-6 py-4 text-sm text-gray-700">SDT interventions undermined by M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Girardian Mimetic Theory */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Girard&apos;s Mimetic Theory
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              How AIM formalizes Girard&apos;s insights with neural pathways and weighting
            </p>
          </div>

          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            {/* Girard Overview */}
            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Girard&apos;s Insight</h3>
              <p className="mb-4 text-gray-700">
                <strong>Core Claim:</strong> Human desire is fundamentally mimetic—we want what we 
                see others wanting. Desire is mediated through models, leading to rivalry when multiple 
                people desire the same scarce object.
              </p>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Triangular desire:</strong> Subject → Model → Object</p>
                <p><strong>Mimetic rivalry:</strong> When models and subjects compete for same goal</p>
                <p><strong>Scapegoating:</strong> Social mechanism to resolve mimetic crisis</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Girard&apos;s work is primarily philosophical and anthropological, with less emphasis on 
                neuroscience or other motivational sources.
              </p>
            </div>

            {/* AIM Formalization */}
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">How AIM Formalizes Girard</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-blue-900 mb-2">Neural Grounding</p>
                  <p className="text-sm text-gray-700">
                    Mimetic desire corresponds to mirror neuron systems (parietal/premotor cortex) 
                    feeding into the ventral striatum. This provides a mechanistic account of how 
                    observing goal-directed actions triggers wanting in the observer.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-2">Integration with Other Sources</p>
                  <p className="text-sm text-gray-700">
                    AIM distinguishes mimetic rivalry (M) from appetitive competition (A) and intrinsic 
                    pursuits (I). Girard&apos;s framework underspecifies these other sources, making it 
                    difficult to predict when mimetic effects will dominate.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-2">Weighting System</p>
                  <p className="text-sm text-gray-700">
                    AIM adds formal weighting: w<sub>M</sub> varies with observability, model status, 
                    and social context. This makes Girard&apos;s insights quantifiable and testable through 
                    experiments that manipulate visibility and model prestige.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Distinction */}
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Not All Wanting Is Mimetic
            </h3>
            <p className="mb-4 text-lg text-gray-700">
              A crucial distinction: AIM shows that <strong>not all desire is imitated</strong>. 
              Hunger is appetitive, curiosity is intrinsic, and status-seeking is mimetic. Girard&apos;s 
              framework risks treating everything as mimetic, missing the different neural and 
              behavioral signatures of A and I.
            </p>
            <p className="text-gray-700">
              AIM preserves Girard&apos;s key insight—that social modeling powerfully shapes wanting—while 
              placing it within a broader motivational architecture. This allows for testable predictions 
              about when mimetic effects will be strong (high visibility, prestigious models) versus weak 
              (private contexts, autonomous projects, physiological needs).
            </p>
          </div>
        </div>
      </section>

      {/* Behavioral Economics */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Behavioral Economics
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              How AIM plugs into economics by replacing single preference variables with A/I/M weights
            </p>
          </div>

          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            {/* Traditional Economics */}
            <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Traditional Model</h3>
              <p className="mb-4 text-gray-700">
                <strong>Core Assumption:</strong> All preferences treated as uniform "utility." 
                A single utility function U(x) represents how much someone wants something, 
                without distinguishing the source of that wanting.
              </p>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Problem 1:</strong> Can&apos;t explain why status goods command premium prices</p>
                <p><strong>Problem 2:</strong> Can&apos;t predict when social influence matters</p>
                <p><strong>Problem 3:</strong> Can&apos;t distinguish necessities from luxuries formally</p>
                <p><strong>Problem 4:</strong> Market failures for essential goods appear as anomalies</p>
              </div>
            </div>

            {/* AIM Economics */}
            <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">AIM-Enhanced Economics</h3>
              <p className="mb-4 text-gray-700">
                <strong>Key Innovation:</strong> Replace single U(x) with three-component function:
              </p>
              <div className="my-4 rounded bg-white p-4 text-center font-mono text-sm">
                U(x) = w<sub>A</sub>·U<sub>A</sub>(x) + w<sub>I</sub>·U<sub>I</sub>(x) + w<sub>M</sub>·U<sub>M</sub>(x)
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Explains status goods:</strong> High w<sub>M</sub> creates mimetic premium</p>
                <p><strong>Predicts bubbles:</strong> M-amplification in visible markets</p>
                <p><strong>Distinguishes necessities:</strong> High w<sub>A</sub> for essential goods</p>
                <p><strong>Market failures:</strong> When A-needs compete with M-signaling</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="space-y-6">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Luxury Goods & Veblen Effects</h3>
              <p className="text-gray-700">
                Traditional economics struggles to explain goods that become <em>more</em> desirable 
                as prices increase. AIM explains this through high w<sub>M</sub>: the mimetic premium 
                dominates, and higher prices actually enhance social signaling value.
              </p>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Essential Goods Inelasticity</h3>
              <p className="text-gray-700">
                Why do people pay whatever is needed for food, water, medicine? Because w<sub>A</sub> 
                becomes dominant when appetites are urgent. This isn&apos;t just "high utility"—it&apos;s a 
                different kind of wanting with different neural basis and behavioral properties.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Market Cascades & Bubbles</h3>
              <p className="text-gray-700">
                Financial bubbles occur when w<sub>M</sub> amplifies through social observation: 
                people buy because they see others buying, creating self-reinforcing cycles. 
                Traditional models call these "irrational"—AIM shows they&apos;re predictable consequences 
                of mimetic weighting in high-visibility markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Synthesis */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              The Synthesis: A Unified Framework
            </h2>
          </div>

          <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700">
                What ancient philosophy suspected—that human motivation has distinct layers or 
                parts—turns out to be neurologically accurate. Plato&apos;s tripartite soul, Aristotle&apos;s 
                motivational distinctions, and modern observations across psychology, economics, and 
                social theory all describe real phenomena.
              </p>
              <p className="text-lg text-gray-700">
                The AIM Framework provides the <strong>missing taxonomy</strong> that allows these 
                different theories to talk to each other:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>SDT captures the I-layer</strong> (autonomy, competence, relatedness) but 
                  misses A and M
                </li>
                <li>
                  <strong>Girard illuminates the M-layer</strong> (mimetic rivalry, social modeling) 
                  but underspecifies A and I
                </li>
                <li>
                  <strong>Economics needs all three</strong> to explain status goods, necessities, 
                  and intrinsic value
                </li>
                <li>
                  <strong>Neuroscience confirms</strong> three distinct pathways converging in common 
                  valuation system
                </li>
              </ul>
              <p className="text-xl font-semibold text-gray-900">
                Rather than competing theories, we have complementary perspectives on a single 
                underlying architecture. AIM provides the connective tissue.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/research-resources"
              className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
            >
              Explore Research Programme
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              See Applications by Domain
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

