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
