import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import Link from 'next/link'
import { HiArrowRight, HiBeaker, HiLightBulb, HiAcademicCap } from 'react-icons/hi'

export const runtime = 'edge'

const researchAreas = [
  {
    name: 'Economics',
    href: '/research/economics',
    icon: '💰',
    description: 'Endogenous preferences, status goods, and market dynamics explained through three sources of motivation.',
  },
  {
    name: 'Psychology',
    href: '/research/psychology',
    icon: '🧠',
    description: 'Protecting intrinsic motivation, understanding social anxiety, and preventing mimetic pathology.',
  },
  {
    name: 'Health & Policy',
    href: '/research/health-policy',
    icon: '🏥',
    description: 'Separating physiological need from social amplification in public health interventions.',
  },
  {
    name: 'Law',
    href: '/research/law',
    icon: '⚖️',
    description: 'Defining fairness, justice, and respect through appetitive sufficiency and intrinsic autonomy.',
  },
  {
    name: 'Education',
    href: '/research/education',
    icon: '📚',
    description: 'Designing learning environments that protect curiosity and prevent drift to status competition.',
  },
  {
    name: 'Organizations',
    href: '/research/organizations',
    icon: '🏢',
    description: 'From status tournaments to mission-driven work through source-specific interventions.',
  },
  {
    name: 'Marketing',
    href: '/research/marketing',
    icon: '📊',
    description: 'Diagnosing stickiness vs. herd effects to predict brand loyalty and consumer behavior.',
  },
  {
    name: 'Understand Your Motivations',
    href: '/understand-your-motivations',
    icon: '🔍',
    description: 'Explains the AIM Framework on both personal and interpersonal levels',
  },
]

export default function IndexPage() {
  const id = nanoid()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Understanding Human Motivation: A Scientific Framework for Better Decisions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The AIM Motivation Framework reveals why we want what we want—distinguishing three neural sources 
              (Appetites, Intrinsic Motivation, and Mimetic Desire) to transform how we approach economics, 
              psychology, health, law, and policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/about"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center justify-center"
              >
                Explore the Framework <HiArrowRight className="ml-2" />
              </Link>
              <Link 
                href="/understand-your-motivations" 
                className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition inline-flex items-center justify-center"
              >
                Understand Your Motivations <HiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is AIM Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What is the AIM Framework?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A novel synthesis translating contemporary neuroscience into an actionable taxonomy for 
              understanding human choice across all domains of life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Appetites */}
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Appetites <span className="text-amber-600">(A)</span>
              </h3>
              <p className="text-gray-600">
                Physiological needs like hunger, thirst, and fatigue that arise from bodily deficits. 
                Cyclical, state-dependent, and rapidly satisfied.
              </p>
            </div>

            {/* Intrinsic */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Intrinsic Motivation <span className="text-teal-600">(I)</span>
              </h3>
              <p className="text-gray-600">
                Self-endorsed activities valued for their own sake—curiosity, mastery, autonomy, flow. 
                Persist privately and over time.
              </p>
            </div>

            {/* Mimetic */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Mimetic Desire <span className="text-purple-600">(M)</span>
              </h3>
              <p className="text-gray-600">
                Desires shaped by observing others, prestige cues, and social norms. 
                Visibility-sensitive and can create rivalry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AIM Matters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why AIM Matters</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <HiBeaker className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Better Predictions</h3>
              <p className="text-gray-600">
                Explains phenomena from inflation to rivalry. Generates precise, testable predictions 
                that differentiate AIM from existing frameworks.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <HiLightBulb className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practical Applications</h3>
              <p className="text-gray-600">
                From designing fairer contracts to preventing domestic violence, from mental health 
                to organizational culture—AIM provides actionable levers.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <HiAcademicCap className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scientific Rigor</h3>
              <p className="text-gray-600">
                Grounded in neuroscience, validated by behavioral evidence, designed to be testable 
                and falsifiable across disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Research Areas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore how AIM transforms understanding across academic fields
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{area.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  {area.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Explore <HiArrowRight className="ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ask Our AI About the AIM Framework
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Have questions? Our AI chatbot can answer questions about AIM&apos;s applications, 
            predictions, and research across all disciplines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/chat"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Try asking: &ldquo;How does AIM explain status goods?&rdquo; (Sign in required)
            </Link>
          </div>
        </div>
      </section>

      {/* Chat Interface - Hidden by default, shown when user is authenticated */}
      <div className="hidden">
        <Chat id={id} />
      </div>
    </>
  )
}
