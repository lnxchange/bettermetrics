import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Law',
  description: 'How the AIM Framework defines fairness, justice, and respect through appetitive sufficiency and intrinsic autonomy in legal contexts.',
}

export default function LawPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Law & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Defining fairness, justice, and respect through appetitive sufficiency and intrinsic autonomy
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
              TODO: Add comprehensive overview of how AIM transforms legal understanding, including key legal phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding legal behavior and justice. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain legal outcomes, design fairer contracts, and create more just legal systems.
          </p>
        </section>

        {/* Key Legal Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Legal Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific legal phenomena like contract design, justice, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Justice as Appetitive Sufficiency</h3>
              <p className="text-gray-600">
                How legal justice fundamentally requires meeting basic appetitive needs (food, shelter, safety), 
                and why this forms the foundation of fair legal systems.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contract Design for Motivation Sources</h3>
              <p className="text-gray-600">
                How contracts must account for different motivational sources, 
                from basic appetitive needs to complex mimetic status considerations.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Frameworks and Autonomy</h3>
              <p className="text-gray-600">
                How legal systems can protect intrinsic autonomy while addressing mimetic rivalry 
                and ensuring appetitive sufficiency for all citizens.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Criminal Behavior & Motivation</h3>
              <p className="text-gray-600">
                How criminal behavior often stems from unmet appetitive needs or mimetic rivalry, 
                and how legal responses should address underlying motivational sources.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in law, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect legal compliance?</li>
            <li>• What role does intrinsic motivation play in just legal systems?</li>
            <li>• How can we design contracts that reduce mimetic rivalry?</li>
            <li>• What are the legal implications of protecting intrinsic autonomy?</li>
            <li>• How does AIM explain patterns of criminal behavior?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform legal practice, including specific legal interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Contract Law</h3>
              <p className="text-gray-600">
                Designing contracts that account for different motivational sources and prevent exploitation.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Criminal Justice</h3>
              <p className="text-gray-600">
                Creating justice systems that address underlying motivational sources of criminal behavior.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Frameworks</h3>
              <p className="text-gray-600">
                Designing legal systems that protect intrinsic autonomy while ensuring appetitive sufficiency.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Legal Research?</h2>
          <p className="text-gray-700 mb-6">
            We're seeking legal researchers to test AIM predictions and explore applications in your field.
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
