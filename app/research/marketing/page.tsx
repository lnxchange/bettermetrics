import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Marketing',
  description: 'How the AIM Framework diagnoses stickiness vs. herd effects to predict brand loyalty and consumer behavior in marketing contexts.',
}

export default function MarketingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Marketing & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Diagnosing stickiness vs. herd effects to predict brand loyalty and consumer behavior
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
              TODO: Add comprehensive overview of how AIM transforms marketing understanding, including key marketing phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding consumer behavior and marketing. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain consumer choices, design effective marketing strategies, and create sustainable brand relationships.
          </p>
        </section>

        {/* Key Marketing Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Marketing Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific marketing phenomena like brand loyalty, viral marketing, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brand Loyalty and Intrinsic Connection</h3>
              <p className="text-gray-600">
                How brands can create genuine intrinsic connections with consumers, 
                leading to lasting loyalty that transcends price and convenience.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Viral Marketing and Mimetic Desire</h3>
              <p className="text-gray-600">
                How viral marketing leverages mimetic desire and social proof, 
                creating herd effects that can be both powerful and unpredictable.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Consumer Segmentation by Motivation</h3>
              <p className="text-gray-600">
                How consumers can be segmented by their dominant motivational sources, 
                from appetitive needs to mimetic status considerations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stickiness vs. Herd Effects</h3>
              <p className="text-gray-600">
                How to distinguish between genuine brand stickiness (intrinsic connection) 
                and temporary herd effects (mimetic desire) in marketing analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in marketing, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect consumer decision-making?</li>
            <li>• What role does intrinsic motivation play in brand loyalty?</li>
            <li>• How can we design marketing campaigns that reduce harmful mimetic effects?</li>
            <li>• What are the marketing implications of protecting intrinsic motivation?</li>
            <li>• How does AIM explain patterns of consumer behavior and brand switching?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Marketing Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform marketing practice, including specific marketing interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Brand Strategy</h3>
              <p className="text-gray-600">
                Designing brand strategies that support intrinsic connection while addressing basic consumer needs.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Campaign Design</h3>
              <p className="text-gray-600">
                Creating marketing campaigns that leverage intrinsic motivation and reduce harmful mimetic effects.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Consumer Analytics</h3>
              <p className="text-gray-600">
                Developing analytics frameworks that distinguish between different motivational sources in consumer behavior.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Marketing Research?</h2>
          <p className="text-gray-700 mb-6">
            We&apos;re seeking marketing researchers to test AIM predictions and explore applications in your field.
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
