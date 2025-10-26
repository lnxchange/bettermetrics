import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Economics',
  description: 'How the AIM Framework explains endogenous preferences, status goods, and market dynamics through three sources of motivation.',
}

export default function EconomicsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Economics & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Understanding endogenous preferences, status goods, and market dynamics through three sources of motivation
          </p>
        </div>
      </section>

      {/* Hypothesis Status Banner */}
      <div className="bg-amber-50 border-t-4 border-amber-400 p-6">
        <div className="max-w-5xl mx-auto flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              These are testable predictions, not established findings.
            </h3>
            <p className="text-gray-700">
              We&apos;re seeking researchers to validate these hypotheses. 
              <Link href="/research-resources" className="text-primary-600 hover:underline ml-2">
                Access research materials →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-lg">
        
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">When Markets Price Blindly: AIM's Revolutionary Economic Insight</h2>
          
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 mb-8">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Standard economic theory assumes markets efficiently aggregate "preferences" into prices. But AIM reveals a critical blind spot: 
              <strong> markets cannot separately price appetitive needs (A), intrinsic values (I), and mimetic wants (M).</strong> 
              When this tri-source distinction disappears, pricing defaults to the only observable signal—mimetic visibility (M).
            </p>
            <p className="text-gray-700">
              This creates systematic market failures with profound implications for policy, inequality, and economic design.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">The Pricing Blind Spot Mechanism</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-2">Appetitive needs (A)</h4>
              <p className="text-sm text-gray-700">Private, variable, and non-observable at market scale</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-800 mb-2">Intrinsic preferences (I)</h4>
              <p className="text-sm text-gray-700">Internal, personal, and resist public display</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">Mimetic signals (M)</h4>
              <p className="text-sm text-gray-700">Public, observable, and easily transmitted</p>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 mb-8">
            <p className="font-semibold text-red-800">
              <strong>Result:</strong> When markets cannot distinguish A from I, they use M as a proxy. This isn&apos;t efficient—it&apos;s structurally blind.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Economic Phenomena Explained</h3>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Housing as Status vs. Shelter</h4>
              <p className="text-gray-700 mb-4">Markets cannot separately price:</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>A-component:</strong> Physical shelter from elements (elastic with income)
                </div>
                <div>
                  <strong>I-component:</strong> Community connection, neighborhood preference
                </div>
                <div>
                  <strong>M-component:</strong> Location prestige, size signaling, architectural status
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <strong>Result:</strong> Essential shelter (A) becomes unaffordable as markets chase status signals (M).
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Healthcare: Necessity vs. Prestige</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>A-component:</strong> Life-sustaining medical care (insulin, emergency treatment)
                </div>
                <div>
                  <strong>I-component:</strong> Preferred treatment approaches, doctor relationships
                </div>
                <div>
                  <strong>M-component:</strong> Elite hospitals, celebrity physicians, medical tourism
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <strong>Result:</strong> Markets price the visible (M), making invisible necessities (A) inaccessible.
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Education: Learning vs. Credentials</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>A-component:</strong> Basic human capital (literacy, numeracy)
                </div>
                <div>
                  <strong>I-component:</strong> Intellectual curiosity, mastery, growth
                </div>
                <div>
                  <strong>M-component:</strong> Elite credentials, status signaling, network access
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <strong>Result:</strong> Credential inflation (M-driven) makes essential education (A) increasingly expensive while undermining genuine learning (I).
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Why This Is Different from Existing Economic Theory</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">Existing Theories</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Behavioral Economics:</strong> People have biases and social preferences</li>
                <li><strong>Veblen/Luxury Goods Theory:</strong> Some goods are bought for status</li>
                <li><strong>Status Goods Literature:</strong> Status signaling explains luxury consumption</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">AIM's Revolutionary View</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Markets structurally cannot see A vs I, so they price M by default</strong></li>
                <li><strong>When pricing goes blind to A/I, ALL goods drift toward M-pricing</strong></li>
                <li><strong>The signaling problem is deeper—it affects necessities when markets can&apos;t observe need</strong></li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Novel Predictions That Differentiate AIM</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-primary-200">
              <h4 className="font-bold text-gray-900 mb-2">1. Predict when products become status goods</h4>
              <p className="text-gray-700">When observability increases (social media, public display), demand shifts from stable/persistent (I) to volatile/trend-sensitive (M)</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-primary-200">
              <h4 className="font-bold text-gray-900 mb-2">2. Predict market failures in essentials</h4>
              <p className="text-gray-700">Markets fail for A-goods when M-signaling is possible (cannot separate "housing as shelter" from "housing as status")</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-primary-200">
              <h4 className="font-bold text-gray-900 mb-2">3. Predict bubble formation</h4>
              <p className="text-gray-700">Asset bubbles form when: high M-visibility + low I/A functional value + mimetic cascade triggers</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-primary-200">
              <h4 className="font-bold text-gray-900 mb-2">4. Predict pricing divergence</h4>
              <p className="text-gray-700">Same functional good commands different prices based on observability context (private vs public purchase)</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-xl border-2 border-primary-200 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Policy Implications</h3>
            <p className="text-gray-700 mb-4">If markets are structurally blind to A vs I needs:</p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Cannot rely on market pricing alone for essentials</strong> (housing, healthcare, basic education)</li>
              <li><strong>Must design "blind" purchasing systems for A-goods</strong> (anonymous, non-status-signaling)</li>
              <li><strong>Credential inflation is predictable and preventable</strong> (reduce M-visibility of credentials)</li>
              <li><strong>Inequality feels unfair when attributable to M</strong> rather than I (explains political economy tensions)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              This isn&apos;t market failure in the traditional sense—it&apos;s measurement failure. Markets efficiently price what they can observe. 
              When they can&apos;t observe A vs I, they default to M. The solution isn&apos;t &quot;more market&quot; or &quot;less market&quot;—it&apos;s designing 
              institutions that preserve A/I/M differentiation.
            </p>
          </div>
        </section>

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Novel Testable Predictions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 1: I-to-M Drift in Product Categories Over Time</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> When a product category transitions from private use (high-I) to public visibility (high-M), demand patterns will shift from <strong>stable & persistent</strong> to <strong>volatile & trend-sensitive</strong>, with different consumer segments sorting into opposite trajectories.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Existing theories can&apos;t predict WHEN products become status goods. AIM predicts visibility/observability drives the transition.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Track productivity software (Notion, Obsidian) as they gain social media presence. Measure early adopters (high-I) vs late adopters (high-M) retention patterns.
                  <br/><strong>Required:</strong> Product analytics data + social media monitoring
                </div>
                <div>
                  <strong>Timeline:</strong> 12-18 months tracking cohorts
                  <br/><strong>Status:</strong> Seeking tech company partnership
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If both groups show identical retention curves, I vs M classification fails
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 2: Mimetic Contagion Requires Observation of GOAL-DIRECTED Action</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> Mimetic transmission requires observing someone <strong>reaching for/pursuing</strong> an object, not just <strong>owning</strong> it. Static ownership displays will produce weaker mimetic effects than dynamic pursuit displays.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> AIM grounds this in <strong>mirror neuron activity</strong> responding to goal-directed actions. Predicts that different content formats have different mimetic potency.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> A/B test social media content: Static images vs videos of pursuing/acquiring products (unboxing, shopping, &quot;just bought&quot;)
                  <br/><strong>Required:</strong> E-commerce platform or influencer partnership
                </div>
                <div>
                  <strong>Timeline:</strong> 4-6 weeks
                  <br/><strong>Status:</strong> Protocol ready for testing
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If no difference, or if static images perform better, mirror-neuron mechanism is wrong
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 3: Appetite Deficits Amplify Mimetic Susceptibility</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> When appetites are dysregulated (hunger, sleep deprivation, fatigue), mimetic desire&apos;s weight (wₘ) increases relative to intrinsic motivation (wᵢ), making people MORE susceptible to social influence and LESS capable of autonomous choice.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Existing theories treat physiological states and social influence as separate. AIM predicts they INTERACT through the common-currency system.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Manipulate appetite state (fasted 14 hours vs well-fed), expose to social proof, measure conformity to social proof in product/service choices
                  <br/><strong>Required:</strong> Lab setting, 100+ participants
                </div>
                <div>
                  <strong>Timeline:</strong> Single session
                  <br/><strong>Status:</strong> Ready for lab implementation
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If appetite state doesn&apos;t affect conformity, wₐ-wₘ interaction fails
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Status Goods & Mimetic Desire</h3>
              <p className="text-gray-600">
                Luxury goods, positional consumption, and status signaling as manifestations of mimetic desire. 
                Explains why some goods become more valuable as they become more exclusive.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entrepreneurship & Intrinsic Motivation</h3>
              <p className="text-gray-600">
                How intrinsic motivation drives innovation and entrepreneurial activity, 
                and why extrinsic rewards can undermine creative problem-solving.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Basic Needs & Market Demand</h3>
              <p className="text-gray-600">
                How physiological needs create inelastic demand for essential goods and services, 
                and the economic implications of unmet appetitive needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market Bubbles & Herding</h3>
              <p className="text-gray-600">
                How mimetic desire creates herding behavior in financial markets, 
                leading to bubbles and subsequent crashes when mimetic momentum reverses.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Specific Research Questions AIM Enables</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Price Elasticity by Motivation Source</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Does price elasticity differ systematically for A-driven vs I-driven vs M-driven demand?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> A-goods show inelastic demand curves; M-goods show elastic demand with visibility
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Manipulate observability of purchase and measure price sensitivity
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation and Intrinsic Motivation</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Do firms with higher I-weight in workforce (measured via work preference surveys) show greater innovation output?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> I-driven work environments produce more novel solutions than M-driven (status tournament) environments
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Compare patent quality/novelty across firms with different motivational climates
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Design to Reduce Mimetic Rivalry</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Can "blind" purchasing systems (hidden from social observation) reduce M-inflation for essential goods?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> Anonymous purchasing for healthcare/housing should reduce status premium, improve A-access
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Compare pricing in observable vs blind market mechanisms for same goods
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protecting Intrinsic Motivation in Economic Policy</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Do subsidy designs that emphasize autonomy (flexible use) vs control (specified use) produce different long-term behaviors?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> Autonomy-preserving subsidies maintain I-motivation; controlling subsidies shift to M-gaming
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Randomized policy experiment with flexible vs rigid subsidy structures
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Status Hierarchy Persistence</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Why do some status hierarchies persist despite economic changes? AIM predicts: When M-markers are visible and scarce, mimetic convergence creates self-reinforcing hierarchy
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> Introducing multiple status dimensions (diversified recognition) reduces hierarchy rigidity
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Organizational field studies with different status recognition systems
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Entrepreneurship Success Factors</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Do founders with high I-motivation (measured pre-founding) show better long-term venture performance than M-motivated founders?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> I-driven founders persist through setbacks; M-driven founders exit when social proof weakens
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Longitudinal study of entrepreneur motivation profiles and venture outcomes
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Needs and Market Participation</h3>
              <p className="text-gray-700 mb-3">
                <strong>Research Question:</strong> Does ensuring A-sufficiency (housing, food security) increase market participation quality (better matching, more entrepreneurship)?
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Testable prediction:</strong> A-deficit creates short-term thinking and reduces I-capacity for long-term market engagement
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Test design:</strong> Universal basic services pilot with market participation tracking
              </p>
            </div>
          </div>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Economic Policy Implications</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Welfare Policy: Separating A from M</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 mb-2">The Problem</h4>
                  <p className="text-gray-700">Current welfare systems conflate appetitive provision (A) with status concerns (M), creating stigma that prevents A-access.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">AIM-Informed Approach</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Universal basic services for A-goods:</strong> Housing, healthcare, nutrition provided universally (removes M-stigma)</li>
                    <li><strong>Separate delivery from status signaling:</strong> Anonymous access to A-essentials (no visible markers of recipient status)</li>
                    <li><strong>Preserve I-autonomy in delivery:</strong> Choice within A-provision (avoid paternalistic control that undermines I)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Test design:</strong> Compare welfare uptake and health outcomes between stigmatized means-tested programs vs universal anonymous provision
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation Policy: Protecting I-Space</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 mb-2">The Problem</h4>
                  <p className="text-gray-700">Innovation policy often emphasizes M-rewards (prizes, prestige, status) which can undermine I-motivation for long-term research.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">AIM-Informed Approach</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Create protected I-spaces:</strong> Research funding with minimal reporting/visibility requirements</li>
                    <li><strong>Delay M-evaluation:</strong> Allow private exploration before public assessment (sequence matters)</li>
                    <li><strong>Diversify recognition dimensions:</strong> Prevent mimetic convergence on single "top researcher" metric</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Test design:</strong> Compare innovation output from protected I-funding vs high-visibility competitive grants
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Regulation: When Markets Go Blind</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 mb-2">The Problem</h4>
                  <p className="text-gray-700">Markets cannot price what they cannot observe. For A/I needs that lack visible signals, M-pricing dominates.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">AIM-Informed Approach</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Identify "blind markets":</strong> Essential goods where A/I needs are private but M-signaling is possible (housing, healthcare, education)</li>
                    <li><strong>Design "visibility-reducing" mechanisms:</strong> Anonymous purchasing, blind bidding, private access for A-essentials</li>
                    <li><strong>Separate M-markets from A-markets:</strong> Allow status goods to exist separately from essential goods markets</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Test design:</strong> Compare pricing and access in observable vs anonymous market structures for same essential goods
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Example: Housing Policy</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Current approach</h4>
                    <p className="text-sm text-gray-700">Market pricing assumes "housing demand" is unitary</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">AIM diagnosis</h4>
                    <p className="text-sm text-gray-700">Market cannot distinguish A (shelter need) from I (community preference) from M (location status)</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">AIM-informed intervention</h4>
                  <ol className="space-y-1 text-sm text-gray-700">
                    <li><strong>Universal basic housing (A-provision):</strong> Sufficient shelter for all, non-means-tested, anonymous access</li>
                    <li><strong>Neighborhood choice (I-protection):</strong> Options within sufficient housing to preserve autonomy</li>
                    <li><strong>Separate luxury market (M-containment):</strong> Allow status housing to exist without inflating A-essentials</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Expected outcome:</strong> A-access improves, I-autonomy preserved, M-inflation contained to luxury segment
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Example: Healthcare Policy</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Current approach</h4>
                    <p className="text-sm text-gray-700">Insurance-based system tries to price all healthcare uniformly</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">AIM diagnosis</h4>
                    <p className="text-sm text-gray-700">Cannot distinguish A (life-sustaining care) from I (treatment preferences) from M (prestige providers)</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">AIM-informed intervention</h4>
                  <ol className="space-y-1 text-sm text-gray-700">
                    <li><strong>Universal A-care:</strong> Essential health services (insulin, emergency care) provided universally without status markers</li>
                    <li><strong>I-preserved choice:</strong> Options for treatment approach and provider relationships within essential care</li>
                    <li><strong>M-separated elective care:</strong> Concierge medicine, cosmetic procedures priced separately in transparent status market</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Expected outcome:</strong> A-needs met regardless of means, I-autonomy preserved in treatment, M-inflation doesn't block A-access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Markets Going Blind Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">When Markets Go Blind: AIM's Most Radical Economic Prediction</h2>
          
          <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Core Problem</h3>
            <div className="prose prose-lg max-w-none">
              <p>
                Standard economic theory assumes prices reflect "preferences" without distinguishing 
                between appetitive needs (A), intrinsic values (I), and mimetic wants (M).
              </p>
              <p>
                <strong>AIM predicts this creates systematic market failures because:</strong>
              </p>
              <ol>
                <li>Prices cannot separately signal A vs I vs M value</li>
                <li>When blind to A/I distinction, markets use M (observability) as proxy</li>
                <li>This creates perverse pricing dynamics</li>
              </ol>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Observable Manifestations</h3>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Housing Markets</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>A-component:</strong> Need shelter from elements
                  </div>
                  <div>
                    <strong>I-component:</strong> Desire for specific neighborhood/community
                  </div>
                  <div>
                    <strong>M-component:</strong> Status signaling through location/size
                  </div>
                </div>
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <strong>Market failure:</strong> Pricing driven by M, leaving A unmet for many
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Healthcare</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>A-component:</strong> Physiological needs (insulin, emergency care)
                  </div>
                  <div>
                    <strong>I-component:</strong> Preference for specific treatments/providers
                  </div>
                  <div>
                    <strong>M-component:</strong> Prestige hospitals, celebrity doctors
                  </div>
                </div>
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <strong>Market failure:</strong> M-pricing makes A-essential care unaffordable
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Education</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>A-component:</strong> Basic literacy/numeracy (human capital need)
                  </div>
                  <div>
                    <strong>I-component:</strong> Curiosity, mastery, intellectual growth
                  </div>
                  <div>
                    <strong>M-component:</strong> Elite credentials, status signaling
                  </div>
                </div>
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <strong>Market failure:</strong> M-inflation (credential arms race) crowds out I and makes A inaccessible
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why This Is Revolutionary</h3>
            <div className="prose prose-lg max-w-none">
              <p>
                <strong>Existing Economic Theory Says:</strong> Markets efficiently aggregate preferences
              </p>
              <p>
                <strong>AIM Says:</strong> Markets can only price observability. When A and I needs are 
                private/invisible, markets price M-signals by default. This is not efficient—it&apos;s structurally blind.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Testable Predictions</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">1. Price-to-observability correlation</h4>
                <p className="text-gray-700">
                  Products that transition from private (I) to public (M) use should show price inflation 
                  disconnected from functional value
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">2. Essential goods market failure</h4>
                <p className="text-gray-700">
                  Markets systematically fail for A-goods when M-signaling is possible (luxury vs necessity healthcare)
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">3. Bubble prediction</h4>
                <p className="text-gray-700">
                  Asset bubbles should correlate with high M-visibility + low I/A functional value 
                  (tulips, crypto, meme stocks)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Policy Implications</h3>
            <div className="prose prose-lg max-w-none">
              <p>
                If validated, this means:
              </p>
              <ul>
                <li><strong>Cannot rely on market pricing for A-essential goods</strong> (need regulation/subsidy)</li>
                <li><strong>Must separate M-signaling from A/I provision</strong> (anonymous markets for essentials)</li>
                <li><strong>Credential inflation is predictable</strong> (whenever education becomes visible status signal)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Economic Research?</h2>
          <p className="text-gray-700 mb-6">
            We&apos;re seeking economists to test AIM predictions and explore applications in your field.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contact Us to Collaborate
          </Link>
        </section>
      </article>
    </div>
  )
}
