import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowRight, HiUserGroup, HiBriefcase, HiAcademicCap } from 'react-icons/hi'
import { AIMDefinitionsShort } from '@/components/aim-definitions'

export const metadata: Metadata = {
  title: 'AIM Motivation Framework | Use Better Metrics',
  description:
    'A neuroscience-grounded lens for re-reading existing observations about human behavior through three distinct motivational sources: Appetites, Intrinsic Motivation, and Mimetic Desire.',
  keywords: [
    'AIM Framework',
    'motivation',
    'psychology',
    'economics',
    'neuroscience',
    'behavioral science',
    'mimetic desire',
    'intrinsic motivation',
    'descriptive framework'
  ],
  authors: [{ name: 'Yule Guttenbeil' }],
  openGraph: {
    title: 'AIM Motivation Framework | Use Better Metrics',
    description:
      'A descriptive, neuroscience-grounded lens for understanding human motivation through three distinct sources.',
    url: 'https://www.usebettermetrics.com',
    siteName: 'Use Better Metrics',
    images: [
      {
        url: 'https://www.usebettermetrics.com/AIM Logo.png',
        width: 1200,
        height: 630,
        alt: 'AIM Motivation Framework'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section - New Framing */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              A Descriptive Lens for What We Already Know
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 sm:text-2xl">
              Use Better Metrics is the home of the <strong>AIM Motivation Framework</strong>: 
              a neuroscience-grounded way of re-reading what researchers have already observed about human behavior.
            </p>
            <p className="mx-auto mb-12 max-w-4xl text-lg text-gray-700">
              Instead of treating &quot;preferences&quot; or &quot;needs&quot; as a single black-box variable, 
              AIM reclassifies them into <strong>three neural sources of motivation</strong>—
              Appetites, Intrinsic Motivation, and Mimetic Desire—and shows how they combine 
              in the brain&apos;s common-currency valuation system.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/about"
                className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Learn the Framework
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center rounded-lg border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50"
              >
                Ask the AI Chatbot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What This Explains - From Explanation to Contested Concepts */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              From Explanation to Contested Concepts
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              The aim is not to discard existing models or findings, but to plug AIM into them 
              so that long-standing anomalies, edge cases, and disagreements across fields can be 
              explained using a single, consistent motivational taxonomy.
            </p>
          </div>

          <div className="mb-12 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8">
            <p className="mb-4 text-lg text-gray-700">
              Once the same three sources of motivation are traced through legal systems, markets, 
              and everyday institutions, they provide a more precise way of talking about contested 
              ideas like <strong>fairness</strong>, <strong>freedom</strong>, and <strong>justice</strong>.
            </p>
            <p className="mb-4 text-lg text-gray-700">
              Any normative suggestions about how societies or organizations ought to be structured 
              are meant to follow directly from that explanatory work: if we can see which parts of 
              behavior are appetitive, which are intrinsic, and which are mimetic, then we can spell 
              out more carefully what it would mean to secure appetites, protect intrinsic projects, 
              and deliberately manage mimetic pressure.
            </p>
            <p className="text-lg font-semibold text-gray-900">
              In that sense, AIM is first a tool for interpreting existing observations and findings; 
              the proposals about fairness, freedom, and justice are attempts to let that clearer 
              motivational picture do as much of the normative work as possible.
            </p>
          </div>

          {/* Three Audience Pathways */}
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/understand-your-motivations"
              className="group rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 transition hover:border-teal-400 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
                <HiUserGroup className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">For Individuals</h3>
              <p className="mb-4 text-gray-700">
                Understand your own motivations and improve your relationships through practical 
                self-diagnosis tools and everyday examples.
              </p>
              <span className="inline-flex items-center text-teal-600 group-hover:underline">
                Start here <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/research"
              className="group rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 transition hover:border-amber-400 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600 text-white">
                <HiBriefcase className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">For Practitioners</h3>
              <p className="mb-4 text-gray-700">
                Explore applications across organizations, health policy, marketing, economics, 
                law, and education.
              </p>
              <span className="inline-flex items-center text-amber-600 group-hover:underline">
                See applications <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/research-resources"
              className="group rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 transition hover:border-purple-400 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                <HiAcademicCap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">For Researchers</h3>
              <p className="mb-4 text-gray-700">
                Access the theoretical foundation, testable predictions, and research collaboration 
                opportunities.
              </p>
              <span className="inline-flex items-center text-purple-600 group-hover:underline">
                Research programme <HiArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Framework Overview */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              The AIM Framework in One Glance
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Three neurologically distinct sources of motivation that converge in the brain&apos;s 
              common-currency valuation system
            </p>
          </div>

          <AIMDefinitionsShort />

          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="inline-flex items-center text-lg font-semibold text-primary-600 hover:text-primary-700"
            >
              Learn more about how these systems work
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Me and This Project - Personal Story Moved Here */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            How This Work Began
          </h2>

          <article className="prose prose-lg max-w-none">
            <div className="mb-8 flex flex-col items-start gap-8 md:flex-row">
              <div className="flex-shrink-0">
                <Image
                  src="/20250911-lex-nova-web-res-106.jpg"
                  alt="Yule Guttenbeil"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1">
                <p className="mb-4 text-lg text-gray-700">
                  I'm <strong>Yule Guttenbeil</strong>, the person who formulated the 
                  AIM Motivation Framework and created Use Better Metrics.
                </p>
                <p className="text-lg text-gray-700">
                  My background is in commercial law and management, where I have spent years 
                  drafting and analyzing contracts—systems where every definition has to fit with 
                  every other or the whole arrangement starts to grind.
                </p>
              </div>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              Reading across psychology, economics, philosophy, and neuroscience, it became clear to me 
              that something similar was happening in the human behavioral sciences: we were using slightly 
              different, drifting definitions of wants, needs, and preferences in each field, and the 
              "gears" no longer lined up.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              The AIM Framework is my attempt to repair that drift by offering a set of tighter, 
              neurologically grounded definitions that can be applied back onto existing observations 
              and models, rather than starting from scratch.
            </p>

            <div className="my-8 border-l-4 border-blue-400 bg-blue-50 p-6">
              <p className="text-lg text-gray-700">
                When these refined motivational categories are applied consistently, they not only help 
                explain patterns that different disciplines have already noticed, they also clarify why 
                people disagree so deeply about fairness, freedom, and justice.
              </p>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              Much of the work on this site is therefore two-step: first, use AIM to make sense of 
              existing findings and lived experience; second, let that clearer picture guide careful, 
              testable suggestions about how our laws, markets, and institutions might better respect 
              appetites, protect intrinsic motivations, and avoid weaponizing mimetic rivalry.
            </p>

            <h3 className="mb-4 mt-12 text-2xl font-bold text-gray-900">
              The Personal Journey
            </h3>

            <p className="mb-6 text-lg text-gray-700">
              One of my strongest early memories is believing I was an alien. I was no older than 4. 
              I felt that my dad didn&apos;t understand me and that I couldn&apos;t understand him—I couldn&apos;t 
              relate to him or effectively communicate the importance of my wants and needs to him. 
              That feeling persisted in various forms throughout my life and ultimately led me to 
              therapy in 2010.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              It was here that I told my therapist that I didn&apos;t know whether I wanted things for 
              myself because I genuinely wanted them, or because my dad wanted them for me. The 
              therapist responded, "Well, then that&apos;s where your work is—finding that out."
            </p>

            <p className="mb-6 text-lg text-gray-700">
              The AIM Framework represents the culmination of that work. Reflecting on my therapy, 
              I realized that my dad&apos;s desires had &quot;infected&quot; mine. He transmitted his motivations—
              sometimes deliberately, sometimes not—and I adopted them automatically, in conflict 
              with my intrinsic motivations. My natural curiosity and love of mastery were strained 
              by mimetic desires that weren&apos;t my own, causing anxiety, confusion, and depression.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              This tension—between intrinsic motivation and mimetic desire—lies at the heart of 
              human interaction. It appears to me that in answering that question for myself, I may 
              have inadvertently answered the same question for everyone&apos;s self.
            </p>

            <h3 className="mb-4 mt-12 text-2xl font-bold text-gray-900">
              A Young but Rapidly Developing Research Programme
            </h3>

            <div className="mb-6 border-l-4 border-amber-400 bg-amber-50 p-6">
              <p className="mb-4 text-lg text-gray-700">
                The AIM Motivation Framework is a <strong>young but rapidly developing research programme</strong> 
                with a working mathematical model and domain-level predictions. It provides a basis for 
                testable hypotheses and tightly bounded experiments to validate its premises.
              </p>
              <p className="text-lg text-gray-700">
                I am not a professional psychologist, economist, philosopher, or neuroscientist. Though I have 
                read broadly across those fields, my knowledge within each is nowhere near as deep as those 
                who practice in them. Therefore, I am seeking assistance from experts in each field to help 
                validate the framework—because if what AIM suggests is correct, it may provide a scientific 
                basis for understanding previously contested concepts in ways that enable more careful policy, 
                institutional design, and interpersonal respect.
              </p>
            </div>

            <h3 className="mb-4 mt-12 text-2xl font-bold text-gray-900">
              Using This Site
            </h3>

            <p className="mb-6 text-lg text-gray-700">
              This is a living project, so the structure and information on this site will be updated 
              as the theory, hypothesis, and findings develop over time. I have built it as a central 
              location to catalogue and share findings, predictions, and suggestions that flow logically 
              from the AIM Framework when applied to various areas of human interaction.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Given that the AIM Framework proposes a significant shift in how we understand motivation 
              across disciplines, I know you&apos;re going to have questions. I've built an AIM chatbot that 
              references my research materials, writings, and conversations so that you should be able 
              to get answers. As I tell the lawyers I train on how to ethically use AI tools:
            </p>

            <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-6">
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Don&apos;t assume it is correct.</li>
                <li>Verify it for yourself.</li>
                <li>Use your own judgment.</li>
              </ul>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              My hope is that the better metrics and definitions offered on this site can help clear 
              up confusion both within and between various fields of study in the human behavioral 
              sciences, and provide practical tools for understanding our own motivations and improving 
              our relationships.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Whatever the AIM Framework raises for you once you start exploring it, please be kind 
              to yourself and understanding of the various motivations operating on those around you.
            </p>

            <p className="mb-8 text-lg text-gray-700">
              I genuinely wish you all the very best.
            </p>

            <p className="text-lg font-semibold text-gray-900">
              Yule Guttenbeil
            </p>
          </article>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
            >
              Get in Touch
              <HiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
