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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add comprehensive overview of how AIM transforms economic understanding, including key economic phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework proposes a neuroscientifically grounded foundation for understanding economic behavior. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, it could potentially 
            predict and explain market dynamics, consumer behavior, and economic policy outcomes.
          </p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in economics, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect price elasticity?</li>
            <li>• What role does intrinsic motivation play in productivity and innovation?</li>
            <li>• How can we design markets that reduce mimetic rivalry?</li>
            <li>• What are the economic implications of protecting intrinsic motivation?</li>
            <li>• How does AIM explain the persistence of status hierarchies?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Policy Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform economic policy, including specific policy interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Welfare Policy</h3>
              <p className="text-gray-600">
                Designing nutrition interventions that address appetitive needs while reducing harmful mimetic eating.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation Policy</h3>
              <p className="text-gray-600">
                Creating mental health systems that support intrinsic motivation and address mimetic social dynamics.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Market Regulation</h3>
              <p className="text-gray-600">
                Designing healthcare delivery systems that account for different motivational sources in patient behavior.
              </p>
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
