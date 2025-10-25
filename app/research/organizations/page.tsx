import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Organizations',
  description: 'How the AIM Framework transforms organizations from status tournaments to mission-driven work through source-specific interventions.',
}

export default function OrganizationsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Organizations & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            From status tournaments to mission-driven work through source-specific interventions
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
              TODO: Add comprehensive overview of how AIM transforms organizational understanding, including key organizational phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding organizational behavior. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain workplace dynamics, design effective organizational structures, and create sustainable work environments.
          </p>
        </section>

        {/* Key Organizational Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Organizational Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific organizational phenomena like culture, leadership, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Organizational Culture and Motivation</h3>
              <p className="text-gray-600">
                How organizational cultures can support intrinsic motivation while addressing 
                basic appetitive needs (fair compensation, work-life balance) that affect performance.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership and Intrinsic Motivation</h3>
              <p className="text-gray-600">
                How leadership styles can either support or undermine intrinsic motivation, 
                and the role of mimetic desire in leadership dynamics.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Dynamics and Mimetic Patterns</h3>
              <p className="text-gray-600">
                How team dynamics are shaped by mimetic patterns of competition and collaboration, 
                and strategies for creating healthier team environments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Status Tournaments vs. Mission-Driven Work</h3>
              <p className="text-gray-600">
                How organizations can shift from status tournaments driven by mimetic desire 
                to mission-driven work supported by intrinsic motivation.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in organizational studies, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect organizational performance?</li>
            <li>• What role does intrinsic motivation play in employee retention and satisfaction?</li>
            <li>• How can we design organizations that reduce harmful mimetic competition?</li>
            <li>• What are the organizational implications of protecting intrinsic motivation?</li>
            <li>• How does AIM explain patterns of organizational culture and change?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Organizational Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform organizational practice, including specific organizational interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Organizational Design</h3>
              <p className="text-gray-600">
                Designing organizational structures that support intrinsic motivation while addressing basic needs.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Leadership Development</h3>
              <p className="text-gray-600">
                Creating leadership development programs that support intrinsic motivation and reduce mimetic rivalry.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Workplace Culture</h3>
              <p className="text-gray-600">
                Designing workplace cultures that protect curiosity and support mission-driven work.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Organizational Research?</h2>
          <p className="text-gray-700 mb-6">
            We're seeking organizational researchers to test AIM predictions and explore applications in your field.
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
