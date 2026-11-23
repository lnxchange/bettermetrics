/**
 * The Minimal Architecture page.
 *
 * Canonical statements are Chapter 4, Section 4.2.1 of the AIM Treatise
 * (aim-treatise main, cfc8eac). The carried-by column is Section 4.4.2.
 * Section numbers are the current chapter: Body Manager 4.3.1, Thinker 4.3.2,
 * Observer 4.3.3, Decision Hub 4.3.4, Signed Valuation Principle 4.3.5,
 * Belief Register 4.3.6, Default Priors 4.3.7. Do not add a sentence the
 * Treatise does not supply.
 */

export type PremiseStanding =
  | 'specified by the architecture'
  | 'derived from the architecture'

export interface ConstructionPremise {
  number: number
  /** Element id. Keeps the fragments the retired cards used. */
  slug: string
  title: string
  standing: PremiseStanding
  statement: string
  gloss?: string
  /** Shown in full. Premise 9 only. */
  note?: string
  citations: string[]
  carriedBy: string
  ask: string[]
}

export interface ArchitectureComponent {
  name: string
  slug: string
  section: string
  text: string
}

const SPECIFIED: PremiseStanding = 'specified by the architecture'
const DERIVED: PremiseStanding = 'derived from the architecture'
const PREMISE_NINE =
  'The architecture and its formal results stand without Premise 9, whose default depends also on what fills the perceived field.'

export class MinimalArchitecture {
  static readonly premisesAnchor = 'construction-premises'

  static readonly title = 'The Minimal Architecture'

  /** Approved homepage hero (I-06). The linked words are "a minimal architecture". */
  static readonly hero =
    'The framework rests on a minimal architecture of four primary components and the loop that couples them, worked out mathematically. Its central results follow from that architecture, and the framework is falsifiable.'

  static readonly lead = [
    'For ease of reference, the four primary components specified in this section are referred to throughout by reader-facing names. The homeostatic-deficit signaller is the Body Manager. The prior-maintainer and Bayesian ground-resolver, the component that performs deliberative inference, is the Thinker. The continuous conditional Object-field Salience assessor is the Observer. The integrator and action-selector is the Decision Hub.',
    'The Belief Register is the architecture\u2019s state component: the persistent store over the Hypothesis Space, written only by the Thinker, read by the Observer, and computing nothing. The Belief Register is not a fifth processing component, and the minimality of the specification is a claim about the components that compute, which remain four.'
  ]

  static readonly components: ArchitectureComponent[] = [
    {
      name: 'Decision Hub',
      slug: 'decision-hub',
      section: '4.3.4',
      text: 'The Decision Hub is the component whose primary function is action-selection. The Decision Hub receives valuation inputs from the other three components, integrates them into a single Common-Currency Scalar, and emits a selected action for execution.'
    },
    {
      name: 'Body Manager',
      slug: 'body-manager',
      section: '4.3.1',
      text: 'The Body Manager is the component whose primary function is homeostatic deficit signalling and deficit-repair termination. The Body Manager produces valuation signals scaled to the deficit states of the body or body-analogous system it monitors, and terminates those signals on consumption or repair.'
    },
    {
      name: 'Thinker',
      slug: 'thinker',
      section: '4.3.2',
      text: 'The Thinker is the component whose two architecturally inseparable primary functions are, first, continuous maintenance of the priors that make assessment, recognition, and resolution possible for the whole system, and, second, Ground-Resolution, the evaluative operation that resolves whatever the Thinker is attending to into its best-supported explanation by redistributing probability mass across the Hypothesis Space, of which the resolution of the Decision Hub\u2019s tag-stripped Scalar into a ground-attribution (an answer to what the value is grounded in) is the source-attribution special case.'
    },
    {
      name: 'Observer',
      slug: 'observer',
      section: '4.3.3',
      text: 'The Observer is the component whose primary function is continuous conditional Salience assessment over the perceived Object field, conditioned on priors maintained by the Thinker.'
    },
    {
      name: 'Belief Register',
      slug: 'belief-register',
      section: '4.3.6',
      text: 'The Belief Register is the architectural form in which the Thinker\u2019s current posteriors and Salience-conditioning templates are made available for downstream access at timescales shorter than the Thinker\u2019s deliberative cycle permits. The Belief Register is not a fifth processing component, and the minimality of the specification is a claim about the components that compute, which remain four.'
    }
  ]

  static readonly loop = [
    'Together the components form one loop: the Body Manager reports a deficit, the Observer marks Objects in the field, the Thinker contributes its last resolution, the Decision Hub adds the three signals into one signed value and selects an action, and where that value poses an open question the Thinker works out an explanation of it and writes the result to the Belief Register, which shapes what the Observer marks next.',
    'At each cycle: the Body Manager reports its current deficit state; the Observer, conditioned on the Belief Register\u2019s current state, performs continuous assessment over the perceived Object field using its distinctive input stream; the Thinker\u2019s ground-resolution output from the previous cycle contributes its direct input; these three streams enter the Decision Hub; the Decision Hub compresses them into a tag-stripped Scalar and selects an action.',
    'Remove any component and the system cannot produce the observed outputs. Remove the Observer and the social world cannot enter Salience computation. Remove the Thinker and priors collapse, leaving the Observer with nothing to condition its assessment on and leaving integrated valuations with no resolver. Remove the Body Manager and deficit-repair termination is unavailable. Remove the Decision Hub and the signals cannot be integrated for action-selection. Remove the Belief Register and the Thinker\u2019s posteriors cannot condition the Observer\u2019s live computation, severing the slow path from the fast path.'
  ]

  static readonly appendix =
    'Readers with a mathematical, engineering, economic, or formal-modelling background who wish to see the operation of the architecture at each level expressed in formal terms are directed to Appendix A, which provides the formal treatment.'

  static readonly builtFrom = [
    'The derivation fixed nine premises, the Construction Premises: the empirically grounded commitments from which the Minimal Architecture Specification was built, and the minimal set the construction required.',
    'With the components specified, each premise can be located in the architecture: five are carried by its components and four are derived from it.',
    'The Construction Premises are where the architecture\u2019s construction started, not what the AIM Framework rests on. The Framework rests on the architecture (4.3 to 4.4.2), and every claim in the chapters that follow is derived from it.'
  ]

  static readonly premiseNine = PREMISE_NINE

  static readonly premises: ConstructionPremise[] = [
    {
      number: 1,
      slug: 'three-source-taxonomy',
      title: 'Three-Source Taxonomy',
      standing: SPECIFIED,
      statement:
        'Human motivation arises from exactly three functionally distinct sources (Appetites, Intrinsic Motivation, and Mimetic Desire), distinguished by what each encodes and by how each terminates, and no additional source is required for a parsimonious, falsifiable account of human motivation.',
      gloss:
        'The Three-Source Taxonomy is the claim that motivation has three sources and no more. Appetites (A) are the signals the body sends when it departs from a set-point, such as hunger, thirst and the drive to breathe, and they end when the deficit is repaired. Intrinsic Motivation (I) is engagement that is rewarding in the doing; it deepens rather than ending, though each process it sets closes when the state it was for is reached. Mimetic Desire (M) is the reading of which Objects in the perceived field stand out as mattering, with the wanting taken up from what others are seen to want as its social special case; acquiring the Object closes no deficit, so it has no end.',
      citations: [
        'Cannon, W.B. (1932). The Wisdom of the Body. W.W. Norton & Co.',
        'Deci, E.L. & Ryan, R.M. (1985). Intrinsic Motivation and Self-Determination in Human Behavior. Plenum.',
        'Girard, R. (1965). Deceit, Desire, and the Novel: Self and Other in Literary Structure. Johns Hopkins University Press. (Original work published 1961)'
      ],
      carriedBy:
        'the Body Manager (4.3.1), the Thinker (4.3.2) and the Observer (4.3.3), the three components whose signals the Decision Hub integrates.',
      ask: [
        'Why does the AIM Framework say there are exactly three sources of motivation and not four?',
        'Is loneliness an Appetite, Intrinsic Motivation, or Mimetic Desire?'
      ]
    },
    {
      number: 2,
      slug: 'common-currency-integration',
      title: 'Common-Currency Integration',
      standing: SPECIFIED,
      statement:
        'The three motivational sources converge in a Common-Currency valuation that assigns each Object a single scalar subjective value, converting unlike inputs into one comparable metric, and action-selection runs on that value. The best-current localisation of the valuation is the ventromedial prefrontal cortex (vmPFC) and the ventral striatum.',
      citations: [
        'Levy, D.J. & Glimcher, P.W. (2012). The root of all value: a neural common currency for choice. Current Opinion in Neurobiology, 22(6), 1027\u20131038.',
        'Chib, V.S., Rangel, A., Shimojo, S. & O\u2019Doherty, J.P. (2009). Evidence for a common representation of decision values for dissimilar goods in human ventromedial prefrontal cortex. Journal of Neuroscience, 29(39), 12315\u201312320.',
        'Bartra, O., McGuire, J.T. & Kable, J.W. (2013). The valuation system: A coordinate-based meta-analysis of BOLD fMRI experiments examining neural correlates of subjective value. NeuroImage, 76, 412\u2013427.'
      ],
      carriedBy: 'the Decision Hub (4.3.4).',
      ask: [
        'What is the Integration Equation in the AIM Framework and what do the weights mean?',
        'How does the wanting-liking dissociation support common-currency integration?'
      ]
    },
    {
      number: 3,
      slug: 'source-opacity',
      title: 'Source Opacity',
      standing: DERIVED,
      statement:
        'After Common-Currency Integration, the source decomposition is not preserved in the output signal: the integrated value does not determine how much each source contributed to it. Downstream circuits, including those supporting conscious introspection, read the integrated value and not the inputs that produced it (Scalar-Only Delivery), and so cannot recover the decomposition from it.',
      gloss:
        'Source Opacity does not rest on the studies listed here. It follows from the many-to-one integration of Construction Premise 2: once three contributions are summed into one value, no reading of that value recovers the three, and introspection reads the value (Scalar-Only Delivery).',
      citations: [
        'Nisbett, R.E. & Wilson, T.D. (1977). Telling more than we can know: Verbal reports on mental processes. Psychological Review, 84(3), 231\u2013259.',
        'Lebreton, M., Kawa, S., Forgeot d\u2019Arc, B., Daunizeau, J. & Pessiglione, M. (2012). Your goal is mine: Unraveling mimetic desires in the human brain. Journal of Neuroscience, 32(21), 7146\u20137157.',
        'Cantor, J.R., Zillmann, D. & Bryant, J. (1975). Enhancement of experienced sexual arousal in response to erotic stimuli through misattribution of unrelated residual excitation. Journal of Personality and Social Psychology, 32(1), 69\u201375.'
      ],
      carriedBy:
        'derived from the Decision Hub\u2019s many-to-one integration, in which three inputs yield one output (4.5.1).',
      ask: [
        'If introspection cannot tell me where a want came from, how can I ever find out?',
        'What is the Salience-Deficit Conflation Principle?'
      ]
    },
    {
      number: 4,
      slug: 'confabulation',
      title: 'Confabulation',
      standing: DERIVED,
      statement:
        'When the Individual is moved to explain something whose cause it cannot read, its default is to settle on an explanation rather than register that none is available, and the explanation it settles on is the most plausible one among those it can form, whether or not that explanation is true. Where the thing to be explained is the Individual\u2019s own wanting, the cause it cannot read is the source decomposition (Construction Premise 3), so every source-attribution introspection offers is constructed rather than read.',
      gloss:
        'Confabulation is a sincere but wrong explanation: sincere because the Individual has no introspective access to its wrongness, wrong because it fails to correspond to the state of affairs it concerns.',
      citations: [
        'Gazzaniga, M.S. (2000). Cerebral specialization and interhemispheric communication: Does the corpus callosum enable the human condition? Brain, 123(7), 1293\u20131326.',
        'Wegner, D.M. (2002). The Illusion of Conscious Will. MIT Press.',
        'Johansson, P., Hall, L., Sikstr\u00f6m, S. & Olsson, A. (2005). Failure to detect mismatches between intention and outcome in a simple decision task. Science, 310(5745), 116\u2013119.'
      ],
      carriedBy:
        'derived: Source Opacity combined with the Individual\u2019s need to give an account of their own behaviour, resolved by the Thinker (4.5.2).',
      ask: [
        'What is the Romantic Lie and how does it relate to Confabulation?',
        'Why does challenging someone\u2019s reasons make them more certain, not less?'
      ]
    },
    {
      number: 5,
      slug: 'object-parasitism',
      title: 'M as Amplifier (Object Parasitism)',
      standing: DERIVED,
      statement:
        'Mimetic Desire does not generate its own independent Object-category. Its Salience reading falls on Objects that already carry A- or I-functional roles, and integration renders that reading as additional value attached to them, a Mimetic Premium experienced as intrinsic to the Object rather than as socially added.',
      gloss:
        'Object Parasitism is the pattern in which the Mimetic reading of what others value is mis-attributed to a bodily deficit or an engagement opportunity, so that the acquisition it drives never meets the conditions that would end it, because no genuine deficit or opportunity was present.',
      citations: [
        'Lebreton, M., Kawa, S., Forgeot d\u2019Arc, B., Daunizeau, J. & Pessiglione, M. (2012). Your goal is mine: Unraveling mimetic desires in the human brain. Journal of Neuroscience, 32(21), 7146\u20137157.',
        'Caggiano, V., Fogassi, L., Rizzolatti, G., Casile, A., Giese, M.A. & Thier, P. (2012). Mirror neurons encode the subjective value of an observed action. Proceedings of the National Academy of Sciences, 109(29), 11848\u201311853.',
        'Campbell-Meiklejohn, D.K., Bach, D.R., Roepstorff, A., Dolan, R.J. & Frith, C.D. (2010). How the opinion of others affects our valuation of objects. Current Biology, 20(13), 1165\u20131170.'
      ],
      carriedBy:
        'derived: the Observer assesses the Salience of Objects in the perceived field, and those are largely the Objects the Body Manager\u2019s and the Thinker\u2019s signals are already valuing, so its reading inflates their value rather than generating an Object-class of its own (4.5.3).',
      ask: [
        'What is the Mimetic Premium and how does Price Decomposition work?',
        'Why does the AIM Framework say status cannot be purchased?'
      ]
    },
    {
      number: 6,
      slug: 'differential-satiation',
      title: 'Differential Satiation Dynamics',
      standing: SPECIFIED,
      statement:
        'The three motivational sources exhibit fundamentally different satiation profiles. Appetites satiate episodically and recur cyclically. Intrinsic Motivation does not satiate as a source (though each process it sets closes when the state it was for is reached, and I-enabling Objects satiate at functional adequacy). Mimetic Desire has no satiation: acquisition closes no deficit, because M encodes none, and M\u2019s assessment, continuous conditional Salience assessment over the whole perceived Object field, cannot complete while perception continues; the reset of its reference points with each achievement is the expression of that non-satiation, not its cause.',
      gloss:
        'Differential Satiation Dynamics is the claim that the three sources end differently: Appetites when the deficit is repaired, Intrinsic Motivation when each process reaches its goal state while the function itself continues, and Mimetic Desire not at all.',
      citations: [
        'Berridge, K.C. (2004). Motivation concepts in behavioral neuroscience. Physiology & Behavior, 81(2), 179\u2013209.',
        'Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row.',
        'Veblen, T. (1899). The Theory of the Leisure Class. Macmillan.'
      ],
      carriedBy:
        'how each component terminates: the Body Manager on deficit-correction (4.3.1), the Thinker\u2019s processes on completion while its function does not (4.3.2), and the Observer not at all (4.3.3); compared at 4.5.5.',
      ask: [
        'How does Differential Satiation explain the Easterlin Paradox?',
        'What is the Mimetic Treadmill?'
      ]
    },
    {
      number: 7,
      slug: 'preconscious-transmission',
      title: 'Preconscious Transmission',
      standing: SPECIFIED,
      statement:
        'The reading of other Individuals\u2019 valuations that M carries is formed and delivered to the Common-Currency system faster than conscious report, so the M-signal reaches the Common-Currency system with no accompanying phenomenology the Individual could consciously catch. In the human substrate the findings place that reading within 60\u2013340 milliseconds (the Transmission Window); the claim does not depend on the bounds. That its source cannot be recovered afterwards is Source Opacity (Construction Premise 3), which holds whatever the latency.',
      gloss:
        'Preconscious Transmission is the delivery of the Mimetic reading of other Individuals\u2019 valuations into integration faster than the Individual can consciously report it.',
      citations: [
        'Lepage, J.-F., Tremblay, S. & Th\u00e9oret, H. (2010). Early non-specific modulation of corticospinal excitability during action observation. European Journal of Neuroscience, 31(5), 931\u2013937.',
        'Maranesi, M., Livi, A., Fogassi, L., Rizzolatti, G. & Bonini, L. (2014). Mirror neuron activation prior to action observation in a predictable context. Journal of Neuroscience, 34(45), 14827\u201314832.',
        'Lebreton, M., Kawa, S., Forgeot d\u2019Arc, B., Daunizeau, J. & Pessiglione, M. (2012). Your goal is mine: Unraveling mimetic desires in the human brain. Journal of Neuroscience, 32(21), 7146\u20137157.'
      ],
      carriedBy: 'the Observer\u2019s channel to the Decision Hub (4.3.3).',
      ask: [
        'What is the Transmission Window?',
        'Why do wisdom traditions\u2019 prohibitions on coveting have limited effect under the AIM Framework?'
      ]
    },
    {
      number: 8,
      slug: 'bayesian-belief-dynamics',
      title: 'Bayesian Belief Dynamics',
      standing: SPECIFIED,
      statement:
        'Human Belief revision follows Bayesian updating: posteriors are computed from priors and evidence, and posteriors become priors for subsequent updating cycles. The updating rule exhibits Content-Agnosticism: it does not index on what a Belief is about or on how a prior was formed, and so has no means of discounting a prior for having entered the system wrongly.',
      gloss:
        'Bayesian updating is the rule by which a Belief is revised: it starts from the prior (the strength of the Belief before new information), weighs the Evidence (the new information bearing on the Belief), and the result, the posterior, becomes the prior for the next round. Content-Agnosticism is the property that the rule treats every subject matter identically, with no variable for whether a Belief is true or harmful.',
      citations: [
        'Helmholtz, H. von (1867). Handbuch der physiologischen Optik. Voss.',
        'Tenenbaum, J.B., Kemp, C., Griffiths, T.L. & Goodman, N.D. (2011). How to grow a mind: Statistics, structure, and abstraction. Science, 331(6022), 1279\u20131285.',
        'Friston, K. (2010). The free-energy principle: A unified brain theory? Nature Reviews Neuroscience, 11(2), 127\u2013138.'
      ],
      carriedBy:
        'the Thinker\u2019s updating rule, Bayesian updating (4.3.2), and the Belief Register (4.3.6); Bayesian Belief Dynamics, the course Beliefs take under that rule on an evidence base the architecture itself partly produces, follow from it as a consequence.',
      ask: [
        'What is Content-Agnosticism in Bayesian Belief Dynamics?',
        'What is a Confabulation Cascade and when does it become self-sustaining?'
      ]
    },
    {
      number: 9,
      slug: 'agent-based-causal-default',
      title: 'Agent-Based Causal Default',
      standing: DERIVED,
      statement:
        'Under a demand for causal closure, human causal cognition defaults to agent-based explanation: an agentive completion is reached first, and a systemic, emergent or distributed completion is reached, if at all, by deliberate processing that overrides the agentive one. Confabulation (Construction Premise 4) therefore characteristically takes agent-based form.',
      gloss:
        'The Agent-Based Causal Default is the habit of reaching an explanation that names an agent first, and a systemic explanation only by slower, deliberate effort.',
      note: PREMISE_NINE,
      citations: [
        'Barrett, J.L. (2004). Why Would Anyone Believe in God? AltaMira Press.',
        'Heider, F. & Simmel, M. (1944). An experimental study of apparent behavior. American Journal of Psychology, 57(2), 243\u2013259.',
        'Rosset, E. (2008). It\u2019s no accident: Our bias for intentional explanations. Cognition, 108(3), 771\u2013780.'
      ],
      carriedBy:
        'derived: the Observer\u2019s field is dominated by agent configurations, which update fastest, while the Thinker builds a systemic Hypothesis only by slower deliberation, so the agentive completion is reached first (the Configural Update-Rate and Transmission-Deliberation Asymmetries, 4.3.7).',
      ask: [
        'Why do the architecture and its formal results stand without Construction Premise 9?',
        'How does the Agent-Based Causal Default lead to the scapegoat mechanism?'
      ]
    }
  ]

  /** Section 4.4.2 summary table, in the Treatise's row order. */
  static readonly componentTable: {
    component: string
    purpose: string
    input: string
    output: string
    termination: string
    instantiation: string
  }[] = [
    {
      component: 'Decision Hub (integrator and action-selector)',
      purpose:
        'Action-selection from integrated valuation, the Scalar to the Thinker',
      input:
        'Body Manager\u2019s output, Observer\u2019s output, Thinker\u2019s ground-resolution output',
      output:
        'Action selection plus tag-stripped integrated Scalar fed back to the Thinker',
      termination: 'Continuous selector, no termination condition',
      instantiation:
        'Decision Hub (vmPFC and ventral striatum, per Section 4.3.4)'
    },
    {
      component: 'Body Manager (homeostatic-deficit signaller)',
      purpose: 'Homeostatic deficit signalling and deficit-repair termination',
      input: 'Internal physiological state',
      output: 'Deficit-scaled valuation signals',
      termination: 'Consumption or repair satiates (per Section 4.3.1)',
      instantiation: 'Emits A, Appetites (per Section 4.3)'
    },
    {
      component: 'Thinker (prior-maintainer and Bayesian ground-resolver)',
      purpose:
        'Prior-maintenance (about Body Manager, itself, Observer, Object field), deliberative inference, and Bayesian ground-resolution on the Scalar',
      input:
        'Experience, diagnostic evidence, structural knowledge (for priors); tag-stripped Scalar (for resolution)',
      output:
        'Posteriors written to the Belief Register; ground-attribution fed back to Decision Hub',
      termination:
        'Endogenous termination of engagement, or interruption (per Section 4.3.2)',
      instantiation: 'Emits I, Intrinsic Motivation (per Section 4.3)'
    },
    {
      component:
        'Observer (continuous conditional Object-field Salience assessor)',
      purpose: 'Continuous conditional Object-field Salience assessment',
      input:
        'Belief Register (current state) plus the distinctive input stream (observed pursuits, observed valuations, comparative-position data)',
      output: 'Salience and value signals over Objects',
      termination:
        'No termination condition (architectural; per Section 4.3.3)',
      instantiation:
        'Emits M, the Mimetic input (per Sections 4.3, 4.5.3 and 4.3.3); Mimetic Desire is the emergent phenomenological output of M-signal integration, tag-stripping, and mis-resolution under an impoverished M-Hypothesis'
    },
    {
      component: 'Belief Register (state component)',
      purpose:
        'Persistent storage of the Thinker\u2019s committed posteriors, and Salience-conditioning of the Observer',
      input:
        'Belief-Register Updates written by the Thinker following Ground-Resolution',
      output:
        'Current posteriors over the Hypothesis Space, supplied to the Observer as Salience-conditioning configuration',
      termination:
        'No termination condition; the Belief Register holds state and computes nothing',
      instantiation:
        'Emits no source signal; the store through which the Thinker\u2019s posteriors reach the Observer\u2019s live computation'
    }
  ]
}
