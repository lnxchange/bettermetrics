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

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Novel Testable Predictions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 8: Audience-Removal Reduces Settlement Resistance</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> Legal disputes escalate partly because <strong>mimetic dynamics</strong> (status, pride, &quot;winning&quot;) inflate when cases are public. Removing audiences (sealed proceedings, confidential mediation) should increase settlement rates by 30-50%.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Legal scholars know &quot;ADR works&quot; but don&apos;t have a mechanistic explanation. AIM predicts it&apos;s because <strong>wₘ drops</strong> when observability is removed. Can test by manipulating visibility of dispute resolution processes.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Compare settlement rates: High visibility (public filings, open courtrooms) vs Low visibility (sealed proceedings, private mediation). Control for case type, stakes, parties.
                  <br/><strong>Required:</strong> Law firm/court data partnership, archival analysis of 500+ cases
                </div>
                <div>
                  <strong>Timeline:</strong> Archival analysis of 500+ cases
                  <br/><strong>Status:</strong> Seeking law firm/court data partnership
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If visibility makes no difference, mimetic escalation claim fails
              </p>
            </div>
            
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 9: Opt-Out Rights Reduce Contract Breaches in Crunch Situations</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> Contracts that include <strong>explicit opt-out clauses</strong> for high-stress periods (crunch time) will have LOWER breach rates and HIGHER voluntary compliance than rigid contracts, because they preserve intrinsic agency and prevent mimetic rivalry escalation.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Contract theory focuses on enforcement mechanisms. AIM predicts that <strong>preserving freedom</strong> (ability to retreat from mimetic pressure) reduces conflict. Tests whether &quot;softer&quot; contracts actually perform better.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Compare two contract types in project-based work: Rigid (no opt-out, fixed deadlines, penalties) vs Flexible (explicit opt-out rights, renegotiation triggers, recovery periods).
                  <br/><strong>Required:</strong> Legal data from project-based industries, 12-month contract performance tracking
                </div>
                <div>
                  <strong>Timeline:</strong> 12-month contract performance tracking
                  <br/><strong>Status:</strong> Seeking legal data from project-based industries
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If rigid contracts perform better, AIM&apos;s freedom/opt-out mechanism fails
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
            We&apos;re seeking legal researchers to test AIM predictions and explore applications in your field.
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
