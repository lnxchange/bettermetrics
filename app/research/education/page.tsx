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

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Novel Testable Predictions</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Prediction 10: Private-Then-Public Feedback Sequence Preserves Intrinsic Motivation</h3>
              <p className="text-gray-700 mb-3">
                <strong>What AIM Uniquely Predicts:</strong> The SEQUENCE of feedback matters: giving private competence feedback BEFORE any public/comparative feedback will preserve wᵢ, while public-first feedback triggers I-to-M drift.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why This Is Novel:</strong> Educators know &quot;reduce social comparison&quot; but not HOW to sequence feedback. AIM predicts that once wᵢ is established privately, it&apos;s more resistant to mimetic pressure. Tests whether timing of social information affects motivation source.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Test Design:</strong> Students complete challenging task. Condition A: Private competence feedback → 1 week later → class ranking revealed. Condition B: Class ranking revealed → private feedback. Condition C: Private feedback only (control).
                  <br/><strong>Required:</strong> Education partnership, 6-week classroom study
                </div>
                <div>
                  <strong>Timeline:</strong> 6-week classroom study
                  <br/><strong>Status:</strong> Ready for education partnership
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Falsification:</strong> If sequence doesn&apos;t matter, timing mechanism fails
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
            We&apos;re seeking educational researchers to test AIM predictions and explore applications in your field.
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
