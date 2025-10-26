import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Organizations',
  description:
    'How the AIM Framework transforms organizations from status tournaments to mission-driven work through source-specific interventions.'
}

export default function OrganizationsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Organizations & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            From status tournaments to mission-driven work through
            source-specific interventions
          </p>
        </div>
      </section>

      {/* Hypothesis Status Banner */}
      <div className="border-t-4 border-amber-400 bg-amber-50 p-6">
        <div className="mx-auto flex max-w-5xl items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="mb-1 font-bold text-gray-900">
              These are testable predictions, not established findings.
            </h3>
            <p className="text-gray-700">
              We&apos;re seeking researchers to validate these hypotheses.
              <Link
                href="/research-resources"
                className="ml-2 text-primary-600 hover:underline"
              >
                Access research materials →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-lg mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Overview</h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add comprehensive overview of how AIM transforms
              organizational understanding, including key organizational
              phenomena explained by the framework.
            </p>
          </div>
          <p>
            The AIM Framework provides a neuroscientifically grounded foundation
            for understanding organizational behavior. By distinguishing between
            appetitive needs, intrinsic motivations, and mimetic desires, we can
            better predict and explain workplace dynamics, design effective
            organizational structures, and create sustainable work environments.
          </p>
        </section>

        {/* Key Organizational Phenomena */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Organizational Phenomena
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add detailed explanations of how AIM explains specific
              organizational phenomena like culture, leadership, etc.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Organizational Culture and Motivation
              </h3>
              <p className="text-gray-600">
                How organizational cultures can support intrinsic motivation
                while addressing basic appetitive needs (fair compensation,
                work-life balance) that affect performance.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Leadership and Intrinsic Motivation
              </h3>
              <p className="text-gray-600">
                How leadership styles can either support or undermine intrinsic
                motivation, and the role of mimetic desire in leadership
                dynamics.
              </p>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Team Dynamics and Mimetic Patterns
              </h3>
              <p className="text-gray-600">
                How team dynamics are shaped by mimetic patterns of competition
                and collaboration, and strategies for creating healthier team
                environments.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Status Tournaments vs. Mission-Driven Work
              </h3>
              <p className="text-gray-600">
                How organizations can shift from status tournaments driven by
                mimetic desire to mission-driven work supported by intrinsic
                motivation.
              </p>
            </div>
          </div>
        </section>

        {/* Novel Testable Predictions */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Novel Testable Predictions
          </h2>

          <div className="space-y-8">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="mb-2 font-bold text-gray-900">
                Prediction 11: Diversified Recognition Prevents Mimetic
                Convergence on Single Status Marker
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>What AIM Uniquely Predicts:</strong> When organizations
                recognize achievements across{' '}
                <strong>multiple dimensions</strong> (creativity, collaboration,
                technical skill, mentorship), mimetic rivalry decreases because
                employees can&apos;t converge on a SINGLE scarce marker. This
                reduces wₘ-driven competition and preserves wᵢ.
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Why This Is Novel:</strong> Management research shows
                &quot;recognition matters&quot; but doesn&apos;t explain rivalry
                dynamics. AIM predicts that <strong>single metrics</strong>{' '}
                (sales numbers, publications) create mimetic tournaments.
                Diversification disperses mimetic targets, reducing rivalry.
              </p>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <strong>Test Design:</strong> Compare teams with different
                  recognition systems: Single-metric (ranked by one KPI) vs
                  Multi-metric (recognized across 5-7 different dimensions).
                  Track employee retention, reported burnout, innovation
                  metrics, political behavior.
                  <br />
                  <strong>Required:</strong> HR analytics partnership, 12-month
                  organizational tracking
                </div>
                <div>
                  <strong>Timeline:</strong> 12-month organizational tracking
                  <br />
                  <strong>Status:</strong> Seeking HR analytics partnership
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If single-metric performs
                better, mimetic rivalry mechanism fails
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Research Questions
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add specific research questions that AIM can help answer in
              organizational studies, with testable predictions and hypotheses.
            </p>
          </div>

          <ul className="space-y-4 text-gray-600">
            <li>
              • How do different motivational sources affect organizational
              performance?
            </li>
            <li>
              • What role does intrinsic motivation play in employee retention
              and satisfaction?
            </li>
            <li>
              • How can we design organizations that reduce harmful mimetic
              competition?
            </li>
            <li>
              • What are the organizational implications of protecting intrinsic
              motivation?
            </li>
            <li>
              • How does AIM explain patterns of organizational culture and
              change?
            </li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Organizational Implications
          </h2>
          <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
              TODO: Add content about how AIM can inform organizational
              practice, including specific organizational interventions that
              account for different motivational sources.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Organizational Design
              </h3>
              <p className="text-gray-600">
                Designing organizational structures that support intrinsic
                motivation while addressing basic needs.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Leadership Development
              </h3>
              <p className="text-gray-600">
                Creating leadership development programs that support intrinsic
                motivation and reduce mimetic rivalry.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Workplace Culture
              </h3>
              <p className="text-gray-600">
                Designing workplace cultures that protect curiosity and support
                mission-driven work.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-primary-200 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Interested in Organizational Research?
          </h2>
          <p className="mb-6 text-gray-700">
            We&apos;re seeking organizational researchers to test AIM
            predictions and explore applications in your field.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Contact Us to Collaborate
          </Link>
        </section>
      </article>
    </div>
  )
}
