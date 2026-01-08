import { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowRight, HiExternalLink } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'The 8 Axioms | AIM Framework',
  description:
    'The foundational axioms of the AIM Framework: irreducible premises that define the theory\'s structure, generate its predictions, and establish its falsification criteria. Each axiom is grounded in established neuroscience and behavioral research.',
  keywords: [
    'AIM axioms',
    'motivation axioms',
    'three-source taxonomy',
    'common-currency integration',
    'source opacity',
    'confabulation',
    'mimetic premium',
    'differential satiation',
    'preconscious transmission',
    'Bayesian belief dynamics',
    'neuroscience',
    'behavioral economics',
    'falsifiable theory'
  ],
  openGraph: {
    title: 'The 8 Axioms | AIM Framework',
    description:
      'The foundational axioms of the AIM Framework: irreducible premises grounded in established neuroscience and behavioral research.',
    url: 'https://www.usebettermetrics.com/axioms',
    siteName: 'Use Better Metrics',
    images: [
      {
        url: 'https://www.usebettermetrics.com/AIM Logo.png',
        width: 1200,
        height: 630,
        alt: 'AIM Framework Axioms'
      }
    ],
    locale: 'en_US',
    type: 'article'
  }
}

interface Axiom {
  number: number
  title: string
  statement: string
  explanation: string
  citations: {
    text: string
    source: string
    year: string
  }[]
  epistemicStatus: string
}

const axioms: Axiom[] = [
  {
    number: 1,
    title: 'Three-Source Taxonomy',
    statement:
      'Human motivation arises from exactly three neurologically distinct sources—Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M)—and no additional source is required for a parsimonious, falsifiable account of human motivation.',
    explanation:
      'Every action or choice draws on one or more of three distinct kinds of wanting: bodily needs and basic security (A), self-endorsed activities that remain rewarding even in private (I), and desires transmitted socially by observing what others want or value (M). The framework claims these three are sufficient—adding more categories would complicate the model without improving its explanatory power, while using fewer would blur together motivations that experiments and brain imaging clearly separate.',
    citations: [
      {
        text: 'For A (Appetites): Cannon, W. B. The Wisdom of the Body',
        source: 'W. W. Norton & Co.',
        year: '1932'
      },
      {
        text: 'For I (Intrinsic): Deci, E. L., & Ryan, R. M. Intrinsic Motivation and Self-Determination in Human Behavior',
        source: 'Plenum',
        year: '1985'
      },
      {
        text: 'For M (Mimetic): Girard, R. Deceit, Desire, and the Novel: Self and Other in Literary Structure',
        source: 'Johns Hopkins University Press',
        year: '1961'
      }
    ],
    epistemicStatus: 'Established Neuroscience + Theoretical Integration'
  },
  {
    number: 2,
    title: 'Common-Currency Integration',
    statement:
      'The three motivational sources converge in a common-currency valuation system centred in the ventromedial prefrontal cortex and ventral striatum, which encodes a single scalar subjective-value signal for each option, enabling unified choice by converting unlike inputs into a comparable metric.',
    explanation:
      'Although A, I, and M are distinct systems, the brain must eventually produce a single "do this next" decision. The valuation hub integrates all three sources into one priority signal, like mixing three audio channels into a single speaker output. This integration can often be approximated as a weighted sum: the total value of an option equals its A-value times an A-weight, plus its I-value times an I-weight, plus its M-value times an M-weight.',
    citations: [
      {
        text: 'Levy, D. J., & Glimcher, P. W. "The root of all value: a neural common currency for choice."',
        source: 'Current Opinion in Neurobiology, 22(6), 1027-1038',
        year: '2012'
      },
      {
        text: 'Chib, V. S., et al. "Evidence for a common representation of decision values for dissimilar goods in human ventromedial prefrontal cortex."',
        source: 'Journal of Neuroscience, 29(39), 12315-12320',
        year: '2009'
      },
      {
        text: 'Bartra, O., et al. "The valuation system: A coordinate-based meta-analysis of BOLD fMRI experiments."',
        source: 'NeuroImage, 76, 412-427',
        year: '2013'
      }
    ],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    number: 3,
    title: 'Source Opacity',
    statement:
      'After common-currency integration, source-specific information is not preserved in the output signal. Downstream circuits, including those supporting conscious introspection, cannot reliably identify which source generated a given motivational input from the integrated signal alone.',
    explanation:
      'Once the brain has collapsed A, I, and M into a single "I want this" feeling, it has lost the tag indicating which channel contributed what. This is not a failure of self-awareness but an architectural fact: three-dimensional input (A, I, M) has been compressed into a one-dimensional output (scalar value), necessarily discarding source information. As a result, people often cannot accurately report why they chose something—the information simply isn\'t available to conscious reflection.',
    citations: [
      {
        text: 'Nisbett, R. E., & Wilson, T. D. "Telling more than we know: Verbal reports on mental processes."',
        source: 'Psychological Review, 84(3), 231–259',
        year: '1977'
      },
      {
        text: 'Johansson, P., et al. "Failure to detect mismatches between intention and outcome in a simple decision task." (Choice Blindness)',
        source: 'Science, 310(5745), 116-119',
        year: '2005'
      }
    ],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    number: 4,
    title: 'Confabulation',
    statement:
      'The brain routinely generates sincere but inaccurate narratives about the causes of choice, filling gaps in introspection with plausible reasons that do not match the actual motivational sources. Mimetic Desire is especially vulnerable to misattribution because its signals arrive preconsciously and are integrated before conscious awareness.',
    explanation:
      'When asked to explain their choices, people construct stories that sound reasonable but are often wrong. These are not lies—the person genuinely believes their explanation—but they are post-hoc rationalisations created after the decision has already been made. Because mimetic signals operate below the threshold of awareness and are integrated before conscious thought kicks in, M-driven choices are especially likely to be misattributed to intrinsic interest or rational calculation.',
    citations: [
      {
        text: 'Gazzaniga, M. S. "Cerebral specialization and interhemispheric communication." (The "Interpreter" module)',
        source: 'Brain, 123(7), 1293-1326',
        year: '2000'
      },
      {
        text: 'Haidt, J. "The emotional dog and its rational tail: A social intuitionist approach to moral judgment."',
        source: 'Psychological Review, 108(4), 814–844',
        year: '2001'
      },
      {
        text: 'Wegner, D. M. The Illusion of Conscious Will',
        source: 'MIT Press',
        year: '2002'
      }
    ],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    number: 5,
    title: 'M as Amplifier (The Mimetic Premium)',
    statement:
      'Mimetic Desire does not generate independent objects of desire. All objects are fundamentally A-objects (satisfying physiological deficits) or I-objects (enabling intrinsic processes). M operates as an amplifying force that inflates the perceived value of these objects by attaching a Mimetic Premium (P_M) to them.',
    explanation:
      'Mimetic desire doesn\'t create new things to want—it makes existing things seem more valuable because other people want them. The Mimetic Premium is the extra value someone assigns to an object purely because of its social meaning, visibility, or status. Critically, this premium can operate even when the individual experiences no direct status-pleasure—they may simply perceive a network consensus that "this is the value," even if that consensus is itself a cascade of copied valuations.',
    citations: [
      {
        text: 'Lebreton, M., et al. "Your Goal Is Mine: Unraveling Mimetic Desires in the Human Brain."',
        source: 'Journal of Neuroscience, 32(21), 7146-7157',
        year: '2012'
      },
      {
        text: 'Zink, C. F., et al. "Know your place: neural processing of social hierarchy in humans."',
        source: 'Neuron, 58(2), 273-283',
        year: '2008'
      },
      {
        text: 'Campbell-Meiklejohn, D. K., et al. "How the opinion of others affects our valuation of objects."',
        source: 'Current Biology, 20(13), 1165-1170',
        year: '2010'
      }
    ],
    epistemicStatus: 'Established Neuroscience + Framework-Specific Integration'
  },
  {
    number: 6,
    title: 'Differential Satiation Dynamics',
    statement:
      'The three sources exhibit structurally different satiation properties. A satiates episodically and cyclically (hunger ends with eating, returns with deficit). I deepens rather than terminates (competence generates new frontiers; only specific tools/means satiate). M has no natural satiation signal—status is comparative, and reference points shift continuously as models change and rivals advance.',
    explanation:
      'Appetites have a natural stopping point—once you\'ve eaten enough or slept enough, the urge fades until the need returns. Intrinsic projects don\'t stop, but they evolve—as you get better at music or carpentry, new challenges and possibilities open up, though you may finish with a particular tool or piece. Mimetic desire, by contrast, has no endpoint—achieving a status goal simply resets the comparison to the next rung, because what matters is relative rank, not absolute achievement.',
    citations: [
      {
        text: 'For A (Cyclic): Berridge, K. C. "Motivation concepts in behavioral neuroscience."',
        source: 'Physiology & Behavior, 81(2), 179-209',
        year: '2004'
      },
      {
        text: 'For I (Deepening): Csikszentmihalyi, M. Flow: The Psychology of Optimal Experience',
        source: 'Harper & Row',
        year: '1990'
      },
      {
        text: 'For M (Non-satiating): Veblen, T. The Theory of the Leisure Class',
        source: 'Macmillan',
        year: '1899'
      }
    ],
    epistemicStatus: 'Validated Empirical Pattern'
  },
  {
    number: 7,
    title: 'Preconscious Transmission',
    statement:
      'Mimetic desire is transmitted through mirror-neuron systems and social-reward circuits at latencies of 60–340 milliseconds—prior to conscious awareness, attentional gating, or deliberate reasoning. M-signals are therefore integrated into the common-currency system before the Individual can consciously scrutinise their source.',
    explanation:
      'By the time you become consciously aware of wanting something in a social context, the mimetic signal has already been processed and fed into your decision system. Mirror neurons and social-reward circuits operate faster than conscious thought, automatically copying the goals and preferences you observe in others. This means mimetic influence is experienced as a fait accompli of desire—it feels like your own authentic wanting, not like something borrowed from someone else.',
    citations: [
      {
        text: 'Libet, B., et al. "Time of conscious intention to act in relation to onset of cerebral activity (readiness-potential)."',
        source: 'Brain, 106(3), 623-642',
        year: '1983'
      },
      {
        text: 'Rizzolatti, G., & Craighero, L. "The mirror-neuron system."',
        source: 'Annual Review of Neuroscience, 27, 169-192',
        year: '2004'
      },
      {
        text: 'Chartrand, T. L., & Bargh, J. A. "The chameleon effect: The perception-behavior link and social interaction."',
        source: 'Journal of Personality and Social Psychology, 76(6), 893–910',
        year: '1999'
      }
    ],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    number: 8,
    title: 'Bayesian Belief Dynamics',
    statement:
      'Human belief revision follows Bayesian updating, where posteriors are computed from priors and evidence, posteriors become priors for subsequent updating cycles, and the updating process is content-agnostic—it operates identically regardless of the accuracy, quality, or crisis-potential of the beliefs being processed.',
    explanation:
      'The brain updates what it believes by combining what it already believes (priors) with new information (evidence) to produce revised beliefs (posteriors), and then treats those posteriors as the starting point for the next round of updates. This machinery tracks the form of belief change—how strongly a proposition is held, how new information shifts that strength—without directly evaluating whether the proposition is true, beneficial, or catastrophic. Because the updating mechanism is content-agnostic, any pattern in the inputs—such as systematic Confabulation operating on Source-opaque signals—will be compounded over time into stable belief structures.',
    citations: [
      {
        text: 'Helmholtz, H. von. Handbuch der physiologischen Optik (Unconscious inference)',
        source: 'Leopold Voss',
        year: '1867'
      },
      {
        text: 'Tenenbaum, J. B., et al. "How to grow a mind: Statistics, structure, and abstraction."',
        source: 'Science, 331(6022), 1279–1285',
        year: '2011'
      },
      {
        text: 'Friston, K. "The free-energy principle: A unified brain theory?"',
        source: 'Nature Reviews Neuroscience, 11(2), 127–138',
        year: '2010'
      }
    ],
    epistemicStatus: 'Established Neuroscience'
  }
]

function AxiomCard({ axiom }: { axiom: Axiom }) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {axiom.number}
          </span>
          <h3 className="ml-4 text-xl font-bold text-gray-900">{axiom.title}</h3>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          {axiom.epistemicStatus}
        </span>
      </div>

      {/* Canonical Statement */}
      <div className="mb-4 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
        <p className="text-sm font-medium text-gray-900">{axiom.statement}</p>
      </div>

      {/* Explanation */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Explanation</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{axiom.explanation}</p>
      </div>

      {/* Canonical Citations */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Canonical Citations</h4>
        <ul className="space-y-1">
          {axiom.citations.map((citation, idx) => (
            <li key={idx} className="text-xs text-gray-500">
              <span className="text-gray-700">{citation.text}</span>{' '}
              <span className="italic">{citation.source}</span> ({citation.year})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AxiomsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              The 8 Axioms
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-gray-600">
              The foundational premises of the AIM Framework—irreducible theoretical commitments
              that define the theory's structure, generate its predictions, and establish its
              falsification criteria.
            </p>
            <div className="mx-auto max-w-3xl rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-gray-700">
                <strong>Epistemic Note:</strong> These axioms are treated as non-negotiable theoretical
                commitments. Any claim, application, or extension within AIM must be consistent with
                these axioms. Any empirical finding that definitively contradicts one or more of these
                axioms would constitute serious evidence for revising or rejecting the framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Axioms Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {axioms.map((axiom) => (
              <AxiomCard key={axiom.number} axiom={axiom} />
            ))}
          </div>
        </div>
      </section>

      {/* Summary Note */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-blue-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Summary Note on Axioms</h2>
            <p className="mb-6 text-gray-700">
              These eight axioms form the <strong>non-negotiable core</strong> of the AIM Framework.
              They are treated as foundational premises that define the theory's structure, generate
              its predictions, and establish its falsification criteria. Any claim, application, or
              extension within AIM must be consistent with these axioms, and any empirical finding
              that definitively contradicts one or more of these axioms would constitute serious
              evidence for revising or rejecting the framework.
            </p>
            <p className="text-gray-700">
              The remainder of the framework—specific constructs like Appetites, Intrinsic Motivation,
              Mimetic Desire, AIM weights, action episodes, etc.—instantiate these axioms in concrete,
              measurable terms.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/research/definitions"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Explore Core Definitions
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              View Full Glossary
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Ask the AI
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

