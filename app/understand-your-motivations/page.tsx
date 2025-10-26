import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understand Your Motivations',
  description:
    'An introduction to the AIM Framework and practical guidance for using it at the personal and interpersonal level.'
}

export default function UnderstandYourMotivationsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Understand Your Motivations
          </h1>
          <p className="text-xl text-gray-600">
            Apply the AIM Framework to better understand yourself and improve
            your relationships
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="prose prose-lg mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Introduction
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add introduction content explaining the purpose of this page
              and how AIM maps to motivation science.
            </p>
          </div>
          <p>
            The AIM Framework provides a powerful lens for understanding your
            own motivations and those of others. By distinguishing between
            Appetites, Intrinsic Motivation, and Mimetic Desire, you can make
            more informed decisions and build healthier relationships.
          </p>
        </section>

        {/* AIM Framework Overview */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            The AIM Framework Overview
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add concise definitions and theory for Appetites (A),
              Intrinsic Motivation (I), and Mimetic Desire (M).
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Appetites <span className="text-amber-600">(A)</span>
              </h3>
              <p className="text-gray-600">
                Physiological needs that arise from bodily deficits—hunger,
                thirst, fatigue, etc.
              </p>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Intrinsic Motivation <span className="text-teal-600">(I)</span>
              </h3>
              <p className="text-gray-600">
                Activities valued for their own sake—curiosity, mastery,
                autonomy, flow.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Mimetic Desire <span className="text-purple-600">(M)</span>
              </h3>
              <p className="text-gray-600">
                Desires shaped by observing others, prestige cues, and social
                norms.
              </p>
            </div>
          </div>
        </section>

        {/* Personal AIM */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Personal AIM: Self-Understanding
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add content about recognizing appetites, cultivating
              intrinsic motivation, identifying/mitigating mimetic pulls.
              Include self-assessment exercises and reflection prompts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Self-Assessment Questions
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• What activities do you do purely for enjoyment?</li>
                <li>• When do you feel most energized and focused?</li>
                <li>• What desires arise from seeing others&apos; choices?</li>
                <li>• How do your motivations change in different contexts?</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Reflection Prompts
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Journal about your daily motivations</li>
                <li>• Notice patterns in your decision-making</li>
                <li>• Identify sources of stress and satisfaction</li>
                <li>• Track changes in your interests over time</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interpersonal AIM */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Interpersonal AIM: Relationships & Groups
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add content about how AIM shapes social dynamics,
              leadership, persuasion, and conflict. Include communication guides
              and applied examples.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Understanding Others
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Recognize when someone is driven by different sources</li>
                <li>• Adapt your communication style accordingly</li>
                <li>• Avoid triggering unnecessary rivalry</li>
                <li>• Support others&apos; intrinsic motivations</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Group Dynamics
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Identify mimetic patterns in teams</li>
                <li>• Create environments that support intrinsic motivation</li>
                <li>• Address conflicts at their source</li>
                <li>• Build cultures of autonomy and mastery</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-primary-200 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Need Personalized Guidance?
          </h2>
          <p className="mb-6 text-gray-700">
            Our AI assistant can help you apply AIM to your specific situation.
            Ask questions about your motivations, relationship dynamics, or
            decision-making challenges.
          </p>
          <Link
            href="/chat"
            className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Ask Our AI About Your Motivations
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            (Requires account - you&apos;ll be prompted to sign up or log in)
          </p>
        </section>
      </article>
    </div>
  )
}
