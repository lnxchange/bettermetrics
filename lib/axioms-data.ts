/**
 * The nine axioms of the AIM Framework.
 *
 * Source of truth: AIM Treatise, Chapter 4, Section 4.3 ("The Nine Core
 * Axioms"). Canonical statements are quoted from the Treatise; the plain
 * summaries and epistemic status are drawn from Chapter 4 and the component
 * table in Chapter 1, Section 1.5. Keep this file in step with the Treatise;
 * do not add gloss here that the Treatise does not support.
 */

export type EpistemicStatus =
  | 'Inherited'
  | 'Mathematically entailed'
  | 'Novel synthesis'

export interface AxiomCitation {
  text: string
  source: string
  year: string
}

export interface Axiom {
  number: number
  slug: string
  title: string
  /** One or two plain sentences for the reader who is not going to read the canonical text. */
  plain: string
  /** Verbatim canonical statement from Treatise Chapter 4. */
  statement: string
  /** Chapter 1, Section 1.5 classification. */
  status: EpistemicStatus
  statusNote?: string
  citations: AxiomCitation[]
  /** Questions handed to the chat. */
  ask: string[]
}

export const STATUS_DESCRIPTIONS: Record<EpistemicStatus, string> = {
  Inherited:
    'Taken from established, replicated scholarship. Challenging it means challenging the cited literature, not AIM.',
  'Mathematically entailed':
    'Follows from other axioms by a formal result (here, the Data Processing Inequality). Challenging it means refuting the mathematics.',
  'Novel synthesis':
    'AIM-specific. These are the claims the framework itself must defend.'
}

export const axioms: Axiom[] = [
  {
    number: 1,
    slug: 'three-source-taxonomy',
    title: 'Three-Source Taxonomy',
    plain:
      'Every want comes from one of three places: the body (Appetites), the activity itself (Intrinsic Motivation), or other people wanting it (Mimetic Desire). Nothing else is needed, and fewer would blur things the brain keeps apart.',
    statement:
      'Human motivation arises from exactly three neurologically distinct sources (Appetites, Intrinsic Motivation, and Mimetic Desire) and no additional source is required for a parsimonious, falsifiable account of human motivation.',
    status: 'Novel synthesis',
    statusNote:
      'A and I are inherited (Cannon; Deci & Ryan). The claim that these plus M are exactly three, and exhaustive, is AIM\u2019s own, defended by the bidirectional consilience argument in Chapter 4.',
    citations: [
      { text: 'Cannon, W. B. The Wisdom of the Body', source: 'W. W. Norton & Co.', year: '1932' },
      { text: 'Deci, E. L. & Ryan, R. M. Intrinsic Motivation and Self-Determination in Human Behavior', source: 'Plenum', year: '1985' },
      { text: 'Girard, R. Deceit, Desire, and the Novel', source: 'Johns Hopkins University Press', year: '1961' }
    ],
    ask: [
      'Why does AIM say there are exactly three sources of motivation and not four?',
      'Is loneliness an Appetite, Intrinsic Motivation, or Mimetic Desire?'
    ]
  },
  {
    number: 2,
    slug: 'common-currency-integration',
    title: 'Common-Currency Integration',
    plain:
      'The brain has to pick one thing to do next, so it mixes the three inputs into a single value signal, like three audio channels into one speaker. The weights on each channel shift with your state.',
    statement:
      'The three motivational sources converge in a Common-Currency valuation system centred in the ventromedial prefrontal cortex (vmPFC) and ventral striatum that encodes a single scalar subjective value signal for each Object, enabling unified choice by converting unlike inputs into a comparable metric.',
    status: 'Inherited',
    citations: [
      { text: 'Levy, D. J. & Glimcher, P. W. "The root of all value: a neural common currency for choice"', source: 'Current Opinion in Neurobiology, 22(6)', year: '2012' },
      { text: 'Chib, V. S. et al. "Evidence for a common representation of decision values for dissimilar goods in human vmPFC"', source: 'Journal of Neuroscience, 29(39)', year: '2009' },
      { text: 'Bartra, O., McGuire, J. T. & Kable, J. W. "The valuation system: a coordinate-based meta-analysis"', source: 'NeuroImage, 76', year: '2013' }
    ],
    ask: [
      'What is the AIM Integration Equation and what do the weights mean?',
      'How does the wanting-liking dissociation support common-currency integration?'
    ]
  },
  {
    number: 3,
    slug: 'source-opacity',
    title: 'Source Opacity',
    plain:
      'Once the three are mixed into one signal, the label saying which source contributed what is gone. You can feel how much you want something; you cannot read off why. This is a structural fact, not a lack of self-awareness.',
    statement:
      'After Common-Currency Integration, the source decomposition is not preserved in the output signal. Downstream circuits, including those supporting conscious introspection, cannot reliably identify which source generated a given motivational input from the integrated signal alone.',
    status: 'Mathematically entailed',
    statusNote:
      'Three inputs summed into one output is a many-to-one map; the Data Processing Inequality guarantees nothing downstream can recover what the sum discarded.',
    citations: [
      { text: 'Nisbett, R. E. & Wilson, T. D. "Telling more than we know: verbal reports on mental processes"', source: 'Psychological Review, 84(3)', year: '1977' },
      { text: 'Johansson, P. et al. "Failure to detect mismatches between intention and outcome in a simple decision task"', source: 'Science, 310(5745)', year: '2005' }
    ],
    ask: [
      'If introspection cannot tell me where a want came from, how can I ever find out?',
      'What is the Salience-Deficit Conflation Principle?'
    ]
  },
  {
    number: 4,
    slug: 'confabulation',
    title: 'Confabulation',
    plain:
      'Asked why you wanted something, your brain does not say "I don\u2019t know." It builds a plausible story and believes it. Socially caught wants are the most likely to be misfiled, because they arrive looking like a need and leave nothing behind to check.',
    statement:
      'The brain routinely generates sincere but inaccurate narratives about the causes of choice, filling gaps in introspection with plausible reasons that do not match the actual motivational sources. Mimetic Desire is especially vulnerable to misattribution because its signal is a Salience reading received under the category of deficit, and because it leaves no residue against which that reception could be checked.',
    status: 'Inherited',
    citations: [
      { text: 'Gazzaniga, M. S. "Cerebral specialization and interhemispheric communication" (the Interpreter)', source: 'Brain, 123(7)', year: '2000' },
      { text: 'Haidt, J. "The emotional dog and its rational tail"', source: 'Psychological Review, 108(4)', year: '2001' },
      { text: 'Wegner, D. M. The Illusion of Conscious Will', source: 'MIT Press', year: '2002' }
    ],
    ask: [
      'What is the Romantic Lie and how does it relate to Confabulation?',
      'Why does challenging someone\u2019s reasons make them more certain, not less?'
    ]
  },
  {
    number: 5,
    slug: 'object-parasitism',
    title: 'M as Amplifier (Object Parasitism)',
    plain:
      'Mimetic Desire never invents new things to want. It inflates the value of things that already serve the body or an intrinsic pursuit, adding a Mimetic Premium that feels like it belongs to the object itself.',
    statement:
      'Mimetic Desire does not generate its own independent Object-category. Its Salience reading falls on Objects that already carry A- or I-functional roles, and integration renders that reading as additional value attached to them, a Mimetic Premium experienced as intrinsic to the Object rather than as socially added.',
    status: 'Novel synthesis',
    statusNote:
      'Derived from the fact that mirror-neuron systems detect goal-directed action toward Objects, not Objects themselves.',
    citations: [
      { text: 'Lebreton, M. et al. "Your goal is mine: unraveling mimetic desires in the human brain"', source: 'Journal of Neuroscience, 32(21)', year: '2012' },
      { text: 'Zink, C. F. et al. "Know your place: neural processing of social hierarchy in humans"', source: 'Neuron, 58(2)', year: '2008' },
      { text: 'Campbell-Meiklejohn, D. K. et al. "How the opinion of others affects our valuation of objects"', source: 'Current Biology, 20(13)', year: '2010' }
    ],
    ask: [
      'What is the Mimetic Premium and how does Price Decomposition work?',
      'Why does AIM say status cannot be purchased?'
    ]
  },
  {
    number: 6,
    slug: 'differential-satiation',
    title: 'Differential Satiation Dynamics',
    plain:
      'Hunger ends when you eat and comes back later. Mastery never "fills up"; it opens new frontiers, though the tools you need do satiate. Status never ends at all, because it reads what others value, and there is always more to read.',
    statement:
      'The three motivational sources exhibit fundamentally different satiation profiles. Appetites satiate episodically and recur cyclically. Intrinsic Motivation does not satiate at the level of the Thinker\u2019s function (though each process the function sets closes when the state it was for is reached, and I-enabling Objects satiate at functional adequacy). Mimetic Desire does not satiate at all, because the Observer\u2019s function is continuous conditional Salience assessment over the whole perceived Object field, which cannot complete while perception continues; the reset of its reference points with each achievement is the expression of that non-satiation, not its cause.',
    status: 'Novel synthesis',
    citations: [
      { text: 'Berridge, K. C. "Motivation concepts in behavioral neuroscience"', source: 'Physiology & Behavior, 81(2)', year: '2004' },
      { text: 'Csikszentmihalyi, M. Flow: The Psychology of Optimal Experience', source: 'Harper & Row', year: '1990' },
      { text: 'Veblen, T. The Theory of the Leisure Class', source: 'Macmillan', year: '1899' }
    ],
    ask: [
      'How does Differential Satiation explain the Easterlin Paradox?',
      'What is the Mimetic Treadmill?'
    ]
  },
  {
    number: 7,
    slug: 'preconscious-transmission',
    title: 'Preconscious Transmission',
    plain:
      'You catch other people\u2019s wants faster than you can notice. By the time "I want that" is in awareness, the copied signal has already been mixed in, so it feels like your own.',
    statement:
      'The Observer\u2019s reading of other Individuals\u2019 valuations is formed and delivered to the Common-Currency system faster than conscious report, through the mirror-neuron and social-cognition systems by which a general perception channel reads the directional valence of agents; in the human substrate the best-current estimate of that latency is 60\u2013340 milliseconds. M-signals therefore reach the Common-Currency system with no accompanying phenomenology the Individual could consciously catch. That their source cannot be recovered afterwards is Source Opacity (Axiom 3), which holds whatever the latency.',
    status: 'Inherited',
    citations: [
      { text: 'Libet, B. et al. "Time of conscious intention to act in relation to onset of cerebral activity"', source: 'Brain, 106(3)', year: '1983' },
      { text: 'Caggiano, V. et al. "Mirror neurons encode the subjective value of an observed action"', source: 'PNAS, 109(29)', year: '2012' },
      { text: 'Chartrand, T. L. & Bargh, J. A. "The chameleon effect"', source: 'Journal of Personality and Social Psychology, 76(6)', year: '1999' }
    ],
    ask: [
      'Why do wisdom traditions\u2019 prohibitions on coveting have limited effect under AIM?',
      'What is the Transmission Window and the Libet Window?'
    ]
  },
  {
    number: 8,
    slug: 'bayesian-belief-dynamics',
    title: 'Bayesian Belief Dynamics',
    plain:
      'Beliefs update by weighing what you already believed against new evidence, and today\u2019s conclusion becomes tomorrow\u2019s starting point. The machinery does not care whether a belief is true, so a confabulated story gets entrenched like any other.',
    statement:
      'Human Belief revision follows Bayesian updating, where posteriors are computed from priors and evidence, posteriors become priors for subsequent updating cycles, and the updating process exhibits Content-Agnosticism: it operates identically regardless of the accuracy, quality, content, or crisis-potential of the Beliefs being processed.',
    status: 'Inherited',
    citations: [
      { text: 'Helmholtz, H. von. Handbuch der physiologischen Optik', source: 'Voss', year: '1867' },
      { text: 'Tenenbaum, J. B. et al. "How to grow a mind: statistics, structure, and abstraction"', source: 'Science, 331(6022)', year: '2011' },
      { text: 'Friston, K. "The free-energy principle: a unified brain theory?"', source: 'Nature Reviews Neuroscience, 11(2)', year: '2010' }
    ],
    ask: [
      'What is a Confabulation Cascade and when does it become self-sustaining?',
      'What are the Crisis State Phases in AIM?'
    ]
  },
  {
    number: 9,
    slug: 'agent-based-causal-default',
    title: 'Agent-Based Causal Default',
    plain:
      'When something goes wrong, the brain asks "who did this?" before "what system produced this?" Agent-shaped explanations are cheap to compute; systemic ones have to be built. So confabulation points at people, which is why distress finds scapegoats.',
    statement:
      'Human causal cognition is architecturally optimised for detecting and modelling agents (predators, prey, rivals, collaborators) and defaults to agent-based explanations when causal demands arise, because the brain\u2019s threat-detection systems, social-reasoning circuits, and theory-of-mind architecture converge on agentive causation as the computationally tractable mode of explanation. Systemic, emergent, or distributed causes exceed the computational capacity of these systems and are therefore structurally unavailable as default explanatory completions, ensuring that Confabulation (Axiom 4) characteristically takes agent-based form.',
    status: 'Inherited',
    statusNote:
      'Axiom 9 is not load-bearing for the architecture or its mathematics; Axioms 1 to 8 are. It is load-bearing for the account of the form the architecture\u2019s failures take. Refuting it would remove AIM\u2019s explanation of why confabulation is agent-shaped and why collective distress converges on scapegoats, and would leave the rest standing.',
    citations: [
      { text: 'Barrett, J. L. Why Would Anyone Believe in God?', source: 'AltaMira Press', year: '2004' },
      { text: 'Heider, F. & Simmel, M. "An experimental study of apparent behavior"', source: 'American Journal of Psychology, 57(2)', year: '1944' },
      { text: 'Rosset, E. "It\u2019s no accident: our bias for intentional explanations"', source: 'Cognition, 108(3)', year: '2008' }
    ],
    ask: [
      'Why is Axiom 9 described as not load-bearing for the architecture?',
      'How does the Agent-Based Causal Default lead to the scapegoat mechanism?'
    ]
  }
]
