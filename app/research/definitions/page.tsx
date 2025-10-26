import { Metadata } from 'next'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'
import { HiCheckCircle, HiLightBulb, HiAcademicCap, HiScale } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'Scientific Definitions Enabled by AIM',
  description: 'If validated, AIM would enable neuroscientifically grounded, cross-disciplinary definitions of Freedom, Respect, Fairness, and Privacy that apply uniformly across all human behavioral fields.',
}

export default function DefinitionsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <StatusBadge variant="pre-empirical" className="mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Scientific Definitions Enabled by AIM
          </h1>
          <p className="text-xl text-gray-600">
            If validated, AIM would enable neuroscientifically grounded, cross-disciplinary definitions 
            that apply uniformly across all human behavioral fields—economics, law, psychology, public policy, and organizational design.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why This Matters
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              Unlike current approaches that rely on philosophical tradition or legal precedent, 
              AIM proposes <strong>neuroscientifically testable</strong> definitions that can apply uniformly 
              across all human behavioral fields—economics, law, psychology, public policy, and 
              organizational design.
            </p>
            <p>
              <strong>Current Problem:</strong> Each field has its own incompatible definition of these concepts:
            </p>
            <ul>
              <li>Economists define freedom as &quot;absence of constraint&quot;</li>
              <li>Psychologists define it as &quot;autonomous motivation&quot;</li>
              <li>Legal scholars define it through constitutional tradition</li>
              <li><strong>These definitions often conflict</strong></li>
            </ul>
            <p>
              <strong>With AIM (if validated):</strong> Single neuroscientific framework with testable, 
              falsifiable definitions and uniform application across all domains.
            </p>
          </div>
        </div>
      </section>

      {/* Core Definitions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Core Scientific Definitions
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Freedom */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <HiCheckCircle className="text-3xl text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">Freedom</h3>
            </div>
            <div className="prose max-w-none">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                <strong>AIM Definition:</strong> The capacity to pursue intrinsically motivated (I) activities 
                without coercion by unmet appetites (A) or mimetic pressure (M).
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-gray-900 mb-2">Why This Matters:</h4>
                <p className="text-gray-700">
                  Current definitions of freedom are either too broad (philosophical) or too narrow (legal). 
                  AIM provides a measurable, neuroscientifically grounded definition that can be operationalized in:
                </p>
                <ul className="mt-2 space-y-1">
                  <li>• Contract law (when is consent truly &quot;free&quot;?)</li>
                  <li>• Labor law (what constitutes workplace freedom?)</li>
                  <li>• Economic policy (when do markets enhance vs constrain freedom?)</li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Testable Prediction:</h4>
                <p className="text-gray-700">
                  Contracts signed under A-deficit (hunger, fatigue) should show higher regret rates 
                  than those signed under A-sufficient states.
                </p>
              </div>
            </div>
          </div>

          {/* Respect */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <HiLightBulb className="text-3xl text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Respect</h3>
            </div>
            <div className="prose max-w-none">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                <strong>AIM Definition:</strong> Recognition and protection of another person&apos;s intrinsic 
                motivations (I) and autonomy, distinct from mere appetitive provision (A) or 
                mimetic status-granting (M).
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-gray-900 mb-2">Why This Matters:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Explains why &quot;respectful&quot; treatment feels different from &quot;nice&quot; treatment</li>
                  <li>• Provides a basis for discrimination law (disrespect = treating I-source preferences as illegitimate)</li>
                  <li>• Distinguishes genuine respect from performative status-granting</li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Testable Prediction:</h4>
                <p className="text-gray-700">
                  Interventions perceived as &quot;disrespectful&quot; will correlate with I-override, 
                  not just A-denial or M-status loss.
                </p>
              </div>
            </div>
          </div>

          {/* Fairness */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <HiScale className="text-3xl text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">Fairness</h3>
            </div>
            <div className="prose max-w-none">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                <strong>AIM Definition:</strong> Distribution of resources and opportunities that:
              </p>
              <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">
                <li>Ensures appetitive sufficiency (A) for all</li>
                <li>Protects intrinsic autonomy (I) for all</li>
                <li>Minimizes mimetic rivalry escalation (M)</li>
              </ol>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-gray-900 mb-2">Why This Matters:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Resolves tensions between &quot;equality&quot; and &quot;equity&quot;</li>
                  <li>• Explains why some inequalities feel fair (I-based achievement) while others don&apos;t (M-based status hoarding)</li>
                  <li>• Provides framework for designing fair institutions across domains</li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Testable Prediction:</h4>
                <p className="text-gray-700">
                  Inequality is tolerated when attributed to I-effort, resisted when attributed to M-positioning.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <HiAcademicCap className="text-3xl text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">Privacy</h3>
            </div>
            <div className="prose max-w-none">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                <strong>AIM Definition:</strong> The right to control observability of one&apos;s activities, 
                particularly the ability to pursue intrinsic motivations (I) without triggering 
                mimetic dynamics (M) or exposing appetitive vulnerabilities (A).
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-gray-900 mb-2">Why This Matters:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Explains why privacy violations feel different depending on what&apos;s exposed (A, I, or M)</li>
                  <li>• Predicts when surveillance harms autonomy vs when transparency helps (removes M-escalation)</li>
                  <li>• Provides basis for privacy law that distinguishes types of information</li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Testable Prediction:</h4>
                <p className="text-gray-700">
                  Privacy violations of I-activities should produce stronger psychological harm 
                  than M-activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uniform Application */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Uniform Application Across Fields
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">In Economics</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Freedom:</strong> Market functioning depends on protecting I-choices from A-coercion and M-herding</li>
              <li><strong>Fairness:</strong> Just compensation must cover A-needs while protecting I-autonomy</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">In Law</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Respect:</strong> Legal standing requires treating parties&apos; I-preferences as legitimate</li>
              <li><strong>Privacy:</strong> Information protection varies by source—A-data most sensitive, M-data least</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">In Psychology</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Freedom:</strong> Mental health requires I-pursuit capacity without A-hijacking or M-anxiety</li>
              <li><strong>Fairness:</strong> Therapeutic justice means restoring I-agency after A/M dysregulation</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">In Public Policy</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Freedom:</strong> Policy should secure A-sufficiency and protect I-space, while managing M-rivalry</li>
              <li><strong>Respect:</strong> Policy respects citizens when it treats I-preferences as data, not obstacles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Revolutionary Impact */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-xl border-2 border-primary-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why This Is Revolutionary
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Current State:</strong> Each field has its own incompatible definition of these concepts, 
              often leading to conflicts and policy failures.
            </p>
            <p>
              <strong>With AIM (if validated):</strong> 
            </p>
            <ul>
              <li>Single neuroscientific framework</li>
              <li>Testable, falsifiable definitions</li>
              <li>Uniform application across all domains</li>
              <li>Mechanistic predictions about when each concept is violated</li>
            </ul>
            <p>
                This would represent the first time in history that concepts like &quot;freedom,&quot; &quot;respect,&quot; 
                &quot;fairness,&quot; and &quot;privacy&quot; could be defined scientifically rather than philosophically, 
                with testable predictions about when they are violated and how to restore them.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Test These Definitions?
          </h2>
          <p className="text-xl mb-6">
            Each definition generates specific, falsifiable predictions that can be tested empirically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/research-resources" 
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View Testable Predictions
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
            >
              Collaborate on Research
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
