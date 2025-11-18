import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Health & Policy',
  description:
    'How the AIM Framework explains health behaviors, separates physiological need from social amplification, and informs public health interventions.'
}

export default function HealthPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Health & Policy & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Separating physiological need from social amplification in public
            health interventions
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
            for understanding health behaviors. By distinguishing between
            appetitive needs, intrinsic motivations, and mimetic desires, we can
            better predict and explain health outcomes, design effective
            interventions, and create sustainable health policies.
          </p>
          <p>
            AIM distinguishes genuine physiological needs (A) from socially amplified
            health behaviors (M), enabling more targeted interventions. Many health
            challenges involve multiple sources: obesity may combine appetitive
            dysregulation with mimetic eating patterns; exercise adherence may depend
            on intrinsic enjoyment versus appearance-based motivation. By identifying
            which motivational source drives a behavior, health policy can design
            interventions that address root causes rather than treating all health
            behaviors as responding to the same incentives.
          </p>
        </section>

        {/* Key Health Phenomena */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Health Phenomena
          </h2>
          <p className="mb-6">
            AIM predicts that health interventions targeting the wrong motivational source
            will fail. For example, social comparison-based fitness programs may initially
            attract participants through mimetic desire but show poor long-term adherence
            because they don&apos;t develop intrinsic motivation. Conversely, obesity
            interventions that address only appetitive needs without recognizing mimetic
            eating (eating more when dining with high-status others) will miss a key
            behavioral driver. AIM enables precise diagnosis: Is this behavior driven by
            physiological need, intrinsic health engagement, or social comparison?
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Obesity: Appetite vs. Mimetic Eating
              </h3>
              <p className="text-gray-600">
                How obesity interventions must distinguish between genuine
                appetitive needs and mimetic eating behaviors driven by social
                comparison and status signaling.
              </p>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Healthcare Access & Intrinsic Motivation
              </h3>
              <p className="text-gray-600">
                How intrinsic motivation drives health-seeking behavior and why
                extrinsic incentives may undermine long-term health engagement.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Health Status & Mimetic Desire
              </h3>
              <p className="text-gray-600">
                How health becomes a status symbol through mimetic desire,
                leading to both positive health behaviors and harmful comparison
                patterns.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Policy Design for Different Sources
              </h3>
              <p className="text-gray-600">
                How health policies must account for different motivational
                sources, from basic appetitive needs to complex mimetic health
                behaviors.
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
                Prediction 6: Social Dining Amplifies Intake ONLY When Models
                Are Eating More
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>What AIM Uniquely Predicts:</strong> Social dining
                increases food intake{' '}
                <strong>through mimetic mechanisms</strong>, meaning: eating
                amplifies when observing others eat MORE than baseline, effect
                disappears when dining companion eats LESS, effect is strongest
                when the model is high-status/attractive.
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Why This Is Novel:</strong> Existing research shows
                &quot;social eating increases intake&quot; but doesn&apos;t test
                DIRECTION. AIM predicts it&apos;s mimetic (matching the model)
                not just social presence. Can test by manipulating
                confederate&apos;s eating behavior.
              </p>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <strong>Test Design:</strong> Participants eat lunch with
                  confederate. Condition A: Confederate eats large portion.
                  Condition B: Confederate eats small portion. Condition C: Eats
                  alone (control).
                  <br />
                  <strong>Required:</strong> Nutrition research partnership,
                  3-month field study
                </div>
                <div>
                  <strong>Timeline:</strong> 3-month field study
                  <br />
                  <strong>Status:</strong> Seeking nutrition research
                  partnership
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If Condition B = Control,
                it&apos;s not mimetic but just &quot;social eating&quot;
              </p>
            </div>

            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="mb-2 font-bold text-gray-900">
                Prediction 7: Flow-Based Exercise Programs Outperform
                Appearance-Based Programs at 12+ Months
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>What AIM Uniquely Predicts:</strong> Exercise programs
                designed around <strong>intrinsic rewards</strong> (mastery,
                flow, competence) will show better long-term adherence than
                programs designed around <strong>mimetic rewards</strong> (body
                image, social comparison, appearance goals).
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Why This Is Novel:</strong> Fitness research shows
                &quot;intrinsic motivation predicts adherence&quot;
                (established). <strong>AIM adds:</strong> Can DESIGN programs to
                maximize wᵢ vs wₘ through specific features. Predicts which
                program elements drive which source.
              </p>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <strong>Test Design:</strong> Two exercise programs: High-I
                  (emphasis on skill progression, optimal challenge, private
                  milestones) vs High-M (before/after photos, group
                  leaderboards, appearance metrics).
                  <br />
                  <strong>Required:</strong> Fitness industry partnership,
                  12-month longitudinal study
                </div>
                <div>
                  <strong>Timeline:</strong> 12-month longitudinal study
                  <br />
                  <strong>Status:</strong> Seeking fitness industry partnership
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Falsification:</strong> If both programs show equal
                retention, I vs M design distinction fails
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
              • What proportion of health behaviors are driven by appetitive needs versus
              mimetic desire, and how does this vary across populations?
            </li>
            <li>
              • Can health interventions designed around intrinsic motivation (mastery, flow)
              outperform appearance-based programs long-term?
            </li>
            <li>
              • How do social dining contexts amplify or suppress appetitive eating through
              mimetic mechanisms?
            </li>
            <li>
              • What policy interventions can protect intrinsic health motivation while
              addressing basic health needs?
            </li>
            <li>
              • How does AIM explain health disparities across different populations?
            </li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Policy Implications
          </h2>
          <p className="mb-4">
            Health policy informed by AIM would:
          </p>
          <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700">
            <li>
              Ensure basic health needs are met (appetitive sufficiency) as foundation for
              other interventions
            </li>
            <li>
              Design public health campaigns that support intrinsic health engagement rather
              than relying solely on fear or social comparison
            </li>
            <li>
              Recognize when health behaviors are mimetically driven and address social
              dynamics rather than individual choice
            </li>
            <li>
              Create healthcare systems that preserve patient autonomy and intrinsic
              motivation for health
            </li>
            <li>
              Target interventions based on motivational source diagnosis rather than
              one-size-fits-all approaches
            </li>
          </ol>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Nutrition Policy
              </h3>
              <p className="text-gray-600">
                Designing nutrition interventions that address appetitive needs
                while reducing harmful mimetic eating.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Mental Health Systems
              </h3>
              <p className="text-gray-600">
                Creating mental health systems that support intrinsic motivation
                and address mimetic social dynamics.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Healthcare Delivery
              </h3>
              <p className="text-gray-600">
                Designing healthcare delivery systems that account for different
                motivational sources in patient behavior.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-primary-200 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Interested in Health Policy Research?
          </h2>
          <p className="mb-6 text-gray-700">
            We&apos;re seeking health policy researchers to test AIM predictions
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
