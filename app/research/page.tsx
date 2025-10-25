import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'Research Areas',
  description: 'Explore how the AIM Framework transforms understanding across academic fields and disciplines.',
}

const researchAreas = [
  {
    name: 'Economics',
    href: '/research/economics',
    icon: '💰',
    description: 'Endogenous preferences, status goods, and market dynamics explained through three sources of motivation.',
    keyInsights: [
      'Status goods as mimetic desire',
      'Intrinsic motivation in entrepreneurship',
      'Appetitive needs in consumer behavior'
    ]
  },
  {
    name: 'Psychology',
    href: '/research/psychology',
    icon: '🧠',
    description: 'Protecting intrinsic motivation, understanding social anxiety, and preventing mimetic pathology.',
    keyInsights: [
      'Social anxiety as mimetic rivalry',
      'Flow states and intrinsic motivation',
      'Appetitive regulation and mental health'
    ]
  },
  {
    name: 'Health & Policy',
    href: '/research/health-policy',
    icon: '🏥',
    description: 'Separating physiological need from social amplification in public health interventions.',
    keyInsights: [
      'Obesity: appetite vs. mimetic eating',
      'Healthcare access and intrinsic motivation',
      'Policy design for different sources'
    ]
  },
  {
    name: 'Law',
    href: '/research/law',
    icon: '⚖️',
    description: 'Defining fairness, justice, and respect through appetitive sufficiency and intrinsic autonomy.',
    keyInsights: [
      'Contract design for motivation sources',
      'Legal frameworks and autonomy',
      'Justice as appetitive sufficiency'
    ]
  },
  {
    name: 'Education',
    href: '/research/education',
    icon: '📚',
    description: 'Designing learning environments that protect curiosity and prevent drift to status competition.',
    keyInsights: [
      'Intrinsic motivation in learning',
      'Grading systems and mimetic rivalry',
      'Educational autonomy and mastery'
    ]
  },
  {
    name: 'Organizations',
    href: '/research/organizations',
    icon: '🏢',
    description: 'From status tournaments to mission-driven work through source-specific interventions.',
    keyInsights: [
      'Organizational culture and motivation',
      'Leadership and intrinsic motivation',
      'Team dynamics and mimetic patterns'
    ]
  },
  {
    name: 'Marketing',
    href: '/research/marketing',
    icon: '📊',
    description: 'Diagnosing stickiness vs. herd effects to predict brand loyalty and consumer behavior.',
    keyInsights: [
      'Brand loyalty and intrinsic connection',
      'Viral marketing and mimetic desire',
      'Consumer segmentation by motivation'
    ]
  }
]

export default function ResearchPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Research Areas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The AIM Framework provides a unified lens for understanding human behavior across academic disciplines. 
            Explore how this framework transforms research and practice in different fields.
          </p>
        </div>
      </section>

      {/* Research Areas Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{area.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                  {area.name}
                </h2>
                <p className="text-gray-600 mb-6">{area.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Insights:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {area.keyInsights.map((insight, i) => (
                      <li key={i}>• {insight}</li>
                    ))}
                  </ul>
                </div>
                
                <span className="text-primary-600 font-semibold inline-flex items-center">
                  Explore Research <HiArrowRight className="ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How AIM Transforms Research</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              By distinguishing between three neural sources of motivation, AIM provides researchers with 
              precise tools for understanding and predicting human behavior across all domains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Appetites (A)</h3>
              <p className="text-gray-600">
                Physiological needs that drive immediate, state-dependent behaviors. 
                Critical for understanding health, consumption, and basic human needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intrinsic Motivation (I)</h3>
              <p className="text-gray-600">
                Self-endorsed activities that persist across contexts. 
                Essential for understanding creativity, learning, and long-term engagement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mimetic Desire (M)</h3>
              <p className="text-gray-600">
                Socially transmitted desires that create herding, rivalry, and status competition. 
                Key for understanding markets, social dynamics, and cultural phenomena.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the Research</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're actively seeking researchers to test AIM predictions, validate interventions, 
            and explore applications across disciplines.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Contact Us to Collaborate
          </Link>
        </div>
      </section>
    </div>
  )
}
