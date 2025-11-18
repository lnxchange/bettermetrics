import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Research Methodology',
  description:
    'How the AIM Framework can be tested, validated, and applied across research domains with rigorous scientific methodology.'
}

export default function MethodologyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Research Methodology
          </h1>
          <p className="text-xl text-gray-600">
            How to test, validate, and apply the AIM Framework with scientific rigor
          </p>
        </div>
      </section>

      {/* Hypothesis Status Banner */}
      <div className="border-t-4 border-amber-400 bg-amber-50 p-6">
        <div className="mx-auto flex max-w-5xl items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="mb-1 font-bold text-gray-900">
              The AIM Framework is a testable scientific hypothesis
            </h3>
            <p className="text-gray-700">
              All claims can and should be empirically validated. We provide
              specific falsification criteria for each prediction.
              <Link
                href="/research-resources"
                className="ml-2 text-primary-600 hover:underline"
              >
                Access research materials →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-lg mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Methodological Approach
          </h2>
          <p className="mb-4">
            The AIM Framework provides a neuroscientifically grounded theory of
            human motivation that generates testable predictions across multiple
            domains. Our methodology emphasizes:
          </p>
          <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700">
            <li>
              <strong>Falsifiability:</strong> Every prediction includes explicit
              criteria for what would disprove it
            </li>
            <li>
              <strong>Cross-domain validation:</strong> Testing predictions across
              psychology, economics, education, health, law, marketing, and
              organizational behavior
            </li>
            <li>
              <strong>Neural grounding:</strong> Connecting behavioral predictions
              to specific neural mechanisms
            </li>
            <li>
              <strong>Quantitative measurement:</strong> Using validated scales and
              physiological markers to assess motivational sources
            </li>
            <li>
              <strong>Replication:</strong> Encouraging independent validation of
              all findings
            </li>
          </ol>
        </section>

        {/* Measuring Motivational Sources */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Measuring Motivational Sources
          </h2>
          <p className="mb-6">
            Distinguishing between Appetites (A), Intrinsic Motivation (I), and
            Mimetic Desire (M) requires multiple measurement approaches:
          </p>

          <div className="mb-8 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Appetites <span className="text-amber-600">(A)</span>
              </h3>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Physiological Markers:
              </p>
              <ul className="mb-3 space-y-1 text-sm text-gray-600">
                <li>• Glucose levels</li>
                <li>• Hydration status</li>
                <li>• Sleep duration</li>
                <li>• Core temperature</li>
              </ul>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Behavioral Signatures:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Satisfaction upon consumption</li>
                <li>• Predictable circadian patterns</li>
                <li>• Reduced wanting after consumption</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Intrinsic Motivation <span className="text-teal-600">(I)</span>
              </h3>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Validated Scales:
              </p>
              <ul className="mb-3 space-y-1 text-sm text-gray-600">
                <li>• Intrinsic Motivation Inventory (IMI)</li>
                <li>• Flow State Scale</li>
                <li>• Basic Psychological Needs Scale</li>
              </ul>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Behavioral Signatures:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Time distortion during activity</li>
                <li>• Persistence without external rewards</li>
                <li>• Resistance to overjustification</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Mimetic Desire <span className="text-purple-600">(M)</span>
              </h3>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Experimental Manipulations:
              </p>
              <ul className="mb-3 space-y-1 text-sm text-gray-600">
                <li>• Social observability conditions</li>
                <li>• Model status variations</li>
                <li>• Audience presence/absence</li>
              </ul>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Behavioral Signatures:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Increased wanting after observation</li>
                <li>• Status-dependent valuation</li>
                <li>• Reduction when audience removed</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Experimental Design Principles */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Experimental Design Principles
          </h2>
          <p className="mb-6">
            AIM predictions can be tested through carefully designed experiments
            that isolate motivational sources:
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                1. Manipulate Observability
              </h3>
              <p className="mb-3 text-gray-700">
                Compare behavior under public versus private conditions to isolate
                mimetic effects. If a behavior is mimetically driven, it should
                significantly change when social observation is removed.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Test whether legal settlement rates
                increase when proceedings are sealed versus public (Prediction 8).
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                2. Control for Physiological State
              </h3>
              <p className="mb-3 text-gray-700">
                Ensure participants&apos; appetitive needs are met to isolate
                intrinsic and mimetic motivations. Hungry, tired, or uncomfortable
                participants cannot reliably demonstrate intrinsic engagement.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Standardize meal timing and sleep before
                testing intrinsic motivation interventions in educational settings.
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                3. Sequence Feedback Timing
              </h3>
              <p className="mb-3 text-gray-700">
                Manipulate when different types of feedback are provided to test
                whether timing affects motivational source. AIM predicts that
                private competence feedback before public comparison preserves
                intrinsic motivation.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Compare student engagement when grades are
                provided privately first versus publicly ranked immediately
                (Prediction 10).
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                4. Vary Model Status
              </h3>
              <p className="mb-3 text-gray-700">
                Systematically manipulate the status or attractiveness of social
                models to test whether behavior changes track model characteristics
                rather than objective features of the target.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Test whether food consumption increases
                more when a high-status versus low-status dining companion eats more
                (Prediction 6).
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                5. Longitudinal Tracking
              </h3>
              <p className="mb-3 text-gray-700">
                Track behavior over extended periods (6-12+ months) to distinguish
                temporary effects from stable changes. Mimetic motivations should
                show less persistence than intrinsic motivations.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Compare 12-month retention in exercise
                programs designed for intrinsic enjoyment versus appearance goals
                (Prediction 7).
              </p>
            </div>
          </div>
        </section>

        {/* Statistical Analysis */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Statistical Approaches
          </h2>
          <p className="mb-6">
            Validating AIM predictions requires appropriate statistical methods:
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Mediation Analysis
              </h3>
              <p className="text-gray-600">
                Test whether changes in motivational source (A, I, or M) mediate
                the relationship between interventions and outcomes. This validates
                that the proposed mechanism is actually responsible for observed
                effects.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Moderation Analysis
              </h3>
              <p className="text-gray-600">
                Examine whether individual differences or contextual factors
                moderate the strength of AIM effects. This helps identify boundary
                conditions and populations where predictions are strongest.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Pre-registration
              </h3>
              <p className="text-gray-600">
                All hypothesis tests should be pre-registered with explicit
                predictions, sample sizes, analysis plans, and falsification
                criteria to prevent p-hacking and selective reporting.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Bayesian Methods
              </h3>
              <p className="text-gray-600">
                Use Bayesian statistics to quantify evidence for and against AIM
                predictions, allowing accumulation of evidence across studies rather
                than binary reject/accept decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Domain Validation */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Cross-Domain Validation Strategy
          </h2>
          <p className="mb-6">
            A key test of AIM is whether the same principles generate accurate
            predictions across diverse domains:
          </p>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Within-Domain Replication
              </h3>
              <p className="text-gray-700">
                Test the same prediction using different methods within one domain.
                For example, test mimetic eating effects through confederate
                manipulation, video observation, and naturalistic dining data.
              </p>
            </div>

            <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Cross-Domain Generalization
              </h3>
              <p className="text-gray-700">
                Demonstrate that the same mechanism (e.g., removing audience
                reduces mimetic motivation) works across different contexts:
                education, health, law, organizations, etc.
              </p>
            </div>

            <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Cultural Variation
              </h3>
              <p className="text-gray-700">
                Test whether AIM predictions hold across different cultures,
                accounting for variations in individualism/collectivism while
                maintaining core neural mechanisms.
              </p>
            </div>

            <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Developmental Trajectories
              </h3>
              <p className="text-gray-700">
                Examine how the three motivational sources develop across the
                lifespan and whether predictions vary by age while maintaining
                theoretical consistency.
              </p>
            </div>
          </div>
        </section>

        {/* Falsification Criteria */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Falsification Criteria
          </h2>
          <p className="mb-6">
            Each AIM prediction includes explicit conditions that would falsify it:
          </p>

          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-red-900">
              Framework-Level Falsification
            </h3>
            <p className="mb-4 text-gray-800">
              The AIM Framework as a whole would be falsified if:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-gray-700">
              <li>
                The three proposed motivational sources cannot be reliably
                distinguished using behavioral, physiological, or neural measures
              </li>
              <li>
                Interventions targeting specific sources produce random or opposite
                effects compared to predictions
              </li>
              <li>
                Alternative models consistently provide better predictions without
                requiring the A/I/M distinction
              </li>
              <li>
                Cross-domain predictions fail systematically, suggesting
                domain-specific rather than general mechanisms
              </li>
            </ol>
          </div>
        </section>

        {/* Research Collaboration */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Collaboration & Data Sharing
          </h2>
          <p className="mb-6">
            We encourage open science practices for AIM research:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">📊</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">Open Data</h3>
                <p className="text-gray-700">
                  Share de-identified datasets to enable reanalysis and
                  meta-analysis across studies
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">📝</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">Pre-registration</h3>
                <p className="text-gray-700">
                  Register hypotheses, methods, and analyses before data
                  collection
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">🔬</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">
                  Replication Studies
                </h3>
                <p className="text-gray-700">
                  Actively support direct and conceptual replications of all
                  findings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">🤝</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">
                  Multi-Lab Collaborations
                </h3>
                <p className="text-gray-700">
                  Coordinate large-scale studies across multiple research groups
                  and populations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border-2 border-primary-200 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Ready to Test AIM in Your Research?
          </h2>
          <p className="mb-6 text-gray-700">
            Access detailed research protocols, measurement tools, and
            collaboration opportunities.
          </p>
          <Link
            href="/research-resources"
            className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Get Research Materials
          </Link>
        </section>
      </article>
    </div>
  )
}
