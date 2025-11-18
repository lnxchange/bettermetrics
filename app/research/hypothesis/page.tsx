import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'Research Hypothesis & Collaboration',
  description:
    'Re-specifying the utility function: Resolving "Code Drift" in behavioral models via the AIM Framework. A formal research proposal for economists, game theorists, and neuroscientists.'
}

export default function ResearchHypothesisPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Research Hypothesis Statement
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            A formal proposal for behavioral economists, game theorists, and neuroscientists
            to test the AIM Framework&apos;s core predictions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Re-Specifying the Utility Function: Resolving &quot;Code Drift&quot; in Behavioral Models via the AIM Framework
            </h2>

            {/* Section 1: The Problem */}
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              1. The Problem: &quot;Code Drift&quot; in Utility Aggregation
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed">
              Current economic and behavioral models largely rely on a singular metric of 
              &quot;Preference&quot; (or Utility, <em>U</em>) to predict agent behavior. These models 
              assume that <em>U</em> acts as a coherent, stable value.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              However, this singular definition aggregates three neurobiologically distinct 
              drivers that obey contradictory mathematical laws:
            </p>

            <ul className="space-y-3 text-lg text-gray-700 mb-6">
              <li>
                <strong>Homeostatic Drivers (Appetites):</strong> Subject to strict saturation 
                (diminishing marginal utility).
              </li>
              <li>
                <strong>Autotelic Drivers (Intrinsic):</strong> Subject to flow states 
                (constant or increasing marginal utility).
              </li>
              <li>
                <strong>Reflexive Drivers (Mimetic):</strong> Subject to social recursion 
                (dependent on the utility functions of other agents).
              </li>
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
              <p className="text-lg text-gray-800">
                <strong>The Hypothesis:</strong> Treating these three distinct vectors as a 
                single variable (<em>U</em>) constitutes a <strong>&quot;Definitional Error&quot;</strong> 
                (or Code Drift). This error causes &quot;gear grinding&quot; in models—manifesting 
                as anomalies like the Easterlin Paradox or Veblen Effects—because the model 
                attempts to apply a single logic to competing neural systems.
              </p>
            </div>

            {/* Section 2: The Solution */}
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              2. The Proposed Solution: The AIM Vector
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed">
              We propose abandoning the singular &quot;Preference&quot; metric in favor of a 
              tri-partite vector based on the <strong>AIM Motivation Framework</strong>.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              We posit that an agent&apos;s decision (<em>D</em>) is not a function of maximized 
              Utility (<em>U</em>), but the resultant vector of three independent systems:
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 my-8 text-center">
              <div className="text-3xl font-bold text-blue-900 mb-4">
                <em>D</em> = <em>f</em>(<em>A</em>, <em>I</em>, <em>M</em>)
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Where:
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-amber-400 bg-amber-50 p-6">
                <p className="text-lg text-gray-800">
                  <strong><em>A</em> (Appetites):</strong> A variable governed by{' '}
                  <strong>Negative Feedback Loops</strong>. It seeks 0 (homeostasis). It is 
                  biologically bounded and cyclical.
                </p>
              </div>

              <div className="border-l-4 border-teal-400 bg-teal-50 p-6">
                <p className="text-lg text-gray-800">
                  <strong><em>I</em> (Intrinsic):</strong> A variable governed by{' '}
                  <strong>Internal Reward Loops</strong>. It is independent of external 
                  observation. It is the source of &quot;noise&quot; in standard models but 
                  represents &quot;signal&quot; in the AIM framework.
                </p>
              </div>

              <div className="border-l-4 border-purple-400 bg-purple-50 p-6">
                <p className="text-lg text-gray-800">
                  <strong><em>M</em> (Mimetic):</strong> A variable governed by{' '}
                  <strong>Positive Feedback Loops</strong> (Mirror Neurons). It is unbounded 
                  and socially recursive (Agent X wants object <em>O</em> <em>because</em>{' '}
                  Agent Y wants object <em>O</em>).
                </p>
              </div>
            </div>

            {/* Section 3: Theoretical Application */}
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              3. Theoretical Application (The &quot;Contract&quot;)
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed">
              Just as a legal contract fails if terms are vaguely defined, behavioral models 
              fail when the input variable &quot;Desire&quot; is ambiguous.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              By applying <strong>AIM Definitions</strong> as a &quot;strict contractual standard&quot; 
              for research, we can test the following predictions:
            </p>

            <div className="space-y-8 my-12">
              {/* Prediction A */}
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-8">
                <h4 className="text-xl font-bold text-amber-900 mb-3">
                  Prediction A (Saturation)
                </h4>
                <p className="text-lg text-gray-800">
                  Incentives targeting <em>A</em> (e.g., basic income) will show{' '}
                  <strong>sharp diminishing returns</strong> once biological thresholds are met.
                </p>
              </div>

              {/* Prediction M */}
              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-8">
                <h4 className="text-xl font-bold text-purple-900 mb-3">
                  Prediction M (Contagion)
                </h4>
                <p className="text-lg text-gray-800">
                  Incentives targeting <em>M</em> (e.g., status goods, rankings) will show{' '}
                  <strong>no saturation point</strong> but high volatility (bubbles), as they 
                  rely on external social validation.
                </p>
              </div>

              {/* Prediction I */}
              <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-8">
                <h4 className="text-xl font-bold text-teal-900 mb-3">
                  Prediction I (Crowding Out)
                </h4>
                <p className="text-lg text-gray-800">
                  Introducing <em>M</em>-based incentives (rewards/rankings) to an{' '}
                  <em>I</em>-based activity will <strong>degrade the stability</strong> of the 
                  behavior by shifting the neural driver from a renewable internal loop to a 
                  volatile external loop.
                </p>
                <div className="mt-4 bg-teal-100 border-l-4 border-teal-600 p-4">
                  <p className="text-sm text-teal-900">
                    <strong>Note for SDT researchers:</strong> This prediction directly extends 
                    and formalizes Self-Determination Theory&apos;s observations about extrinsic 
                    rewards undermining intrinsic motivation. The AIM Framework provides the 
                    neural mechanism (switching from VTA dopamine loops to mirror neuron systems) 
                    and a quantifiable prediction (behavior becomes more volatile and 
                    context-dependent).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Call to Collaboration */}
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              4. Call to Collaboration
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed">
              The AIM Framework offers the <strong>definitions</strong> (the taxonomy), but we 
              require the <strong>metrics</strong> (the econometrics). We invite economists, 
              game theorists, and neuroscientists to &quot;plug&quot; these definitions into existing 
              models to test if disaggregating <em>U</em> into {'{'}
              <em>A</em>, <em>I</em>, <em>M</em>
              {'}'} yields higher predictive accuracy than current standard models.
            </p>

            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-8 my-12">
              <h4 className="text-xl font-bold text-blue-900 mb-4">
                Why This Matters for Your Research
              </h4>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>
                    <strong>It respects your mathematics:</strong> Uses concepts like 
                    &quot;diminishing marginal utility&quot; and &quot;recursion&quot; that are 
                    standard in behavioral economics
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>
                    <strong>It validates definitional work:</strong> Frames the contribution 
                    as fixing construct validity so you can fix the mathematics
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>
                    <strong>It isolates mimetic behavior:</strong> By separating <em>M</em>{' '}
                    as a distinct variable, you can model social contagion without breaking 
                    your core utility framework
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Collaborate?
              </h3>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                We&apos;re seeking research partners to empirically test these predictions. 
                Whether you work in behavioral economics, game theory, neuroscience, or 
                experimental psychology, we want to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
                >
                  Contact Us to Collaborate
                  <HiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/research/definitions"
                  className="inline-flex items-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50"
                >
                  View Scientific Definitions
                </Link>
              </div>
            </div>

            {/* Related Resources */}
            <div className="mt-16 border-t-2 border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Resources
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Link
                  href="/research/theories"
                  className="block rounded-xl border-2 border-gray-200 p-6 transition hover:border-primary-500 hover:shadow-lg"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    AIM & Existing Theories
                  </h4>
                  <p className="text-gray-600">
                    See how AIM relates to Self-Determination Theory, Girard&apos;s Mimetic Theory, 
                    and standard economics
                  </p>
                </Link>
                <Link
                  href="/research-resources"
                  className="block rounded-xl border-2 border-gray-200 p-6 transition hover:border-primary-500 hover:shadow-lg"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Research Documents
                  </h4>
                  <p className="text-gray-600">
                    Access comprehensive reports, papers, and testable predictions across domains
                  </p>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

