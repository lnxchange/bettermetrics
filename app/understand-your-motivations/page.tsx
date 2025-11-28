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

      {/* Interactive Diagnostic CTA */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Try the Self-Diagnosis Tool
            </h2>
            <p className="mb-6 text-lg text-gray-700">
              Answer three quick questions to identify which motivational source is currently dominant in your decision-making
            </p>
            <Link
              href="/diagnostic"
              className="inline-flex items-center rounded-lg bg-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-teal-700"
            >
              Start Diagnostic
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="prose prose-lg mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Introduction
          </h2>
          <p className="mb-4">
            The AIM Framework provides a powerful lens for understanding your
            own motivations and those of others. By distinguishing between
            Appetites, Intrinsic Motivation, and Mimetic Desire, you can make
            more informed decisions and build healthier relationships.
          </p>
          <p className="mb-4">
            Most of us have experienced confusion about what we truly want versus what we think we should want. 
            The AIM Framework helps clarify this by showing that different types of wanting have different neural origins, 
            behavioral signatures, and appropriate responses.
          </p>
          <p>
            Understanding these distinctions isn&apos;t about judging which source is &quot;better&quot;—all three are essential 
            parts of being human. It&apos;s about recognizing which is active in a given moment so you can respond appropriately.
          </p>
        </section>

        {/* AIM Framework Overview */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            The AIM Framework Overview
          </h2>
          <div className="mb-6">
            <p className="mb-4">
              The AIM Framework distinguishes three distinct sources of motivation,
              each operating through different neural pathways and requiring different responses:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong className="text-green-600">Appetites (A):</strong> Homeostatic
                motivation arising from physiological deficits (hunger, thirst, temperature
                dysregulation) with consummatory relief.
              </li>
              <li>
                <strong className="text-blue-600">Intrinsic Motivation (I):</strong> Process-rewarding
                engagement where the activity itself generates dopaminergic reward, independent
                of external outcomes.
              </li>
              <li>
                <strong className="text-red-600">Mimetic Desire (M):</strong> Socially transmitted
                wanting: observing another person&apos;s pursuit of X increases one&apos;s own
                valuation of X.
              </li>
            </ul>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Appetites <span className="text-green-600">(A)</span>
              </h3>
              <p className="text-gray-600">
                Physiological needs that arise from bodily deficits—hunger,
                thirst, fatigue, etc.
              </p>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Intrinsic Motivation <span className="text-blue-600">(I)</span>
              </h3>
              <p className="text-gray-600">
                Activities valued for their own sake—curiosity, mastery,
                autonomy, flow.
              </p>
            </div>

            <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Mimetic Desire <span className="text-red-600">(M)</span>
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
          <div className="mb-6 space-y-4">
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Recognizing Appetites</h4>
              <p className="text-gray-700">
                Physical signals like fatigue, hunger, or discomfort indicate appetitive
                needs. Address these directly through rest, nutrition, or environmental
                changes. When basic needs are unmet, it&apos;s difficult to engage
                intrinsically or think clearly about desires.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Cultivating Intrinsic Motivation</h4>
              <p className="text-gray-700">
                Identify activities where you lose track of time—these reveal intrinsic
                engagement. Protect your autonomy and create opportunities for mastery.
                Be aware that external rewards can undermine intrinsic motivation, so
                maintain activities you do purely for their own sake.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Identifying Mimetic Pulls</h4>
              <p className="text-gray-700">
                Notice desires that arise after seeing others&apos; choices or achievements.
                Ask yourself: &quot;Would I want this if no one knew?&quot; Mimetic desires
                aren&apos;t inherently bad—they connect us to others—but recognizing them
                helps you respond appropriately rather than confusing them with intrinsic
                interests or genuine needs.
              </p>
            </div>
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
          <div className="mb-6 space-y-4">
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Social Dynamics</h4>
              <p className="text-gray-700">
                Mimetic desire creates both connection (shared interests) and rivalry
                (competition for scarce status markers). You can reduce rivalry by
                diversifying what you value—when you recognize excellence across
                multiple dimensions, people aren&apos;t forced to compete on a single axis.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Leadership</h4>
              <p className="text-gray-700">
                Support others&apos; intrinsic motivations rather than relying solely on
                rewards and punishments. Ensure basic needs are met so people can engage
                intrinsically with their work. Recognize that different motivational sources
                require different responses—what works for appetitive compliance won&apos;t
                foster intrinsic engagement.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-gray-900">Conflict Resolution</h4>
              <p className="text-gray-700">
                Identify the motivational source: Are you competing for a scarce resource (A),
                protecting autonomy (I), or caught in mimetic rivalry (M)? Different sources
                need different solutions. Appetitive conflicts need resource allocation,
                intrinsic conflicts need autonomy protection, and mimetic conflicts often
                dissolve when you remove the audience or reframe the competition.
              </p>
            </div>
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
