import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Education',
  description:
    'How the AIM Framework designs learning environments that protect curiosity and prevent drift to status competition in educational contexts.'
}

export default function EducationPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Education & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Designing learning environments that protect curiosity and prevent
            drift to status competition
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
          <p className="mb-4">
            The AIM Framework provides a neuroscientifically grounded foundation
            for understanding learning and education. By distinguishing between
            appetitive needs, intrinsic motivations, and mimetic desires, we can
            better predict and explain learning outcomes, design effective
            educational environments, and create sustainable learning systems.
          </p>
          <p>
            AIM reveals that traditional education often conflates different motivational
            sources—treating intrinsic curiosity as if it responds to the same interventions
            as appetitive needs or status competition. By distinguishing these sources,
            educators can design environments that protect intrinsic learning motivation
            while ensuring students&apos; basic needs are met and minimizing harmful academic
            rivalry. This framework predicts which educational interventions will succeed or
            backfire based on their impact on each motivational source.
          </p>
        </section>

        {/* Key Educational Phenomena */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Educational Phenomena
          </h2>
          <p className="mb-6">
            Research shows that extrinsic rewards can undermine intrinsic motivation—the
            &quot;overjustification effect.&quot; AIM explains why: introducing external rewards
            for intrinsically motivated learning shifts neural valuation from process-based (I)
            to outcome-based (M or A), reducing autonomous engagement. Similarly, grading systems
            that emphasize ranking create mimetic tournaments where students compete for scarce
            status markers rather than engaging with material for its own sake. AIM predicts that
            educational systems preserving intrinsic engagement while ensuring adequate rest,
            nutrition, and safety will produce deeper, more sustainable learning.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Intrinsic Motivation in Learning
              </h3>
              <p className="text-gray-600">
                How curiosity and intrinsic motivation drive deep learning, and
                why extrinsic rewards can undermine the conditions for genuine
                understanding.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Grading Systems and Mimetic Rivalry
              </h3>
              <p className="text-gray-600">
                How traditional grading systems create mimetic rivalry that
                undermines learning, and alternative approaches that support
                intrinsic motivation.
              </p>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Educational Autonomy and Mastery
              </h3>
              <p className="text-gray-600">
                How educational environments can support autonomy and mastery
                while addressing basic appetitive needs (rest, nutrition) that
                affect learning capacity.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Academic Competition & Status
              </h3>
              <p className="text-gray-600">
                How academic competition becomes a status game through mimetic
                desire, leading to both achievement and harmful comparison
                patterns.
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
                Prediction 10: Private-Then-Public Feedback Sequence Preserves
                Intrinsic Motivation
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>What AIM Uniquely Predicts:</strong> The SEQUENCE of
                feedback matters: giving private competence feedback BEFORE any
                public/comparative feedback will preserve wᵢ, while public-first
                feedback triggers I-to-M drift.
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Why This Is Novel:</strong> Educators know &quot;reduce
                social comparison&quot; but not HOW to sequence feedback. AIM
                predicts that once wᵢ is established privately, it&apos;s more
                resistant to mimetic pressure. Tests whether timing of social
                information affects motivation source.
              </p>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <strong>Test Design:</strong> Students complete challenging
                  task. Condition A: Private competence feedback → 1 week later
                  → class ranking revealed. Condition B: Class ranking revealed
                  → private feedback. Condition C: Private feedback only
                  (control).
                  <br />
                  <strong>Required:</strong> Education partnership, 6-week
                  classroom study
                </div>
                <div>
                  <strong>Timeline:</strong> 6-week classroom study
                  <br />
                  <strong>Status:</strong> Ready for education partnership
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If sequence doesn&apos;t matter,
                timing mechanism fails
              </p>
            </div>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Research Questions
          </h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              • Under what conditions do grading systems shift motivation from intrinsic
              (I) to mimetic (M)?
            </li>
            <li>
              • Can feedback timing prevent the drift from intrinsic to mimetic motivation
              in competitive academic environments?
            </li>
            <li>
              • How do different educational structures affect the balance between
              curiosity-driven learning and status competition?
            </li>
            <li>
              • What interventions can restore intrinsic motivation after it&apos;s been
              undermined by extrinsic reward systems?
            </li>
            <li>
              • How does AIM explain patterns of academic achievement and dropout?
            </li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Educational Implications
          </h2>
          <p className="mb-4">
            Educational practice informed by AIM would:
          </p>
          <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700">
            <li>
              Sequence feedback to establish intrinsic competence privately before introducing
              social comparison
            </li>
            <li>
              Design curricula that support autonomy and mastery rather than compliance
            </li>
            <li>
              Ensure students&apos; basic needs (rest, nutrition) are met so they can engage
              intrinsically
            </li>
            <li>
              Create assessment systems that provide competence feedback without triggering
              mimetic rivalry
            </li>
            <li>
              Diversify recognition across multiple dimensions to prevent convergence on single
              status markers
            </li>
          </ol>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Curriculum Design
              </h3>
              <p className="text-gray-600">
                Designing curricula that support intrinsic motivation while
                addressing basic learning needs.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Assessment Systems
              </h3>
              <p className="text-gray-600">
                Creating assessment systems that support learning without
                creating harmful mimetic competition.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Learning Environments
              </h3>
              <p className="text-gray-600">
                Designing learning environments that protect curiosity and
                support intrinsic motivation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-primary-200 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Interested in Educational Research?
          </h2>
          <p className="mb-6 text-gray-700">
            We&apos;re seeking educational researchers to test AIM predictions
            and explore applications in your field.
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
