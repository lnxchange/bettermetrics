import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Marketing',
  description:
    'How the AIM Framework diagnoses stickiness vs. herd effects to predict brand loyalty and consumer behavior in marketing contexts.'
}

export default function MarketingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Marketing & the AIM Framework
          </h1>
          <p className="text-xl text-gray-600">
            Diagnosing stickiness vs. herd effects to predict brand loyalty and
            consumer behavior
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
            for understanding consumer behavior and marketing. By distinguishing
            between appetitive needs, intrinsic motivations, and mimetic
            desires, we can better predict and explain consumer choices, design
            effective marketing strategies, and create sustainable brand
            relationships.
          </p>
          <p>
            AIM enables marketers to distinguish between genuine brand loyalty (intrinsic
            connection to brand values or product experience) and temporary herd effects
            (mimetic desire following others&apos; consumption). This distinction is crucial
            for predicting which marketing strategies will create lasting customer
            relationships versus short-term viral adoption. Products meeting appetitive
            needs, providing intrinsic enjoyment, or conferring mimetic status require
            fundamentally different marketing approaches.
          </p>
        </section>

        {/* Key Marketing Phenomena */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Key Marketing Phenomena
          </h2>
          <p className="mb-6">
            Viral marketing leverages mimetic desire: seeing others adopt a product
            increases valuation independent of product attributes. AIM predicts these
            campaigns create rapid adoption but unstable loyalty—when mimetic attention
            shifts, customers leave. Conversely, brands creating intrinsic connection
            (products valued for direct experience rather than social signaling) show
            stable loyalty resistant to competitive pressure. Luxury goods often combine
            both: mimetic status value plus intrinsic craftsmanship. Understanding which
            source dominates helps predict market dynamics and optimal marketing strategy.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Brand Loyalty and Intrinsic Connection
              </h3>
              <p className="text-gray-600">
                How brands can create genuine intrinsic connections with
                consumers, leading to lasting loyalty that transcends price and
                convenience.
              </p>
            </div>

            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Viral Marketing and Mimetic Desire
              </h3>
              <p className="text-gray-600">
                How viral marketing leverages mimetic desire and social proof,
                creating herd effects that can be both powerful and
                unpredictable.
              </p>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Consumer Segmentation by Motivation
              </h3>
              <p className="text-gray-600">
                How consumers can be segmented by their dominant motivational
                sources, from appetitive needs to mimetic status considerations.
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Stickiness vs. Herd Effects
              </h3>
              <p className="text-gray-600">
                How to distinguish between genuine brand stickiness (intrinsic
                connection) and temporary herd effects (mimetic desire) in
                marketing analytics.
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
              • Can consumer loyalty be predicted by measuring intrinsic versus mimetic
              connection to brands?
            </li>
            <li>
              • How do marketing campaigns shift motivation between intrinsic engagement
              and mimetic status-seeking?
            </li>
            <li>
              • What product categories are primarily driven by each motivational source,
              and how does this affect market dynamics?
            </li>
            <li>
              • Can brands transition from mimetic to intrinsic positioning, and what
              strategies enable this shift?
            </li>
            <li>
              • How does AIM explain patterns of consumer behavior and brand switching?
            </li>
          </ul>
        </section>

        {/* Policy Implications */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Marketing Implications
          </h2>
          <p className="mb-4">
            Marketing practice informed by AIM would:
          </p>
          <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700">
            <li>
              Diagnose whether products primarily satisfy appetitive needs, provide intrinsic
              value, or confer mimetic status
            </li>
            <li>
              Design campaigns aligned with dominant motivational source rather than generic
              approaches
            </li>
            <li>
              Build intrinsic brand connections for sustainable loyalty rather than relying
              solely on social proof
            </li>
            <li>
              Recognize that mimetic campaigns create unstable demand vulnerable to attention
              shifts
            </li>
            <li>
              Segment consumers by motivational source rather than demographics alone
            </li>
          </ol>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Brand Strategy
              </h3>
              <p className="text-gray-600">
                Designing brand strategies that support intrinsic connection
                while addressing basic consumer needs.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Campaign Design
              </h3>
              <p className="text-gray-600">
                Creating marketing campaigns that leverage intrinsic motivation
                and reduce harmful mimetic effects.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Consumer Analytics
              </h3>
              <p className="text-gray-600">
                Developing analytics frameworks that distinguish between
                different motivational sources in consumer behavior.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-primary-200 rounded-xl border-2 bg-primary-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Interested in Marketing Research?
          </h2>
          <p className="mb-6 text-gray-700">
            We&apos;re seeking marketing researchers to test AIM predictions and
            explore applications in your field.
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
