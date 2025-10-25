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
            The AIM Framework provides a neuroscientifically grounded foundation for understanding economic behavior. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain market dynamics, consumer behavior, and economic policy outcomes.
          </p>
        </section>

        {/* Key Economic Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Economic Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific economic phenomena like status goods, bubbles, entrepreneurship, etc.
            </p>
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
            We're seeking economists to test AIM predictions and explore applications in your field.
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
