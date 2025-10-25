import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Health & Policy',
  description: 'How the AIM Framework explains health behaviors, separates physiological need from social amplification, and informs public health interventions.',
}

export default function HealthPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Health & Policy & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Separating physiological need from social amplification in public health interventions
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
              TODO: Add comprehensive overview of how AIM transforms health policy understanding, including key health phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding health behaviors. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain health outcomes, design effective interventions, and create sustainable health policies.
          </p>
        </section>

        {/* Key Health Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Health Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific health phenomena like obesity, healthcare access, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Obesity: Appetite vs. Mimetic Eating</h3>
              <p className="text-gray-600">
                How obesity interventions must distinguish between genuine appetitive needs and mimetic eating behaviors 
                driven by social comparison and status signaling.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Access & Intrinsic Motivation</h3>
              <p className="text-gray-600">
                How intrinsic motivation drives health-seeking behavior and why extrinsic incentives 
                may undermine long-term health engagement.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Health Status & Mimetic Desire</h3>
              <p className="text-gray-600">
                How health becomes a status symbol through mimetic desire, 
                leading to both positive health behaviors and harmful comparison patterns.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Policy Design for Different Sources</h3>
              <p className="text-gray-600">
                How health policies must account for different motivational sources, 
                from basic appetitive needs to complex mimetic health behaviors.
              </p>
            </div>
          </div>
        </section>

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Novel Testable Predictions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 6: Social Dining Amplifies Intake ONLY When Models Are Eating More</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> Social dining increases food intake <strong>through mimetic mechanisms</strong>, meaning: eating amplifies when observing others eat MORE than baseline, effect disappears when dining companion eats LESS, effect is strongest when the model is high-status/attractive.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Existing research shows &quot;social eating increases intake&quot; but doesn&apos;t test DIRECTION. AIM predicts it&apos;s mimetic (matching the model) not just social presence. Can test by manipulating confederate&apos;s eating behavior.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Participants eat lunch with confederate. Condition A: Confederate eats large portion. Condition B: Confederate eats small portion. Condition C: Eats alone (control).
                  <br/><strong>Required:</strong> Nutrition research partnership, 3-month field study
                </div>
                <div>
                  <strong>Timeline:</strong> 3-month field study
                  <br/><strong>Status:</strong> Seeking nutrition research partnership
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If Condition B = Control, it&apos;s not mimetic but just &quot;social eating&quot;
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 7: Flow-Based Exercise Programs Outperform Appearance-Based Programs at 12+ Months</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> Exercise programs designed around <strong>intrinsic rewards</strong> (mastery, flow, competence) will show better long-term adherence than programs designed around <strong>mimetic rewards</strong> (body image, social comparison, appearance goals).
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Fitness research shows &quot;intrinsic motivation predicts adherence&quot; (established). <strong>AIM adds:</strong> Can DESIGN programs to maximize wᵢ vs wₘ through specific features. Predicts which program elements drive which source.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Two exercise programs: High-I (emphasis on skill progression, optimal challenge, private milestones) vs High-M (before/after photos, group leaderboards, appearance metrics).
                  <br/><strong>Required:</strong> Fitness industry partnership, 12-month longitudinal study
                </div>
                <div>
                  <strong>Timeline:</strong> 12-month longitudinal study
                  <br/><strong>Status:</strong> Seeking fitness industry partnership
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If both programs show equal retention, I vs M design distinction fails
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in health policy, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect health behavior change?</li>
            <li>• What role does intrinsic motivation play in preventive health behaviors?</li>
            <li>• How can we design interventions that reduce harmful mimetic health patterns?</li>
            <li>• What are the policy implications of protecting intrinsic health motivation?</li>
            <li>• How does AIM explain health disparities across different populations?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Policy Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform health policy, including specific policy interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nutrition Policy</h3>
              <p className="text-gray-600">
                Designing nutrition interventions that address appetitive needs while reducing harmful mimetic eating.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mental Health Systems</h3>
              <p className="text-gray-600">
                Creating mental health systems that support intrinsic motivation and address mimetic social dynamics.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Healthcare Delivery</h3>
              <p className="text-gray-600">
                Designing healthcare delivery systems that account for different motivational sources in patient behavior.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Health Policy Research?</h2>
          <p className="text-gray-700 mb-6">
            We&apos;re seeking health policy researchers to test AIM predictions and explore applications in your field.
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
