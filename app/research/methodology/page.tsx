import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Research Methodology',
  description:
    'How to test, validate, and apply the AIM Framework with scientific rigor through observability manipulation and motivational source isolation.'
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
            Testing the AIM Framework through observability manipulation and source isolation
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
        {/* Core Methodological Insight */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            The Central Test: Persistence in Private
          </h2>

          <div className="mb-6 rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
            <h3 className="mb-4 text-2xl font-bold text-teal-900">
              Intrinsic Motivation Persists When Unobserved
            </h3>
            <p className="mb-4 text-gray-700">
              The defining characteristic of intrinsic motivation is that it
              <strong> persists in private</strong>—when there&apos;s no audience, no
              social signaling, no status competition. Measuring output of unobserved
              activities is how we test for true intrinsic engagement.
            </p>
            <div className="space-y-3 rounded-lg border border-teal-300 bg-white p-4">
              <p className="font-semibold text-gray-900">The Three Signatures:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Appetites (A):</strong> Cyclical, satiable, state-dependent
                  — behavior stops when physiological need is met
                </li>
                <li>
                  <strong>Intrinsic Motivation (I):</strong> Persists in private,
                  autonomy-aligned, context-independent — behavior continues without
                  observation
                </li>
                <li>
                  <strong>Mimetic Desire (M):</strong> Observability-sensitive,
                  rivalry-prone — behavior decreases or stops when audience is removed
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
            <h3 className="mb-3 text-xl font-bold text-purple-900">
              Why This Matters
            </h3>
            <p className="text-gray-700">
              Traditional motivation research struggles to distinguish intrinsic
              engagement from status-seeking because both can look identical under
              observation. AIM solves this by manipulating observability: If behavior
              persists when made private, it was intrinsic. If it drops, it was mimetic.
            </p>
          </div>
        </section>

        {/* Distinguishing the Three Sources */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Distinguishing A, I, and M: Three Methods
          </h2>

          <div className="mb-8 space-y-6">
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Method 1: Measure Physiological State <span className="text-amber-600">(for A)</span>
              </h3>
              <p className="mb-4 text-gray-700">
                Appetitive motivation is state-dependent and physiologically measurable.
                Control for basic needs to isolate I and M.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-900">Physiological Markers:</p>
                <ul className="ml-6 list-disc space-y-1 text-gray-600">
                  <li>Glucose levels, hydration status</li>
                  <li>Sleep duration and quality</li>
                  <li>Core temperature regulation</li>
                  <li>Circadian rhythm patterns</li>
                </ul>
                <p className="font-semibold text-gray-900 mt-3">Behavioral Signatures:</p>
                <ul className="ml-6 list-disc space-y-1 text-gray-600">
                  <li>Satisfaction upon consumption (behavior stops when sated)</li>
                  <li>Predictable cyclical patterns</li>
                  <li>Reduced wanting after physiological need is met</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Method 2: Manipulate Observability <span className="text-teal-600">(for I vs M)</span>
              </h3>
              <p className="mb-4 text-gray-700">
                This is the critical test. Compare behavior under public versus private
                conditions to isolate intrinsic from mimetic motivation.
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border border-teal-300 bg-white p-4">
                  <p className="mb-2 font-semibold text-gray-900">Experimental Design:</p>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li>
                      <strong>Condition A (Public):</strong> Activity is observable,
                      visible to others, status-relevant
                    </li>
                    <li>
                      <strong>Condition B (Private):</strong> Same activity,
                      completely unobserved, no social signaling possible
                    </li>
                    <li>
                      <strong>Measure:</strong> Time spent, effort exerted, output
                      produced, persistence over time
                    </li>
                  </ol>
                </div>
                <div className="rounded-lg bg-teal-100 p-4">
                  <p className="font-semibold text-teal-900">Predicted Outcomes:</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>
                      • <strong>If I-dominated:</strong> No decrease (or slight
                      increase) in private condition
                    </li>
                    <li>
                      • <strong>If M-dominated:</strong> Significant decrease in
                      private condition
                    </li>
                    <li>
                      • <strong>If mixed:</strong> Partial decrease reveals relative
                      weights w<sub>I</sub> and w<sub>M</sub>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Method 3: Longitudinal Tracking <span className="text-purple-600">(for stability)</span>
              </h3>
              <p className="mb-4 text-gray-700">
                Intrinsic motivation shows stable persistence over time (6-12+ months),
                while mimetic motivation tracks social context and shows volatility.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">Track Over Time:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Engagement levels without external rewards</li>
                  <li>Response to social context changes</li>
                  <li>Stability across different environments</li>
                  <li>Resistance to mimetic triggers</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Calculating Mimetic Premium */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Calculating the Mimetic Premium
          </h2>
          <p className="mb-6 text-gray-700">
            A key empirical method for quantifying motivational sources is decomposing
            prices and valuations into appetitive (A), intrinsic (I), and mimetic (M)
            components.
          </p>

          <div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              The Mimetic Premium (V<sub>M</sub>)
            </h3>
            <p className="mb-4 text-gray-700">
              The excess value paid for social signaling, separate from basic need
              satisfaction and intrinsic quality. This reveals how much of a price is
              driven by status competition versus actual use value.
            </p>
            <div className="rounded-lg border border-red-300 bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Example: Premium Bottled Water
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Total Price:</strong> $5.00
                </li>
                <li className="ml-4">
                  <span className="text-green-600">A-component (Appetite):</span> $0.50
                  — basic hydration value
                </li>
                <li className="ml-4">
                  <span className="text-blue-600">I-component (Intrinsic):</span> ~$0.00
                  — negligible (no process joy in drinking water)
                </li>
                <li className="ml-4">
                  <span className="text-red-600">M-component (Mimetic):</span> $4.50
                  — brand status, social signaling
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Method 1: Observability Price Premium
              </h3>
              <p className="mb-3 text-gray-700">
                Compare willingness-to-pay for identical products under public versus
                private consumption conditions.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Design:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>
                    <strong>Condition A (Public):</strong> Product will be visibly
                    consumed in social setting
                  </li>
                  <li>
                    <strong>Condition B (Private):</strong> Product consumed alone,
                    not visible to others
                  </li>
                  <li>
                    <strong>Measure:</strong> Maximum willingness-to-pay in each
                    condition
                  </li>
                  <li>
                    <strong>Calculate:</strong> Mimetic Premium = WTP<sub>public</sub>{' '}
                    - WTP<sub>private</sub>
                  </li>
                </ol>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Prediction:</strong> Products with high M-components (luxury
                brands, status goods) show large price premiums in public conditions.
                I-driven products show minimal or no premium.
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Method 2: Hedonic Price Decomposition
              </h3>
              <p className="mb-3 text-gray-700">
                Use regression analysis to isolate the contribution of functional
                attributes (A+I) versus brand/status attributes (M).
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Approach:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>
                    1. Identify functional attributes (nutritional value, durability,
                    performance specs)
                  </li>
                  <li>
                    2. Identify status attributes (brand prestige, celebrity
                    endorsement, exclusivity)
                  </li>
                  <li>
                    3. Regress price on both sets of attributes
                  </li>
                  <li>
                    4. V<sub>M</sub> = coefficient on status attributes × attribute
                    level
                  </li>
                </ol>
              </div>
            </div>

            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Method 3: Experimental Valuation Under Anonymity
              </h3>
              <p className="mb-3 text-gray-700">
                Manipulate whether purchases are anonymous or publicly visible, then
                measure valuation changes.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Protocol:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    • <strong>Baseline:</strong> Elicit WTP for products in standard
                    marketplace conditions
                  </li>
                  <li>
                    • <strong>Anonymous condition:</strong> Guarantee that purchase is
                    completely private (unmarked packaging, no receipts, anonymous
                    payment)
                  </li>
                  <li>
                    • <strong>Public condition:</strong> Purchase visible to relevant
                    social group
                  </li>
                  <li>
                    • <strong>Compare:</strong> Valuation changes reveal M-component
                    sensitivity
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Applications of Mimetic Premium Measurement
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>Market analysis:</strong> Predict price sensitivity to
                  social visibility changes
                </li>
                <li>
                  • <strong>Brand positioning:</strong> Quantify how much value comes
                  from status versus quality
                </li>
                <li>
                  • <strong>Consumer segmentation:</strong> Identify high-M versus
                  high-I consumer segments
                </li>
                <li>
                  • <strong>Pricing strategy:</strong> Test whether premium pricing is
                  justified by functional value or requires social signaling
                </li>
                <li>
                  • <strong>Product categories:</strong> Map entire industries by
                  A/I/M composition (e.g., luxury goods = high M, tools = high I,
                  groceries = high A)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Validated Measurement Tools */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Validated Measurement Scales
          </h2>
          <p className="mb-6 text-gray-700">
            Combine observability manipulation with validated psychological scales
            for robust measurement:
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                For Intrinsic Motivation (I)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Intrinsic Motivation Inventory (IMI)</li>
                <li>• Flow State Scale</li>
                <li>• Basic Psychological Needs Scale (autonomy subscale)</li>
                <li>• Self-Determination Index</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Behavioral indicators:</strong> Time distortion during activity,
                persistence without rewards, resistance to overjustification effect
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                For Mimetic Desire (M)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Social Comparison Orientation Scale</li>
                <li>• Status-Seeking Scale</li>
                <li>• Observability sensitivity measures (custom)</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Experimental manipulations:</strong> Model status variations,
                audience presence/absence, visibility conditions
              </p>
            </div>
          </div>
        </section>

        {/* Core Experimental Designs */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Five Core Experimental Designs
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                1. Private-Then-Public Sequence
              </h3>
              <p className="mb-3 text-gray-700">
                Test whether the SEQUENCE of feedback affects motivational source.
                AIM predicts that establishing private competence before introducing
                social comparison preserves intrinsic motivation.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Design:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Condition A:</strong> Private competence feedback → 1
                    week later → public ranking
                  </li>
                  <li>
                    <strong>Condition B:</strong> Public ranking → private feedback
                  </li>
                  <li>
                    <strong>Condition C:</strong> Private feedback only (control)
                  </li>
                  <li>
                    <strong>Measure:</strong> Subsequent engagement when made fully
                    private (6 weeks later)
                  </li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If Condition A performs like Condition
                B, sequence timing doesn&apos;t matter (w<sub>I</sub> protection fails)
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                2. Audience Removal Test
              </h3>
              <p className="mb-3 text-gray-700">
                Compare performance/engagement before and after removing social
                observation. The drop in output reveals mimetic weight.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Design:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Phase 1:</strong> Public activity with audience/ranking
                    (baseline)
                  </li>
                  <li>
                    <strong>Phase 2:</strong> Same activity, completely private
                    (no visibility)
                  </li>
                  <li>
                    <strong>Measure:</strong> % change in time, effort, output
                  </li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Example applications:</strong> Legal settlements (sealed vs
                public), exercise programs (solo vs group), work output (remote vs office)
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                3. Model Status Manipulation
              </h3>
              <p className="mb-3 text-gray-700">
                Vary the status of social models to test whether behavior change
                tracks model characteristics rather than object attributes (mimetic
                mechanism).
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Design:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Condition A:</strong> High-status model demonstrates choice
                  </li>
                  <li>
                    <strong>Condition B:</strong> Low-status model demonstrates same
                    choice
                  </li>
                  <li>
                    <strong>Condition C:</strong> No model (control)
                  </li>
                  <li>
                    <strong>Measure:</strong> Adoption rate and persistence
                  </li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If status makes no difference, mimetic
                transmission claim fails
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                4. Appetitive Control Protocol
              </h3>
              <p className="mb-3 text-gray-700">
                Ensure physiological needs are met before testing I vs M to prevent
                appetitive deficits from confounding results.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">
                  Standardize Before Testing:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Meal timing (test 2-3 hours after eating)</li>
                  <li>• Sleep duration (minimum 7 hours)</li>
                  <li>• Hydration status</li>
                  <li>• Environmental comfort (temperature, noise)</li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Why critical:</strong> Hungry, tired, or uncomfortable
                participants cannot reliably demonstrate intrinsic engagement
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                5. Longitudinal Stability Test
              </h3>
              <p className="mb-3 text-gray-700">
                Track behavior over 6-12+ months to distinguish stable intrinsic
                engagement from volatile mimetic patterns.
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Design:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>High-I condition:</strong> Design emphasizing skill
                    progression, private milestones, autonomy
                  </li>
                  <li>
                    <strong>High-M condition:</strong> Design emphasizing leaderboards,
                    social comparison, status markers
                  </li>
                  <li>
                    <strong>Measure:</strong> 6-month and 12-month retention curves
                  </li>
                </ul>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If both show identical retention,
                I vs M classification fails
              </p>
            </div>
          </div>
        </section>

        {/* Statistical Approaches */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Statistical Analysis Methods
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Mediation Analysis
              </h3>
              <p className="text-gray-700">
                Test whether changes in motivational source (w<sub>A</sub>, w
                <sub>I</sub>, or w<sub>M</sub>) mediate the relationship between
                interventions and outcomes. This validates that the proposed mechanism
                is actually responsible for observed effects.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Within-Subject Designs
              </h3>
              <p className="text-gray-700">
                Use participants as their own controls when manipulating observability.
                Measure the same person&apos;s behavior under public and private
                conditions to isolate mimetic effects while controlling for individual
                differences.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Pre-registration Required
              </h3>
              <p className="text-gray-700">
                All hypothesis tests must be pre-registered with explicit predictions,
                sample sizes, analysis plans, and falsification criteria to prevent
                p-hacking and selective reporting. Include predicted effect sizes.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Bayesian Evidence Accumulation
              </h3>
              <p className="text-gray-700">
                Use Bayesian statistics to quantify evidence for and against AIM
                predictions, allowing accumulation across studies rather than binary
                reject/accept decisions. Report Bayes Factors for each prediction.
              </p>
            </div>
          </div>
        </section>

        {/* Framework-Level Falsification */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Framework-Level Falsification Criteria
          </h2>

          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-red-900">
              The AIM Framework Would Be Falsified If:
            </h3>
            <ol className="list-decimal space-y-3 pl-6 text-gray-700">
              <li>
                <strong>The three sources cannot be reliably distinguished:</strong> If
                manipulating observability, controlling physiological state, and
                longitudinal tracking fail to produce consistent separations between A,
                I, and M, the framework lacks empirical grounding.
              </li>
              <li>
                <strong>Private behavior shows no persistence pattern:</strong> If
                removing observation has random or inconsistent effects on behavior
                (rather than consistently revealing I vs M), the core distinction fails.
              </li>
              <li>
                <strong>Interventions targeting specific sources produce opposite
                effects:</strong> If removing audience increases mimetic behavior, or
                if meeting appetitive needs decreases intrinsic engagement, the causal
                mechanisms are wrong.
              </li>
              <li>
                <strong>Cross-domain predictions systematically fail:</strong> If the
                same mechanisms (e.g., observability manipulation) work in one domain
                (education) but fail in others (health, law, organizations), the
                framework isn&apos;t general.
              </li>
              <li>
                <strong>Alternative models consistently outperform AIM:</strong> If
                simpler models (single motivation source, or traditional utility) make
                better predictions without the A/I/M distinction, Occam&apos;s razor
                favors the alternative.
              </li>
            </ol>
          </div>
        </section>

        {/* Cross-Domain Validation */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Cross-Domain Validation Strategy
          </h2>
          <p className="mb-6 text-gray-700">
            A critical test of AIM is whether the same observability manipulations
            produce consistent results across diverse domains:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Education Domain
              </h3>
              <p className="text-sm text-gray-700">
                Does removing public ranking increase intrinsic learning engagement?
                Test with private-then-public feedback sequence.
              </p>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">Health Domain</h3>
              <p className="text-sm text-gray-700">
                Does removing social visibility increase exercise persistence? Test
                flow-based vs appearance-based program retention.
              </p>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">Legal Domain</h3>
              <p className="text-sm text-gray-700">
                Does sealing proceedings increase settlement rates? Test public vs
                confidential mediation outcomes.
              </p>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                Organizational Domain
              </h3>
              <p className="text-sm text-gray-700">
                Does reducing visibility of individual metrics decrease rivalry? Test
                private vs public performance feedback.
              </p>
            </div>
          </div>

          <p className="mt-6 text-gray-700">
            <strong>Validation requirement:</strong> The same mechanism (audience
            removal reducing M-driven behavior) must work across ALL domains for the
            framework to be considered validated.
          </p>
        </section>

        {/* Open Science */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Open Science Commitments
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">📊</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">Open Data</h3>
                <p className="text-gray-700">
                  Share de-identified datasets including all observability
                  manipulations, physiological measurements, and longitudinal tracking
                  to enable reanalysis and meta-analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">📝</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">Pre-registration</h3>
                <p className="text-gray-700">
                  Register all hypotheses, methods, and analyses before data
                  collection, including predicted effect sizes for observability
                  manipulations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">🔬</div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">
                  Direct Replications
                </h3>
                <p className="text-gray-700">
                  Actively support exact replications of observability experiments
                  across different labs and populations
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
                  Coordinate large-scale studies testing the same observability
                  manipulations across multiple domains simultaneously
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
            Access detailed protocols for observability manipulation experiments,
            measurement tools, and collaboration opportunities.
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
