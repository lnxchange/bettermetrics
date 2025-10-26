import { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { HiddenChat } from '@/components/hidden-chat'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Welcome to Use Better Metrics | AIM Motivation Framework',
  description:
    'Understanding human motivation through three distinct neural systems: Appetites, Intrinsic Motivation, and Mimetic Desire. A revolutionary framework for psychology, economics, and social science.',
  keywords: [
    'AIM Framework',
    'motivation',
    'psychology',
    'economics',
    'neuroscience',
    'behavioral science',
    'mimetic desire',
    'intrinsic motivation'
  ],
  authors: [{ name: 'Yule Guttenbeil' }],
  openGraph: {
    title: 'Welcome to Use Better Metrics | AIM Motivation Framework',
    description:
      'Understanding human motivation through three distinct neural systems: Appetites, Intrinsic Motivation, and Mimetic Desire.',
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
      {/* Floating In-Page Navigation */}
      <nav className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 transform rounded-lg border border-gray-200 bg-white p-4 shadow-lg lg:block">
        <div className="flex flex-col space-y-2">
          <a
            href="#welcome"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            Welcome
          </a>
          <a
            href="#how-it-started"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            How It Started
          </a>
          <a
            href="#current-models"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            Current Models
          </a>
          <a
            href="#aim-framework"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            AIM Framework
          </a>
          <a
            href="#three-systems"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            Three Systems
          </a>
          <a
            href="#using-site"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-600"
          >
            Using This Site
          </a>
        </div>
      </nav>

      {/* Mobile In-Page Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-gray-50 lg:hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-1 py-4 sm:space-x-6">
            <a
              href="#welcome"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              Welcome
            </a>
            <a
              href="#how-it-started"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              How It Started
            </a>
            <a
              href="#current-models"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              Current Models
            </a>
            <a
              href="#aim-framework"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              AIM Framework
            </a>
            <a
              href="#three-systems"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              Three Systems
            </a>
            <a
              href="#using-site"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-primary-600"
            >
              Using This Site
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-lg max-w-none">
          {/* Welcome Section */}
          <section id="welcome" className="mb-16 scroll-mt-24">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">
              Welcome to Use Better Metrics
            </h1>

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
                <p className="mb-6 text-lg text-gray-700">
                  I&apos;m <strong>Yule Guttenbeil</strong>, the person who
                  formulated the AIM Motivation Framework (&quot;AIM
                  Framework&quot;) and creator of the website Use Better Metrics
                  (www.usebettermetrics.com).
                </p>
              </div>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              The purpose of Use Better Metrics and the AIM Framework is to
              explain how recent neuroscientific discoveries shed light on where
              our motivations come from in the brain. These discoveries make it
              easier to understand ourselves, our relationships with others, and
              how society is arranged as a whole. The flow-on effects from how
              we understand our own motivations extend to how we think about
              most of the human behavioural sciences.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              I&apos;m a commercial lawyer with a bachelor&apos;s degree in
              commerce majoring in management. While it might seem unusual for a
              lawyer to develop a framework of human motivation, my professional
              background — particularly in writing and analysing contracts — has
              given me a unique ability when assessing the literature I&apos;ve
              read across the human behavioural sciences (psychology, economics,
              philosophy, neuroscience, etc.). Writing contracts is like
              building a machine: every definition and term in a contract
              operates like a cog that must fit precisely with the others to
              avoid &quot;grinding gears&quot;.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              In behavioural science, I believe we&apos;ve been dealing with a
              definitional error since the beginning that causes gear grinding—
              a kind of &quot;code drift&quot; — in how we define wants, needs,
              and preferences. The AIM Framework provides refined definitions
              that align more accurately with how our motivations work
              neurologically, allowing smoother &quot;human interaction
              contracts.&quot;
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Contracts exist to manage rivalry; they make implicit expectations
              explicit and help prevent conflict by clearly defining boundaries
              and roles. Without them, confusion and disputes arise because
              competing motivations remain unarticulated. In that sense,
              (despite the popular imagining) lawyers help &quot;grease the
              wheels&quot; of human relationships.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              In that light, I invite you to explore the resources I have made
              available on this website which are based on my own research. This
              is a living project, so the structure and information on this site
              will be updated frequently as the theory, hypothesis and findings
              develop over time.
            </p>

            <div className="mb-6 border-l-4 border-amber-400 bg-amber-50 p-6">
              <p className="text-lg text-gray-700">
                I stress, that at this stage The AIM Motivation Framework is a
                theory only. It provides a basis for hypothesising predictions
                and tightly boundered tests in order to validate its premise. I
                am not a professional psychologist, economist, philosopher or
                neuro-scientist. Though I have read broadly across those fields,
                my knowledge within each of them is nowhere near as deep as
                those who practice in them. Therefore, I am seeking assistance
                from experts in each of those fields to help me validate the
                theory – because if what the AIM Framework suggests is correct –
                it may provide a scientific basis for restructuring human
                societies, economies and governmental structures to enable human
                flourishing – by removing memetic noise and distortion from
                areas where it should not override the intrinsic motivations of
                every individual.
              </p>
            </div>
          </section>

          {/* How It All Started */}
          <section id="how-it-started" className="mb-16 scroll-mt-24">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              How It All Started
            </h2>

            <p className="mb-6 text-lg text-gray-700">
              One of my strongest early memories is believing I was an alien. I
              was no older than 4. I felt that my dad didn&apos;t understand me
              and that I couldn&apos;t understand him — I couldn&apos;t relate
              to him or effectively communicate the importance of my wants and
              needs to him. That feeling persisted in various forms throughout
              my life and ultimately led me to therapy in 2010.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              It was here that I told my therapist that I didn&apos;t know
              whether I wanted things for myself because I genuinely wanted
              them, or because my dad wanted them for me. The therapist
              responded, &quot;Well, then that&apos;s where your work is —
              finding that out.&quot; The AIM Framework represents the
              culmination of that work. It appears to me that in answering that
              question for myself, I may have inadvertently answered the same
              question for everyone&apos;s self.
            </p>
          </section>

          {/* Why Current Models Fall Short */}
          <section id="current-models" className="mb-16 scroll-mt-24">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Why Current Models Fall Short
            </h2>

            <p className="mb-6 text-lg text-gray-700">
              I&apos;m interested in creating frameworks for understanding the
              human sciences — especially how wants and needs are represented in
              behavioural models. Most variables in these models (such as those
              used in economics, psychology, and related fields) treat
              preferences as single- or bi-polar metrics: they assume people
              choose based on one or two opposing options only.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Traditional economic models treat &quot;preferences&quot; as given
              inputs - stable rankings of alternatives without exploring their
              neurological origins. Consider someone observing another person
              inspecting a camera. The observer might initially want the camera
              for photography, but upon witnessing the way the other
              person&apos;s body language expresses their desire, the observer
              unconsciously adopts that same wanting through neural mirroring
              processes – all without noticing it has happened or having access
              to the other person&apos;s internal reasoning for the gesture.
              While economic models can predict the resulting behaviour (i.e.
              both people wanting the camera), they don&apos;t properly account
              for this mimetic transmission of desire or distinguish it from
              other internally driven motivational sources.
            </p>
          </section>

          {/* Introducing the AIM Framework */}
          <section id="aim-framework" className="mb-16 scroll-mt-24">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Introducing the AIM Framework
            </h2>

            <p className="mb-6 text-lg text-gray-700">
              The AIM Framework posits that humans are motivated by three
              distinct neural systems, rather than the single preference
              rankings used in traditional economic models or the dual-system
              approaches common in psychology. Understanding these systems helps
              us identify which type of motivation is driving behaviour in a
              given situation. This framework also explains why conflict emerges
              when people with different motivational drivers compete for the
              same scarce resource or goal.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Essentially, we can now upgrade behavioural models with a
              &quot;plug and play&quot; system — the AIM Framework — that
              improves predictability and addresses previously misunderstood
              effects. These effects often appeared as behavioural outliers but
              are, in fact, governed by distinct neural pathways active in
              everyone, at all times.
            </p>
          </section>

          {/* The Three Systems That Drive Us */}
          <section id="three-systems" className="mb-16 scroll-mt-24">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              The Three Systems That Drive Us
            </h2>

            <p className="mb-6 text-lg text-gray-700">
              The AIM Framework identifies three distinct neural pathways in the
              human brain that lead into a central decision-making hub — one
              that determines our next actions. Each pathway has a unique
              purpose but ultimately helps us make choices.
            </p>

            <div className="mb-8 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-amber-800">
                  Appetites (A)
                </h3>
                <p className="text-gray-700">
                  These relate to biological needs: food, warmth, air, avoidance
                  of pain — anything that sustains health. Appetite signals rise
                  over time, growing stronger until satisfaction occurs. When
                  you eat, for example, the hunger signal drops until it is
                  triggered again.
                </p>
              </div>

              <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-teal-800">
                  Intrinsic Motivation (I)
                </h3>
                <p className="text-gray-700">
                  This is motivation derived from doing activities for their own
                  sake — curiosity, creativity, learning, and play. Intrinsic
                  motivation drives us to read, create art, play music, or
                  explore nature — activities we enjoy without needing external
                  reinforcement. We often experience intrinsically motivated
                  activities as fun, enjoyable, or calming.
                </p>
              </div>

              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-purple-800">
                  Mimetic Desire (M)
                </h3>
                <p className="text-gray-700">
                  It originates in the brain&apos;s mirror neuron systems. When
                  we observe someone expressing desire or reaching for an object
                  — physical or symbolic — the same neural patterns are
                  activated in our brains. This is empathy in action. It&apos;s
                  also how we unconsciously adopt others&apos; desires.
                </p>
              </div>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              This process happens too quickly for conscious awareness. It
              generally isn&apos;t recorded in memory, yet it profoundly
              influences behaviour. Mimetic signals are strong — often stronger
              than appetite or intrinsic signals — making them central to social
              life. This is why humans are social creatures - our neural
              activity mirrors that of others. Our neurons, our thoughts, our
              desires - are literally entangled.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Reflecting on my therapy, I realised that my dad&apos;s desires
              had &quot;infected&quot; mine. He transmitted his motivations
              sometimes deliberately, sometimes not; and I adopted them
              automatically — in conflict with my intrinsic motivations. My
              natural curiosity and love of mastery were strained by mimetic
              desires that weren&apos;t my own; causing anxiety, confusion and
              depression. I was unable to pursue the things I truly valued –
              like playing music – because they were crowded out by the
              interpersonal pressure that bore down on me from my father.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              This tension — between intrinsic motivation and mimetic desire —
              lies at the heart of human interaction. Once these motivations are
              activated, their relative strengths determine our choices. They
              sit in a kind of queue, waiting for contextual triggers before
              being acted upon. A bit like a vending machine.
            </p>
          </section>

          {/* Using this site */}
          <section id="using-site" className="mb-16 scroll-mt-24">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Using this site
            </h2>

            <p className="mb-6 text-lg text-gray-700">
              I have built this site as a central location to catalogue and
              share my findings, predictions and suggestions that flow logically
              from the AIM Framework once the premise is accepted and taken to
              its logical conclusion, when applied the various areas of human
              interactions.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Some of the findings, predictions and suggestions appear quite
              radical – simply because the world we live in does not operate in
              a way that respects the neurological source of each person&apos;s
              motivations. This causes incalculable suffering, that we have
              until now, not been able to avoid because the source of our
              individual motivations were not clear to ourselves – let alone
              each other. How they operate on an individual level, interpersonal
              level then aggregate the disparate, personal motivations as they
              scale up to a societal and global levels has largely remained a
              mystery throughout human history. We can observe the phenomena and
              label them. We can create models that explain parts of them. But
              we have to date not been able to systematically align our models
              throughout the human behavioural sciences because we have
              literally been using different definitions and different metrics
              for choice in each field of study. This means a phenomena examined
              in one field becomes well understood in that field, but is
              accounted for as an edge case or an aberration in another.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              My hope is that the better metrics and definitions proffered on
              this site can clear up the confusion experienced both within and
              between the various fields of study, in the human behavioural
              sciences.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              By providing very simple self-diagnosis tools the AIM Framework
              helps us understand our own motivations, and clear away the social
              noise that crowds our thinking and leads to unsatisfying internal
              tension, relationship breakdown, and the myriad of mental health
              issues that follow.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Given that the AIM Framework proposes a paradigmatic shift in how
              we see ourselves, others, groups, the economy and society as a
              whole – I know you are going to have lots of questions to ask me.
              I&apos;m only one man, with two very young children, and about 4
              businesses to run – so I&apos;ve built an AI chatbot that
              references my research materials, writings, transcripts of
              monologues and conversations so that you should be able to get an
              answer.
            </p>

            <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-6">
              <p className="mb-4 text-lg text-gray-700">
                I don&apos;t know what your questions are going to be, I
                don&apos;t know what the AI chatbot is going to tell you. So,
                I&apos;ll tell you what I tell the lawyers I train on how to
                ethically and effectively use AI tools:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Don&apos;t assume it is correct.</li>
                <li>Verify it for yourself.</li>
                <li>Use your own judgement.</li>
              </ul>
            </div>

            <p className="mb-6 text-lg text-gray-700">
              I&apos;m very clear that the AIM Framework is a theory only at
              this stage. A Hypothesis. I conceived of it only in October 2025.
              It is therefore very new. It needs to be validated by experts and
              I am in the process of getting the right kind of people on board
              to do that. If you are one, please contact me. If you are not, I
              hope you find the information on this site helpful. I dare say it
              appears better grounded than most of what passes as self-help
              these days.
            </p>

            <p className="mb-6 text-lg text-gray-700">
              Whatever the AIM Framework raises for you once you start delving
              into it, please be kind to yourself, and understanding of the
              various motivations operating on those around you.
            </p>

            <p className="mb-8 text-lg text-gray-700">
              I genuinely wish you all the very best.
            </p>

            <p className="text-lg font-semibold text-gray-900">
              Yule Guttenbeil – October 2025
            </p>
          </section>
        </article>
      </main>

      {/* Hidden Chat Component */}
      <HiddenChat />

      <Providers>
        <Toaster />
      </Providers>
      <TailwindIndicator />
    </div>
  )
}
