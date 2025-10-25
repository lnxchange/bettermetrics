import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Education',
  description: 'How the AIM Framework designs learning environments that protect curiosity and prevent drift to status competition in educational contexts.',
}

export default function EducationPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Education & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Designing learning environments that protect curiosity and prevent drift to status competition
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
              TODO: Add comprehensive overview of how AIM transforms educational understanding, including key educational phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation for understanding learning and education. 
            By distinguishing between appetitive needs, intrinsic motivations, and mimetic desires, we can better 
            predict and explain learning outcomes, design effective educational environments, and create sustainable learning systems.
          </p>
        </section>

        {/* Key Educational Phenomena */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Educational Phenomena</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add detailed explanations of how AIM explains specific educational phenomena like learning, grading, etc.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intrinsic Motivation in Learning</h3>
              <p className="text-gray-600">
                How curiosity and intrinsic motivation drive deep learning, 
                and why extrinsic rewards can undermine the conditions for genuine understanding.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grading Systems and Mimetic Rivalry</h3>
              <p className="text-gray-600">
                How traditional grading systems create mimetic rivalry that undermines learning, 
                and alternative approaches that support intrinsic motivation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Autonomy and Mastery</h3>
              <p className="text-gray-600">
                How educational environments can support autonomy and mastery while addressing 
                basic appetitive needs (rest, nutrition) that affect learning capacity.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Academic Competition & Status</h3>
              <p className="text-gray-600">
                How academic competition becomes a status game through mimetic desire, 
                leading to both achievement and harmful comparison patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Research Questions</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add specific research questions that AIM can help answer in education, with testable predictions and hypotheses.
            </p>
          </div>
          
          <ul className="space-y-4 text-gray-600">
            <li>• How do different motivational sources affect learning outcomes?</li>
            <li>• What role does intrinsic motivation play in long-term retention?</li>
            <li>• How can we design educational environments that reduce mimetic rivalry?</li>
            <li>• What are the educational implications of protecting intrinsic motivation?</li>
            <li>• How does AIM explain patterns of academic achievement and dropout?</li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Educational Implications</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 font-semibold">
              TODO: Add content about how AIM can inform educational practice, including specific educational interventions that account for different motivational sources.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Curriculum Design</h3>
              <p className="text-gray-600">
                Designing curricula that support intrinsic motivation while addressing basic learning needs.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Assessment Systems</h3>
              <p className="text-gray-600">
                Creating assessment systems that support learning without creating harmful mimetic competition.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Learning Environments</h3>
              <p className="text-gray-600">
                Designing learning environments that protect curiosity and support intrinsic motivation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-50 p-8 rounded-xl border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Educational Research?</h2>
          <p className="text-gray-700 mb-6">
            We're seeking educational researchers to test AIM predictions and explore applications in your field.
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
