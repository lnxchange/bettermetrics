import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Psychology',
  description: 'How the AIM Framework explains social anxiety, protects intrinsic motivation, and prevents mimetic pathology in psychological contexts.',
}

export default function PsychologyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Psychology & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Protecting intrinsic motivation, understanding social anxiety, and preventing mimetic pathology
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
              TODO: Add comprehensive overview of how AIM transforms psychological understanding, including key psychological phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding psychological behavior. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain mental health patterns, social dynamics, and therapeutic outcomes.
          </p>
        </section>

        {/* Key Psychological Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Psychological Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific psychological phenomena like social anxiety, flow states, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Social Anxiety & Mimetic Rivalry</h3>
              <p className="text-gray-600">
                How social anxiety emerges from mimetic desire and status competition, 
                and why traditional treatments may miss the underlying motivational source.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flow States & Intrinsic Motivation</h3>
              <p className="text-gray-600">
                How flow states represent pure intrinsic motivation, 
                and why extrinsic rewards can undermine the conditions for flow.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Appetitive Regulation & Mental Health</h3>
              <p className="text-gray-600">
                How unmet appetitive needs (sleep, nutrition) affect decision-making and mental health, 
                and the importance of addressing basic needs in therapy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mimetic Pathology & Addiction</h3>
              <p className="text-gray-600">
                How mimetic desire can become pathological, leading to addiction and compulsive behaviors 
                when social comparison becomes the primary motivational driver.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in psychology, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect therapeutic outcomes?</li>
            <li>• What role does intrinsic motivation play in resilience and recovery?</li>
            <li>• How can we design interventions that reduce mimetic rivalry?</li>
            <li>• What are the psychological implications of protecting intrinsic motivation?</li>
            <li>• How does AIM explain the persistence of social anxiety patterns?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Therapeutic Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform psychological practice, including specific therapeutic interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Social Anxiety Treatment</h3>
              <p className="text-gray-600">
                Designing interventions that address mimetic rivalry while supporting intrinsic social connection.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Motivation-Based Therapy</h3>
              <p className="text-gray-600">
                Creating therapeutic approaches that support intrinsic motivation and address mimetic pathology.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mental Health Systems</h3>
              <p className="text-gray-600">
                Designing mental health delivery systems that account for different motivational sources in patient behavior.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Psychological Research?</h2>
          <p className="text-gray-700 mb-6">
            We&apos;re seeking psychologists to test AIM predictions and explore applications in your field.
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
