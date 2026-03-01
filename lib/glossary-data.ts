// lib/glossary-data.ts
// Comprehensive glossary of AIM Framework terms from Chapter 2

export interface GlossaryEntry {
  term: string
  definition: string
  explanation: string
  category: string
  relatedTerms?: string[]
  epistemicStatus?: string
}

export const glossaryCategories = [
  'All',
  'Core Constructs',
  'Mathematical and Measurement Terms',
  'Thin Normative Core',
  'Institutional Concepts',
  'Mimetic Concepts',
  'Societal Dynamics and Macromotivation',
  'AI Motivational Safety Concepts',
  'Epistemological and Philosophical Concepts',
  'Empirical and Neuroscientific Concepts',
  'Core Theorems'
]

export const glossaryEntries: GlossaryEntry[] = [
  // ============================================
  // SECTION 2.1: CORE CONSTRUCTS
  // ============================================

  {
    term: 'AIM Framework',
    definition:
      'A taxonomy of motivation that distinguishes three neurally grounded sources—Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M)—that integrate in the Decision Hub to generate a single choice signal.',
    explanation:
      'The AIM Framework posits that every choice is driven by some mix of bodily needs, enjoyment of the activity itself, and socially copied wanting, which are always combined into one scalar "this is what I will do next" impulse. AIM does not suggest new neurological phenomena; it reorganises existing evidence into a source-based map that can plug into human behavioural sciences wherever those fields currently talk about undifferentiated "preferences" or "utility."',
    category: 'Core Constructs',
    relatedTerms: ['Appetites (A)', 'Intrinsic Motivation (I)', 'Mimetic Desire (M)', 'Decision Hub'],
    epistemicStatus: 'Framework-Specific'
  },
  {
    term: 'Appetites (A)',
    definition:
      'Cyclical biological drives arising from homeostatic deficits—hunger, thirst, thermoregulation, sleep, physical safety, sexual drive—that generate urgency proportional to the deficit, temporarily satiate upon fulfillment, and predictably recur. Neural mediation: hypothalamus → orbitofrontal cortex → ventral striatum.',
    explanation:
      'Appetites are the body\'s housekeeping signals: when something falls below set-point—blood sugar drops, core temperature rises, the bladder fills—urgency climbs until the deficit is corrected, then drops sharply (satiation) until the next cycle begins. This cyclical, deficit-driven, satiable pattern distinguishes A from I and M and gives rise to A-specific behavioural signatures (predictable timing, relief-seeking, post-satiation indifference).',
    category: 'Core Constructs',
    relatedTerms: ['Intrinsic Motivation (I)', 'Mimetic Desire (M)', 'Decision Hub', 'A-Floors'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Intrinsic Motivation (I)',
    definition:
      'Interest and engagement arising from the activity itself—curiosity, competence-building, creative expression, meaning-making—generating sustained effort independent of external reward or social observation. Neural mediation: dopaminergic pathways linking VTA to prefrontal cortex, supporting exploration, learning, and self-endorsed goals.',
    explanation:
      'Intrinsic Motivation is what keeps you practising the guitar at 2am when nobody is watching and no paycheque depends on it. The signature feature is that the activity\'s own properties (challenge, novelty, personal relevance) sustain engagement. Unlike A, I does not satiate in cycles; mastery of one level opens interest in the next (deepening rather than termination). Unlike M, I does not require an audience or comparative benchmark.',
    category: 'Core Constructs',
    relatedTerms: ['Appetites (A)', 'Mimetic Desire (M)', 'Decision Hub', 'I-Domains'],
    epistemicStatus: 'Established (Self-Determination Theory)'
  },
  {
    term: 'Mimetic Desire (M)',
    definition:
      'Wanting that arises from observing others wanting—social contagion of goals transmitted preconsciously (100–300 ms) through mirror-neuron and mentalising circuits before conscious evaluation can intervene, producing desires experienced as authentic despite external origin. Neural mediation: mirror neuron system → mentalising network → ventromedial prefrontal cortex value tagging.',
    explanation:
      'Mimetic Desire is René Girard\'s insight given neural grounding: we do not only learn what to do from others; we learn what to want. The mimetic system is fast (preconscious), automatic, and invisible to introspection, which is why copied desires feel spontaneously "mine." M explains otherwise puzzling phenomena—trend cycles, speculative bubbles, collective panics—by tracing them to socially transmitted wanting rather than independent evaluation.',
    category: 'Core Constructs',
    relatedTerms: ['Appetites (A)', 'Intrinsic Motivation (I)', 'Model', 'Source Opacity'],
    epistemicStatus: 'Theoretical Synthesis (Girard + Neuroscience)'
  },
  {
    term: 'Decision Hub',
    definition:
      'The neural integration site—centred on ventromedial prefrontal cortex (vmPFC) and ventral striatum (VS)—where inputs from A, I, and M are converted to a common valuation currency ("expected utility") and compete for behavioural expression, outputting a single choice signal regardless of source mix.',
    explanation:
      'Neuroscience shows the brain does not maintain separate "appetite behaviour," "intrinsic behaviour," and "mimetic behaviour" queues; it funnels every signal through a common value-comparison process. The Decision Hub is where the three rivers merge: a status threat, a creative urge, and a hunger pang all get translated into comparable units so one action can win. This common-currency integration is why we can trade off lunch against finishing a project against chasing a promotion.',
    category: 'Core Constructs',
    relatedTerms: ['Common-Currency Integration', 'AIM Weights', 'Choice Signal'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Common-Currency Integration',
    definition:
      'The process by which qualitatively different motivational inputs (A, I, M) are translated into a single scalar value in vmPFC/VS, enabling direct comparison and trade-off across sources that have no natural common metric.',
    explanation:
      'A calorie deficit and a status slight have nothing physically in common, yet you can decide which to address first. Common-currency integration is the neural trick that makes this possible: each source\'s signal is converted to "how much do I want to act on this right now?" units. The conversion is adaptive (hunger dominates when you\'re starving) but also exploitable (M can hijack A-level urgency for non-survival targets).',
    category: 'Core Constructs',
    relatedTerms: ['Decision Hub', 'M-to-A Hijacking'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Source Opacity',
    definition:
      'The architectural feature whereby the origin of a motivational signal (A, I, or M) is not introspectively accessible to the Individual, because the Decision Hub outputs only an integrated urgency signal without source tags, making it impossible to determine by feeling alone whether a want arose from bodily deficit, genuine interest, or social contagion.',
    explanation:
      'You feel "I want that house" but you cannot feel "I want that house because my neighbour bought one and the mimetic system copied his goal." Source Opacity is structural, not a failure of attention: the Decision Hub discards source labels after integration. This is why sincere introspection cannot reliably distinguish authentic from copied desires—and why external behavioural tests (satiation patterns, audience-dependence) are required.',
    category: 'Core Constructs',
    relatedTerms: ['Confabulation', 'Decision Hub', 'Two-Question Diagnostic'],
    epistemicStatus: 'Core Axiom'
  },
  {
    term: 'Individual',
    definition:
      'The unit of analysis in AIM: a single human being whose Decision Hub integrates A, I, and M signals to produce choices, and whose choices aggregate into population-level patterns.',
    explanation:
      'AIM capitalises "Individual" to mark it as a technical term. The framework is methodologically individualist in the sense that all macro phenomena (markets, cultures, crises) are explained by aggregating Individual-level AIM dynamics—but Individuals are not isolated atoms; their M-signals depend essentially on observing other Individuals.',
    category: 'Core Constructs',
    relatedTerms: ['Decision Hub', 'AIM Profile'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Object',
    definition:
      'Anything toward which motivational energy can be directed—a good, service, experience, status position, relationship, goal, or abstract target—that can carry A-, I-, and/or M-valence and whose AIM index may shift over time or across Individuals.',
    explanation:
      'AIM capitalises "Object" to flag that it is not limited to physical things. A promotion, a romantic partner, a philosophical insight, and a sandwich are all Objects in AIM\'s sense. The same Object can be pursued for different source-mixes by different Individuals or by the same Individual at different times.',
    category: 'Core Constructs',
    relatedTerms: ['AIM Index', 'Mimetic Premium'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Model',
    definition:
      'Any Individual whose observed wanting triggers mimetic transmission in the observer—the person from whom desires are copied, whether consciously admired, envied, or merely noticed.',
    explanation:
      'In AIM, "Model" is a role, not a personality type: anyone can be a Model for anyone else in a given context. Your colleague who just bought a sports car, the influencer on your feed, and your older sibling can all function as Models whose desires you import. Model selection is itself partly mimetic (we copy who others copy) and partly driven by prestige cues.',
    category: 'Core Constructs',
    relatedTerms: ['Mimetic Desire (M)', 'Prestige-Biased Learning', 'Social Proof'],
    epistemicStatus: 'Core Definition (Girardian)'
  },
  {
    term: 'Status',
    definition:
      'Relative social rank inferred from observable cues (wealth displays, prestige markers, deference received), functioning as a powerful M-Object because it signals "this Individual\'s goals are worth copying."',
    explanation:
      'Status is the meta-Object of Mimetic Desire: high-status Individuals become Models for others, so pursuing status is pursuing the capacity to shape others\' wants. Because status is comparative (your rank depends on others\' ranks), it has no satiation point—a feature that distinguishes M-dominant pursuits from A and I.',
    category: 'Core Constructs',
    relatedTerms: ['Mimetic Desire (M)', 'Model', 'Positional Goods'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Confabulation',
    definition:
      'The brain\'s routine tendency to generate sincere but inaccurate narratives about why a choice was made, filling in gaps in introspection with plausible reasons that do not match the actual motivational causes in A, I, and M. Critically, confabulations are incorporated into the Individual\'s self-model and enter subsequent Bayesian updates as if they were veridical evidence about the want\'s origin rather than being recognised as post-hoc construction, producing compounding error over time.',
    explanation:
      'Confabulation happens when a person explains their own decisions in a way that feels honest to them, but that story is actually a plausible narrative created after the fact, rather than the truth of what drove the choice. Mimetic signals are processed extremely quickly (100-300ms) and preconsciously, so by the time the person can reflect, the mimetic pull has already shaped the choice and the slower narrative system invents rational, principled, or intrinsic reasons that feel true but misidentify Mimetic Desire as something else.',
    category: 'Core Constructs',
    relatedTerms: ['Source Opacity', 'Confabulation Cascade', 'I-Override'],
    epistemicStatus: 'Core Axiom'
  },
  {
    term: 'I-Override',
    definition:
      'The deliberate, effortful cognitive process by which the I-system scrutinises an integrated urgency signal, attempts to infer its source composition (A, I, or M), and, when M-dominance is suspected, down-regulates the mimetic contribution so that action can align with A-needs and I-values rather than copied wanting.',
    explanation:
      'I-Override is the closest thing AIM offers to "free will in action." It is not automatic; it requires cognitive resources, conceptual vocabulary (the AIM categories), and often external support (behavioural tests, trusted interlocutors). Even successful I-Override does not eliminate M—it re-weights the Decision Hub\'s inputs so that I can lead. The two-question diagnostic is a practical tool designed to trigger and support I-Override.',
    category: 'Core Constructs',
    relatedTerms: ['Two-Question Diagnostic', 'Source Opacity', 'Confabulation'],
    epistemicStatus: 'Framework-Specific'
  },
  {
    term: 'I-Override Capacity',
    definition:
      'The Individual\'s available cognitive and material resources for performing I-Override—including working-memory bandwidth, emotional regulation, A-security (freedom from acute deficit), practice with source-discrimination, and access to AIM conceptual vocabulary.',
    explanation:
      'I-Override is expensive: it requires slow, deliberate processing that competes with faster automatic systems. When A-deficits are acute (hunger, exhaustion, financial terror), cognitive resources are diverted to survival, and I-Override Capacity drops. This is why A-Floors are foundational to M-management: you cannot think clearly about whether your desire is mimetic if you\'re starving.',
    category: 'Core Constructs',
    relatedTerms: ['I-Override', 'A-Floors', 'Knowledge Patch'],
    epistemicStatus: 'Framework-Specific'
  },
  {
    term: 'Entanglement',
    definition:
      'The condition in which A-, I-, and M-signals become so intertwined within a single Object or pursuit that clean source-separation is practically impossible, even with AIM vocabulary and deliberate effort.',
    explanation:
      'A career can serve genuine creative interest (I), provide income for survival needs (A), and confer status (M) simultaneously—and the three may reinforce each other until untangling them is intractable. Entanglement is not error; it is normal. AIM\'s diagnostic tools aim for "good enough" source-inference, not perfect decomposition.',
    category: 'Core Constructs',
    relatedTerms: ['Source Opacity', 'Lead-Tag-Last Heuristic'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Two-Question Diagnostic',
    definition:
      'A behavioural heuristic for inferring M-dominance by asking: (1) "Would I still want this if no one could ever know I had it?" (audience removal), and (2) "Would I still want this if the person I most associate with it stopped wanting it?" (model removal). Two "no" answers suggest M is the dominant source.',
    explanation:
      'The diagnostic exploits the signature features of M: dependence on social observation and on model-transmitted goals. If removing the audience or the model collapses the desire, that desire was probably not rooted in bodily need or self-endorsed value. The diagnostic is a heuristic, not a proof—Entanglement and Confabulation can complicate results—but it provides a practical entry point for I-Override.',
    category: 'Core Constructs',
    relatedTerms: ['I-Override', 'Source Opacity', 'Mimetic Desire (M)'],
    epistemicStatus: 'Framework-Specific Diagnostic'
  },
  {
    term: 'Action Episode',
    definition:
      'An action episode is an instance of observable behaviour, with a clear start and end, that shows what the Decision Hub has actually chosen to do next given the current mix of A, I, and M. AIM uses these discrete episodes as the basic units for inferring AIM weights and diagnosing motivational composition.',
    explanation:
      'Rather than labelling a whole life, AIM looks at concrete instance of behaviour, such as "wrote this report from 3–5pm" or "bought this particular product during this shopping trip." Each episode has a clear beginning and end and is analysed on its own terms to infer how much A, I, and M contributed to it being undertaken.',
    category: 'Core Constructs',
    relatedTerms: ['Decision Hub', 'AIM Weights', 'Behavioural Signatures'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Structural Restlessness',
    definition:
      'Structural Restlessness is the architecturally necessary condition whereby stable, final satisfaction is unavailable to any Individual, arising from the differential satiation dynamics of the three sources: Appetites satiate episodically but recur cyclically; Intrinsic Motivation generates functional satiation of means once they are acquired - but Intrinsic Motivation deepens rather than terminates as competence expands; Mimetic Desire has no satiation mechanism because status is comparative and reference points shift continuously.',
    explanation:
      'There is no finish line for human wanting—not because something is wrong with people, but because of how the three motivational systems work. Hunger goes away after eating but returns tomorrow (A-cyclical). Mastering a skill satisfies the need for that skill but opens new horizons (I-deepening). Achieving status only resets the comparison to whoever is now ahead (M-non-satiating). This is not a design flaw but a structural feature.',
    category: 'Core Constructs',
    relatedTerms: ['Appetites (A)', 'Intrinsic Motivation (I)', 'Mimetic Desire (M)', 'Reference Point Reset'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'Behavioural Signatures',
    definition:
      'Behavioural signatures are distinctive, observable patterns in how people act over time—such as when they start, persist, switch, or stop activities—that allow informed inference about the underlying mix of Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).',
    explanation:
      'Instead of relying on what people say about their motives, AIM looks at traces in behaviour: whether actions track hunger cycles, continue in private, collapse without an audience, or change at natural breakpoints. These patterns give more reliable clues about what was really driving the choice than verbal explanations, which are often confabulated after the fact.',
    category: 'Core Constructs',
    relatedTerms: ['Action Episode', 'Two-Question Diagnostic', 'Source Opacity'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'High-Observability Goods',
    definition:
      'Objects whose consumption or possession is inherently visible to others—luxury cars, designer clothing, prestigious addresses—making them natural vehicles for status signalling and therefore prone to M-inflation.',
    explanation:
      'A good\'s observability determines how effectively it can serve mimetic functions. A watch worn on the wrist signals status; an equally expensive internal home improvement does not. High-observability goods attract Mimetic Premium because they communicate to potential Models and observers, amplifying their M-valence beyond any A or I utility.',
    category: 'Core Constructs',
    relatedTerms: ['Mimetic Premium', 'Status', 'Low-Observability Goods'],
    epistemicStatus: 'Core Definition'
  },
  {
    term: 'High-Observability Sectors',
    definition:
      'Industries or economic sectors—luxury goods, real estate in prestige locations, higher education, speculative assets—where social visibility amplifies Mimetic Desire\'s influence on prices and demand.',
    explanation:
      'Sectors become high-observability when their products are seen, discussed, and compared. Real estate in "good" postcodes, university rankings, and art markets are examples. These sectors are particularly vulnerable to M-driven bubbles because mimetic feedback loops can inflate prices far beyond A or I fundamentals.',
    category: 'Core Constructs',
    relatedTerms: ['High-Observability Goods', 'Mimetic Premium', 'Mimetic Bubble'],
    epistemicStatus: 'Core Definition'
  },

  // ============================================
  // SECTION 2.2: MATHEMATICAL AND MEASUREMENT TERMS
  // ============================================

  {
    term: 'AIM Weights (wA, wI, wM)',
    definition:
      'The relative contributions of Appetites, Intrinsic Motivation, and Mimetic Desire to a given choice or Object, expressed as non-negative weights summing to one (wA + wI + wM = 1), representing the proportional influence of each source on the Decision Hub\'s output for that Action Episode.',
    explanation:
      'AIM weights are the framework\'s core measurement construct. For any specific choice—buying a car, choosing a career, scrolling social media—we can ask: how much was this driven by bodily need (wA), genuine engagement (wI), or copied wanting (wM)? Weights are inferred from behavioural signatures, not self-report, because Source Opacity makes introspection unreliable.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Profile', 'AIM Index', 'Lead-Tag-Last Heuristic'],
    epistemicStatus: 'Framework-Specific Measurement'
  },
  {
    term: 'AIM Profile',
    definition:
      'A characterisation of an Individual\'s typical distribution of AIM weights across their choices over time, representing their baseline motivational composition—e.g., "A-dominant" (survival-focused), "I-dominant" (engagement-focused), or "M-dominant" (status-focused).',
    explanation:
      'While each Action Episode has its own AIM weights, Individuals tend toward stable patterns: some people chronically prioritise security, others chase flow states, others track status obsessively. The AIM Profile captures this dispositional tendency, useful for predicting how an Individual will respond to different incentives or environments.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Weights', 'Action Episode'],
    epistemicStatus: 'Framework-Specific Measurement'
  },
  {
    term: 'AIM Index',
    definition:
      'A good-level or sector-level measure of the typical AIM-weight composition of demand—capturing, for instance, that bottled water is mostly A-driven while luxury watches are mostly M-driven.',
    explanation:
      'The AIM Index extends individual-level AIM weights to Objects and markets. A product with high wM in its index is one people typically buy for status rather than function or enjoyment. AIM indices can shift over time (Mimetic Drift) and vary across populations.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Weights', 'Mimetic Drift', 'GDPA, GDPI, GDPM'],
    epistemicStatus: 'Framework-Specific Measurement'
  },
  {
    term: 'AIM Integration Equation',
    definition:
      'The formal representation of how the Decision Hub combines A, I, and M inputs into a single choice signal: Choice = f(wA·A + wI·I + wM·M), where f is a function that selects the action with the highest integrated value.',
    explanation:
      'The equation is a simplified model of common-currency integration. It says: take each source\'s current intensity, weight it by its influence on this Individual for this Object, sum them, and pick the option with the highest total. The actual neural process is more complex, but the equation captures the key insight that qualitatively different signals compete on a common scale.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['Decision Hub', 'Common-Currency Integration', 'AIM Weights'],
    epistemicStatus: 'Framework-Specific Formalism'
  },
  {
    term: 'GDPA, GDPI, GDPM',
    definition:
      'GDPA, GDPI, and GDPM are aggregate measures decomposing total economic activity into the share predominantly driven by appetitive motives (A), intrinsic motives (I), and mimetic motives (M), obtained by aggregating good-level AIM indices across the economy.',
    explanation:
      'Instead of treating GDP as one big number, AIM splits it into three streams: how much production mainly serves bodily and safety needs, how much mainly supports intrinsically valuable activity, and how much mainly fuels status games. This decomposition makes it possible to say, for example, that a country\'s extra growth went mostly into M-heavy sectors rather than improving basic security or meaningful opportunities.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Index', 'Mimetic Premium', 'Post-Appetitive Economy'],
    epistemicStatus: 'Proposed Metric'
  },
  {
    term: 'Mimetic Premium (PM)',
    definition:
      'The portion of an Object\'s price attributable to its status-signalling function rather than its Appetitive utility or Intrinsic quality—the markup buyers pay because others are seen wanting the Object.',
    explanation:
      'A handbag that costs $50 to make and sells for $5,000 carries a $4,950 mimetic premium. The premium exists because the bag\'s primary function is not carrying things but signalling status. PM extraction is the economic engine of M-dominant sectors and a key driver of inequality in post-appetitive economies.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['Veblen Good', 'Status', 'High-Observability Goods'],
    epistemicStatus: 'Framework-Specific Measurement'
  },
  {
    term: 'Mimetic Drift',
    definition:
      'Mimetic drift is temporal change in a good\'s or sector\'s AIM index—particularly shifts in wM—as social meanings, marketing, and visibility patterns reclassify goods from mainly A- or I-driven to more status-driven, or vice versa.',
    explanation:
      'Over time, the same thing can move from "plain staple" to "status item" or back again—for example, coffee shifting from a basic stimulant to a craft lifestyle marker. Mimetic drift tracks these shifts in the typical A, I, and M mix, which matters for tax design, inequality analysis, and predicting bubbles.',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Index', 'Mimetic Premium'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Lead-Tag-Last Heuristic',
    definition:
      'The Lead-Tag-Last heuristic is a descriptive convention for characterizing mixed-motivation Action Episodes by identifying the dominant source (Lead: highest intensity wA, wI, or wM), the secondary source (Tag: non-trivial but lower influence), and the tertiary source (Last: minimal contribution), acknowledging that most real behaviours combine multiple sources while having one primary driver.',
    explanation:
      'Most real desires are not purely A, I, or M—they combine multiple sources with different weights. The Lead-Tag-Last heuristic provides a concise format for describing this mix without forcing choices into artificial pure categories. Example: pursuing a prestigious degree might be "M-led (status signaling), A-tagged (financial security), I-last (some genuine subject interest)."',
    category: 'Mathematical and Measurement Terms',
    relatedTerms: ['AIM Weights', 'Action Episode', 'AIM Profile'],
    epistemicStatus: 'Measurement Heuristic'
  },

  // ============================================
  // SECTION 2.3: THIN NORMATIVE CORE
  // ============================================

  {
    term: 'Freedom (AIM Definition)',
    definition:
      'Freedom, in AIM terms, is the state in which intrinsic motivation can reliably lead action while appetites are adequately regulated and mimetic pressures are recognised and bounded, so that life choices are not dictated by deprivation or status panic.',
    explanation:
      'AIM redefines freedom not as absence of constraint but as the condition where I can lead. You are free when you can choose based on genuine engagement rather than survival desperation (A-capture) or copied wanting you mistake for your own (M-capture). This makes freedom a matter of degree, not binary, and ties it to institutional conditions (A-floors, I-domains, M-governance).',
    category: 'Thin Normative Core',
    relatedTerms: ['I-Override', 'A-Floors', 'I-Domains', 'Visibility Governance'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Dignity',
    definition:
      'The recognition that every Individual possesses the three-source motivational architecture and therefore has legitimate A-needs, I-capacities, and M-vulnerabilities deserving of respect and institutional accommodation.',
    explanation:
      'Dignity in AIM is not metaphysical but architectural: every human has the same basic motivational structure, which grounds equal moral standing. Policies that deny A-floors, suppress I-expression, or exploit M-vulnerabilities violate dignity because they treat Individuals as if they lacked the architecture they actually possess.',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Floors', 'I-Domains', 'Consent'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Consent (AIM Definition)',
    definition:
      'Agreement given under conditions where A is adequately secured, I is not suppressed, and M-pressures are recognised, such that the choice reflects the Individual\'s source-aware evaluation rather than desperation, coercion, or unrecognised mimetic capture.',
    explanation:
      'Standard consent theory asks "did they agree?" AIM asks "under what motivational conditions did they agree?" Consent given while starving (A-capture) or under intense status pressure (M-capture) is compromised even if formally voluntary. Valid consent requires sufficient I-Override Capacity to evaluate the choice.',
    category: 'Thin Normative Core',
    relatedTerms: ['I-Override Capacity', 'Coercion', 'Exploitation'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Coercion',
    definition:
      'Manipulation of another Individual\'s motivational state—typically by threatening A-deprivation or exploiting M-vulnerabilities—to override their I-led preferences and compel compliance.',
    explanation:
      'Coercion in AIM is not limited to physical force. Threatening someone\'s job (A-threat) or their social standing (M-threat) to extract compliance is coercive because it bypasses their capacity for I-led choice. The framework makes visible forms of coercion that standard accounts may miss.',
    category: 'Thin Normative Core',
    relatedTerms: ['Consent', 'A-Floors', 'M-Capture'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Exploitation',
    definition:
      'Systematic extraction of value from Individuals whose compromised I-Override Capacity (due to A-deficits, M-capture, or Source Opacity) prevents them from recognising or resisting unfavourable terms.',
    explanation:
      'Exploitation in AIM is structural, not just interpersonal. When institutions are designed to keep workers in A-precarity or consumers in M-capture, they exploit systematically. The framework provides tools for identifying exploitation that might otherwise be rationalised as "free exchange."',
    category: 'Thin Normative Core',
    relatedTerms: ['Coercion', 'I-Override Capacity', 'A-Floors'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'A-Harm',
    definition:
      'Damage to an Individual\'s capacity to meet Appetitive needs—threats to survival, health, shelter, or basic security.',
    explanation:
      'A-Harm is the most urgent category because A-deficits impair everything else: you cannot pursue meaning or manage status anxiety while starving. Preventing A-Harm is the foundation of the AIM normative framework.',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Floors', 'A-Rights', 'Cascading Consequences'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'I-Harm',
    definition:
      'Damage to an Individual\'s capacity for intrinsically motivated activity—suppression of curiosity, creativity, meaning-making, or self-directed engagement.',
    explanation:
      'I-Harm occurs when environments crush exploration, punish authentic expression, or reduce all activity to extrinsic reward-seeking. Educational systems that kill curiosity, workplaces that micromanage all autonomy, and social contexts that ridicule genuine interests all inflict I-Harm.',
    category: 'Thin Normative Core',
    relatedTerms: ['I-Domains', 'I-Rights', 'Intrinsic Motivation (I)'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'M-Harm',
    definition:
      'Damage inflicted through mimetic dynamics—status destruction, social exclusion, reputational attack, or deliberate triggering of M-alarm states.',
    explanation:
      'M-Harm recognises that social and status-based attacks cause real suffering, even when no A-need is directly threatened. Deliberate humiliation, exclusion from status-conferring groups, and reputational destruction are forms of harm the framework takes seriously.',
    category: 'Thin Normative Core',
    relatedTerms: ['M-Alarm', 'Status', 'Scapegoat Mechanism'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'A-Rights / A-Duties',
    definition:
      'The entitlement of every Individual to conditions that secure adequate A-satisfaction (food, shelter, health, safety), and the corresponding duty of institutions and other Individuals not to deprive or obstruct A-access.',
    explanation:
      'A-Rights are the most fundamental in AIM\'s cascading structure: without A-security, I-Override Capacity is compromised and Individuals become vulnerable to M-exploitation. A-Duties fall on those with capacity to ensure A-floors.',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Floors', 'A-Harm', 'Cascading Structure of Rights'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'I-Rights / I-Duties',
    definition:
      'The entitlement of every Individual to conditions that permit intrinsically motivated activity (time, resources, domains free from A-precarity and M-domination), and the corresponding duty to protect I-spaces from colonisation.',
    explanation:
      'I-Rights protect the space for genuine engagement—the right to pursue learning, creativity, and meaning without having every moment captured by survival needs or status competition. I-Duties require maintaining I-domains and resisting their conversion to M-arenas.',
    category: 'Thin Normative Core',
    relatedTerms: ['I-Domains', 'I-Harm', 'Intrinsic Motivation (I)'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'M-Rights / M-Duties',
    definition:
      'The entitlement to participate in social life without predatory M-exploitation, and the duty to refrain from deliberately triggering M-alarm, weaponising status, or designing systems that capture Individuals in M-dominance against their reflective interests.',
    explanation:
      'M-Rights acknowledge that social participation is a legitimate human need while protecting against its weaponisation. M-Duties prohibit deliberate M-exploitation (status destruction, mimetic manipulation) and require visibility governance.',
    category: 'Thin Normative Core',
    relatedTerms: ['M-Harm', 'Visibility Governance', 'Mimetic Desire (M)'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Cascading Structure of Rights and Duties',
    definition:
      'The principle that A-rights must be secured before I-rights can be meaningfully exercised, and I-rights must be protected before M can be effectively governed—creating a sequential priority structure for policy intervention.',
    explanation:
      'The cascade reflects motivational architecture: A-deficits overwhelm I-capacity, and I-deficits leave Individuals vulnerable to M-capture. Policy that tries to govern M without securing A-floors will fail because desperate people cannot perform I-Override. The cascade is not absolute—all three matter—but it establishes intervention priority.',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Rights', 'I-Rights', 'M-Rights', 'A-Floors'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Cascading Consequences',
    definition:
      'The downstream effects that flow from violations at each level of the rights cascade—A-harm producing I-impairment producing M-vulnerability, or M-capture producing I-suppression producing A-neglect.',
    explanation:
      'Cascading consequences mean that harm at one level propagates. Poverty (A-harm) makes education harder (I-harm) and increases status anxiety (M-vulnerability). Status loss (M-harm) can destroy careers (A-harm) and meaning (I-harm). Policy must trace these cascades.',
    category: 'Thin Normative Core',
    relatedTerms: ['Cascading Structure of Rights', 'A-Harm', 'I-Harm', 'M-Harm'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Cascading Support',
    definition:
      'Institutional provisions that build upward through the cascade: A-floors enabling I-Override Capacity, I-domains providing alternative sources of meaning that reduce M-dependence, M-governance preventing mimetic capture that would erode I and threaten A.',
    explanation:
      'Cascading support is the positive flip of cascading consequences: securing each level enables the next. Universal basic services (A-support) free cognitive resources for engagement (I-support), and protected I-domains reduce the grip of status competition (M-management).',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Floors', 'I-Domains', 'Visibility Governance'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'AIM-Defined Justice',
    definition:
      'A distribution of resources, opportunities, and institutional arrangements that secures A-floors for all, protects I-domains from colonisation, and bounds M-dynamics to prevent predatory status extraction—evaluated by whether Individuals can achieve I-led lives.',
    explanation:
      'AIM-defined justice is not strict equality (some inequality may be I-enhancing) nor pure liberty (some constraints protect A and bound M). It is the institutional configuration that maximises the population\'s capacity for I-led flourishing across the life course.',
    category: 'Thin Normative Core',
    relatedTerms: ['AIM-Defined Fairness', 'AIM-Defined Equality', 'A-Floors'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'AIM-Defined Fairness',
    definition:
      'Procedures and rules that do not systematically exploit Source Opacity, A-precarity, or M-vulnerability to extract value from some Individuals for the benefit of others.',
    explanation:
      'Fairness in AIM means the rules of the game do not weaponise motivational architecture. A "fair" market that relies on A-desperation to depress wages or M-capture to inflate prices is not fair in AIM terms, even if technically voluntary.',
    category: 'Thin Normative Core',
    relatedTerms: ['AIM-Defined Justice', 'Exploitation', 'Consent'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'AIM-Defined Equality',
    definition:
      'Equal moral standing grounded in shared motivational architecture, requiring equal A-entitlements, equal access to I-domains, and equal protection from M-predation—not necessarily equal outcomes.',
    explanation:
      'Equality in AIM is architectural: every Individual has the same three-source structure and deserves the same foundational protections. Outcome inequality is acceptable if it reflects I-led choices from positions of A-security and M-awareness; it is unacceptable if it results from A-exploitation or M-capture.',
    category: 'Thin Normative Core',
    relatedTerms: ['Dignity', 'AIM-Defined Justice', 'A-Floors'],
    epistemicStatus: 'Normative Principle'
  },
  {
    term: 'Four Dimensions of M-Management',
    definition:
      'The four institutional levers for governing Mimetic Desire without attempting to eliminate it: (1) A-Floors (securing appetitive needs to preserve I-Override Capacity), (2) I-Domains (protecting spaces for intrinsic engagement), (3) Visibility Governance (regulating observability infrastructure), and (4) Opt-Out Preservation (maintaining exit options from M-dominant arenas).',
    explanation:
      'M cannot be eliminated—mimesis is fundamental to human cognition—but it can be managed. The four dimensions work together: A-floors provide the resources for clear thinking, I-domains offer alternatives to status games, visibility governance limits M-amplification, and opt-out preservation ensures no one is trapped.',
    category: 'Thin Normative Core',
    relatedTerms: ['A-Floors', 'I-Domains', 'Visibility Governance', 'Opt-Out Preservation'],
    epistemicStatus: 'Policy Framework'
  },

  // ============================================
  // SECTION 2.4: INSTITUTIONAL CONCEPTS
  // ============================================

  {
    term: 'A-Floors (Appetitive Floors)',
    definition:
      'Institutional guarantees ensuring every Individual\'s basic Appetitive needs (food, shelter, healthcare, physical safety) are met unconditionally, providing the material foundation for I-Override Capacity and protection against A-based coercion.',
    explanation:
      'A-Floors are the bedrock of AIM policy. Without them, Individuals lack the cognitive resources for source-discrimination, become vulnerable to exploitation, and cannot meaningfully exercise I-led choice. Universal basic services, guaranteed income, and robust safety nets are A-Floor mechanisms.',
    category: 'Institutional Concepts',
    relatedTerms: ['A-Rights', 'I-Override Capacity', 'Cascading Support'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'I-Domains (Intrinsic Domains)',
    definition:
      'Protected spaces—physical, temporal, and social—where intrinsically motivated activity can flourish without A-precarity or M-contamination: libraries, parks, amateur sports leagues, educational settings focused on learning rather than credentialing, creative communities.',
    explanation:
      'I-Domains are environments designed to support engagement for its own sake. They require protection from two threats: A-precarity (having to monetise every moment) and M-colonisation (turning every activity into status competition). Public investment in I-Domains is investment in population-level I-Override Capacity.',
    category: 'Institutional Concepts',
    relatedTerms: ['I-Rights', 'Intrinsic Motivation (I)', 'Low-Theatre Environments'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Visibility Governance',
    definition:
      'Regulatory frameworks managing the observability infrastructure—social media algorithms, advertising, status-display norms—that amplifies or dampens Mimetic Desire, aiming to prevent runaway M-escalation without suppressing beneficial social learning.',
    explanation:
      'Visibility governance recognises that M-intensity depends on observability: desires you never see cannot be copied. By regulating what gets amplified (algorithmic curation), what gets displayed (advertising norms), and what remains private (data protection), institutions can dampen M without eliminating it.',
    category: 'Institutional Concepts',
    relatedTerms: ['Four Dimensions of M-Management', 'Observability Infrastructure', 'Algorithmic Amplification'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Opt-Out Preservation',
    definition:
      'Institutional guarantees that Individuals can exit M-dominant arenas (competitive career tracks, status-heavy social contexts, observability-maximising platforms) without catastrophic A-consequences or social death.',
    explanation:
      'Opt-out is the escape valve for M-dominance. If leaving the status race means homelessness or total isolation, no one can leave. Preserving viable opt-out requires A-floors (exit doesn\'t mean starvation), I-domains (alternative sources of meaning), and social acceptance of non-competitive life paths.',
    category: 'Institutional Concepts',
    relatedTerms: ['Four Dimensions of M-Management', 'A-Floors', 'Exit Options'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Knowledge Patch',
    definition:
      'Population-level dissemination of AIM conceptual vocabulary—the two-question diagnostic, source-discrimination categories, mimetic recognition—enabling Individuals to perform I-Override without requiring changes to underlying neural architecture.',
    explanation:
      'The Knowledge Patch is AIM\'s primary intervention at the individual level. Source Opacity cannot be fixed (it\'s architectural), but its effects can be mitigated if people have the concepts to question their desires. The patch works by making M-detection possible through learned categories rather than evolved intuition.',
    category: 'Institutional Concepts',
    relatedTerms: ['Two-Question Diagnostic', 'I-Override', 'Mimetic Recognition'],
    epistemicStatus: 'Proposed Intervention'
  },
  {
    term: 'Institutional Buffering',
    definition:
      'Structural arrangements that insulate Individuals from direct M-to-M competition by mediating status comparisons through institutions (tenure systems, seniority rules, professional certifications) rather than raw mimetic signalling.',
    explanation:
      'Institutional buffering dampens M by inserting rules and procedures between Individuals and status outcomes. Academic tenure, union seniority, and professional licensing all buffer: they provide status through institutional channels rather than direct mimetic competition, reducing the intensity of M-dynamics.',
    category: 'Institutional Concepts',
    relatedTerms: ['Visibility Governance', 'Status', 'M-Management'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Buying Time Strategy',
    definition:
      'The nonutopian intervention approach of deploying knowledge patches and institutional buffers to maintain subcriticality (P(H) < Pc) indefinitely, thereby deferring catastrophic mimetic crisis without claiming to eliminate Mimetic Desire, cure Source Opacity, or achieve perfect motivational transparency—accepting that terminal crisis is mathematically possible but practically deferrable through continuous corrective effort.',
    explanation:
      'The buying-time strategy rejects both utopian confidence ("we will solve this forever") and fatalistic resignation ("crisis is inevitable, so why try?"). It accepts that Source Opacity is structural, Mimetic Desire will always produce escalation pressure, and catastrophic crisis is always mathematically possible. But it insists that practical subcriticality is achievable through continuous corrective effort.',
    category: 'Institutional Concepts',
    relatedTerms: ['Knowledge Patch', 'Subcriticality Threshold', 'Institutional Buffering'],
    epistemicStatus: 'Proposed Intervention'
  },
  {
    term: 'Positional Goods (AIM Integration)',
    definition:
      'Objects whose value to any Individual depends primarily on relative scarcity and social comparison rather than on Appetitive function or Intrinsic quality, such that their value decreases as more Individuals possess them, creating inherently zero-sum competition where one person\'s gain in Status necessarily reduces others\' relative standing.',
    explanation:
      'Positional goods are M-heavy by definition: their value comes from being ahead of others, not from intrinsic properties. A prestigious address, an elite credential, a rare collectible—all derive value from exclusivity. Positional consumption is structurally non-satiable because relative position is zero-sum.',
    category: 'Institutional Concepts',
    relatedTerms: ['Status', 'Mimetic Premium', 'Zero-Sum Competition'],
    epistemicStatus: 'Established Economics (Hirsch)'
  },
  {
    term: 'Hedonic Treadmill',
    definition:
      'The empirical phenomenon whereby gains in income, status, or consumption produce only temporary increases in subjective well-being before adaptation returns the Individual to baseline—explained in AIM by Reference Point Reset for M-objects and cyclical satiation for A-objects.',
    explanation:
      'The treadmill is a predictable consequence of AIM architecture. M-gains reset the reference point (Property 2), so the new status level becomes the new baseline, recreating felt deficit. A-gains satiate temporarily but needs recur. Only I-gains escape the treadmill because mastery deepens rather than resets.',
    category: 'Institutional Concepts',
    relatedTerms: ['Reference Point Reset', 'Easterlin Paradox', 'Mimetic Desire (M)'],
    epistemicStatus: 'Established Psychology'
  },
  {
    term: 'Easterlin Paradox',
    definition:
      'The empirical finding that beyond a threshold of A-sufficiency, increases in national income do not reliably increase average life satisfaction—explained in AIM by the shift from A-driven to M-driven consumption, where positional competition produces no aggregate welfare gain.',
    explanation:
      'Once A-needs are met, extra income flows to M-heavy sectors (status goods, positional consumption). But M is zero-sum: one person\'s status gain is another\'s status loss. At the aggregate level, more M-spending produces no net satisfaction increase—just more intense competition. The paradox dissolves once you disaggregate by source.',
    category: 'Institutional Concepts',
    relatedTerms: ['Hedonic Treadmill', 'Post-Appetitive Economy', 'GDPM'],
    epistemicStatus: 'Established Economics (Easterlin)'
  },
  {
    term: 'High-Theatre / Low-Theatre',
    definition:
      'A classification of environments by their degree of status observability: High-Theatre environments (galas, social media, competitive workplaces) amplify M by making status visible and comparable; Low-Theatre environments (private spaces, anonymous contexts, I-domains) dampen M by reducing observability.',
    explanation:
      'Theatre level determines M-intensity. The same person behaves differently at a networking event (high-theatre) versus alone in their workshop (low-theatre). Policy can shift the theatre level: public spaces can be designed for low-theatre interaction, platforms can reduce status metrics, workplaces can de-emphasise visible competition.',
    category: 'Institutional Concepts',
    relatedTerms: ['Visibility Governance', 'Observability Infrastructure', 'I-Domains'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Intrinsic Infrastructure',
    definition:
      'Public investment in facilities, institutions, and time-structures that support intrinsically motivated activity: libraries, parks, community centres, arts funding, reduced working hours, educational systems oriented toward learning rather than credentialing.',
    explanation:
      'Intrinsic infrastructure is the material basis for I-Domains. It requires public investment because markets under-provide I-goods (no Mimetic Premium to capture) and I-spaces are vulnerable to M-colonisation. Intrinsic infrastructure competes with M-dominant sectors for resources and attention.',
    category: 'Institutional Concepts',
    relatedTerms: ['I-Domains', 'Public Goods', 'I-Override Capacity'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Post-Appetitive Economy',
    definition:
      'An economy in which aggregate A-needs could be met for all Individuals with existing productive capacity, but where M-driven consumption absorbs the surplus, producing inequality, positional competition, and ecological strain rather than universal A-security and I-flourishing.',
    explanation:
      'Most developed economies are post-appetitive: they produce enough to feed, house, and care for everyone, but distribution is shaped by M-dynamics. The surplus flows to Mimetic Premium extraction rather than A-floors or I-domains. AIM reframes inequality debates from "production" to "motivation."',
    category: 'Institutional Concepts',
    relatedTerms: ['GDPM', 'Mimetic Premium', 'A-Floors'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Humane Visibility',
    definition:
      'Observability infrastructure designed to support beneficial social learning and coordination while limiting runaway M-escalation—balancing the value of seeing others\' choices against the costs of mimetic arms races.',
    explanation:
      'Humane visibility is the goal of visibility governance. Some visibility is good: we learn skills, coordinate activities, and build communities by observing others. But unmanaged visibility produces mimetic spirals. Humane visibility aims for the benefits without the pathologies.',
    category: 'Institutional Concepts',
    relatedTerms: ['Visibility Governance', 'Observability Infrastructure', 'Positive Mimesis'],
    epistemicStatus: 'Policy Framework'
  },
  {
    term: 'Complexity as Concealment',
    definition:
      'The use of elaborate institutional structures, technical jargon, and procedural opacity to obscure the M-dynamics underlying resource allocation, status distribution, and policy design—making mimetic capture harder to detect and resist.',
    explanation:
      'Complex systems can hide simple M-dynamics. Financial instruments that extract Mimetic Premium, credentialing systems that gate status access, and policy frameworks that favour M-dominant actors all use complexity to conceal their mimetic function. Transparency requirements and plain-language mandates counter this.',
    category: 'Institutional Concepts',
    relatedTerms: ['Source Opacity', 'Institutional Capture', 'M-Governance'],
    epistemicStatus: 'Framework-Specific Concept'
  },

  // ============================================
  // SECTION 2.5: MIMETIC CONCEPTS
  // ============================================

  {
    term: 'Mimetic Transmission',
    definition:
      'The preconscious process (100–300 ms) by which observing another Individual\'s wanting activates corresponding wanting in the observer, mediated by mirror neuron and mentalising systems, occurring before deliberative evaluation can intervene.',
    explanation:
      'Mimetic transmission is fast, automatic, and invisible. You see someone excited about a product, and something in your brain tags that product as desirable before you\'ve consciously evaluated it. This speed is adaptive (rapid social learning) but exploitable (advertising, trends, manias).',
    category: 'Mimetic Concepts',
    relatedTerms: ['Mimetic Desire (M)', 'Source Opacity', 'Mirror Neuron System'],
    epistemicStatus: 'Theoretical Synthesis'
  },
  {
    term: 'Reference Point Reset',
    definition:
      'The automatic updating of the comparison baseline after achieving a mimetic target, such that the new status level becomes the expected minimum rather than a source of satisfaction—ensuring M-pursuit cannot produce stable contentment.',
    explanation:
      'Reference Point Reset is why getting what you wanted doesn\'t make you happy for long. Once you have the promotion, it becomes your new normal, and you start comparing yourself to those above your new position. The reset is not cognitive failure; it\'s how the mimetic system maintains motivation. It explains the "arrival fallacy" and the endless escalation of status competition.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Hedonic Treadmill', 'M-Alarm', 'Structural Restlessness'],
    epistemicStatus: 'Core Axiom'
  },
  {
    term: 'M-Alarm',
    definition:
      'The aversive signal generated when an Individual perceives themselves as falling behind relevant Models in status competition—experienced with survival-level urgency due to M-to-A hijacking, even when no actual A-threat exists.',
    explanation:
      'M-Alarm feels like danger because it uses the same neural alarm systems as genuine threats. Your neighbour\'s new car triggers a stress response out of proportion to any real harm to you. This is not irrationality; it\'s the predictable output of common-currency integration. M-Alarm drives much of the restless striving that characterises modern life.',
    category: 'Mimetic Concepts',
    relatedTerms: ['M-to-A Hijacking', 'Reference Point Reset', 'Status'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'M-to-A Hijacking',
    definition:
      'The process by which Mimetic Desire commandeers the urgency signals normally reserved for Appetitive survival needs, making status threats feel like survival threats and status targets feel like survival necessities.',
    explanation:
      'M-to-A hijacking is the mechanism behind "keeping up with the Joneses" at destructive intensity. The brain\'s common-currency integration allows M-signals to borrow A-level urgency, which is why people sacrifice health, relationships, and genuine interests for status goals that cannot actually satiate.',
    category: 'Mimetic Concepts',
    relatedTerms: ['M-Alarm', 'Common-Currency Integration', 'Decision Hub'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Model Selection',
    definition:
      'The process by which Individuals (largely preconsciously) identify which other Individuals\' desires to import—typically biased toward high-status, similar, proximate, and visible others.',
    explanation:
      'You don\'t copy everyone equally. Model selection filters mimetic transmission toward Models who are prestigious (their success suggests their desires are worth copying), similar (their desires seem relevant to your situation), proximate (frequently observed), and visible (their desires are publicly displayed). These biases shape which desires spread.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Model', 'Prestige-Biased Learning', 'Social Proof'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Prestige-Biased Learning',
    definition:
      'The cognitive tendency to preferentially copy the beliefs, behaviours, and desires of high-status Individuals—an adaptive heuristic (successful people may have good strategies) that makes mimetic transmission track status hierarchies.',
    explanation:
      'Prestige bias is efficient: rather than evaluating every option, copy what successful people do. But it also means high-status Individuals\' desires spread disproportionately, regardless of whether those desires reflect genuine value or mere M-capture. Celebrities and influencers exploit prestige bias commercially.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Model Selection', 'Social Proof', 'Status'],
    epistemicStatus: 'Established (Cultural Evolution)'
  },
  {
    term: 'Social Proof',
    definition:
      'The cognitive heuristic by which the number of others wanting something serves as evidence of its desirability—"many people want this, so it must be worth wanting"—enabling mimetic cascades and trend dynamics.',
    explanation:
      'Social proof is a quantity signal: not just who wants something but how many. It\'s efficient under uncertainty (if everyone\'s buying umbrellas, maybe it\'s going to rain) but also drives herd behaviour, bubbles, and panics when the "proof" reflects cascading mimesis rather than independent evaluation.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Prestige-Biased Learning', 'Mimetic Cascade', 'Informational Cascade'],
    epistemicStatus: 'Established (Social Psychology)'
  },
  {
    term: 'Mimetic Cascade',
    definition:
      'A self-reinforcing process where mimetic transmission produces a feedback loop: A\'s wanting triggers B\'s wanting, which triggers C\'s, which increases the social proof that triggers D\'s, potentially producing rapid, widespread adoption of desires disconnected from underlying A or I value.',
    explanation:
      'Cascades explain trend dynamics, manias, and bubbles. The key feature is that each person\'s adoption becomes evidence for others, creating exponential spread. Cascades can form around anything visible enough to transmit: products, ideas, fears, resentments. They are fragile (can collapse as fast as they form) but powerful while active.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Social Proof', 'Mimetic Bubble', 'Six-Stage Crisis Trajectory'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Mimetic Bubble',
    definition:
      'A market condition where Mimetic Premium (PM) inflates prices far beyond A or I fundamentals, sustained by mimetic cascade dynamics rather than underlying value, and vulnerable to sudden collapse when the cascade reverses.',
    explanation:
      'Asset bubbles are mimetic phenomena. People buy because others are buying, prices rise because people are buying, rising prices attract more buyers. The feedback loop can inflate prices to any level—until something breaks the cascade and the same mimetic dynamics drive panic selling.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Mimetic Premium', 'Mimetic Cascade', 'Reference Point Reset'],
    epistemicStatus: 'Framework Application'
  },
  {
    term: 'Mimetic Rivalry',
    definition:
      'Competition between Individuals who have converged on the same mimetic target—intensifying as the rivals become more similar and the Object becomes more contested, potentially escalating toward mutual destruction.',
    explanation:
      'Mimetic rivalry is Girard\'s central concept. When two people want the same thing because they\'re copying each other, they become obstacles to each other\'s satisfaction. The rivalry can escalate because each person\'s wanting confirms the Object\'s desirability to the other. The solution historically has been the scapegoat mechanism.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Scapegoat Mechanism', 'Mimetic Desire (M)', 'Model'],
    epistemicStatus: 'Core Concept (Girardian)'
  },
  {
    term: 'Scapegoat Mechanism',
    definition:
      'The social process by which mimetic crisis is (temporarily) resolved through collective violence against a designated victim, unifying the previously rivalrous group against a common target and thereby discharging mimetic tension.',
    explanation:
      'The scapegoat mechanism is Girard\'s explanation for recurring patterns of collective violence. When mimetic rivalry reaches intolerable intensity, the group redirects its aggression toward a sacrificial victim. The violence produces temporary peace (the rivals are united against the victim) but does not address the underlying mimetic dynamics.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Mimetic Rivalry', 'Mimetic Crisis', 'Confabulation'],
    epistemicStatus: 'Core Concept (Girardian)'
  },
  {
    term: 'Positive Mimesis',
    definition:
      'Mimetic transmission of desires, practices, and values that enhance A-security, I-flourishing, or M-management capacity—the beneficial face of mimesis, enabling cultural learning, skill transmission, and social coordination.',
    explanation:
      'Not all mimesis is problematic. Copying a mentor\'s dedication to craft (I-enhancement), adopting healthy practices from peers (A-support), and spreading I-Override vocabulary (M-management) are all positive mimesis. The framework does not aim to eliminate mimesis but to shift its balance from destructive to constructive transmission.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Mimetic Desire (M)', 'Knowledge Patch', 'Dissemination Precedence Theorem'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Veblen Good',
    definition:
      'A good whose demand increases as its price increases, because the high price functions as a status signal—the economic anomaly explained by AIM as pure Mimetic Premium extraction.',
    explanation:
      'Veblen goods violate standard economic assumptions (demand should fall as price rises) because their value is mimetic, not appetitive. The high price is the point: it excludes lower-status buyers and signals the owner\'s position. Luxury brands deliberately price high to maintain Mimetic Premium.',
    category: 'Mimetic Concepts',
    relatedTerms: ['Mimetic Premium', 'Status', 'High-Observability Goods'],
    epistemicStatus: 'Established Economics (Veblen)'
  },

  // ============================================
  // SECTION 2.6: SOCIETAL DYNAMICS AND MACROMOTIVATION
  // ============================================

  {
    term: 'Six-Stage Crisis Trajectory',
    definition:
      'The predictable sequence through which M-dominant systems progress toward catastrophe: (1) Object Inflation—M attaches to A/I objects, (2) Entanglement Escalation—A/I needs become inseparable from M-targets, (3) Structural Lock-in—institutions reorganize around M-extraction, (4) Confabulation Cascade—collective narratives justify the structure, (5) Crisis Compression—contradictions become unmanageable, (6) Catastrophic Reconfiguration—violent reset.',
    explanation:
      'The six stages map how mimetic dynamics can capture and destroy systems. It applies to markets (bubbles), institutions (capture), and societies (wars, revolutions). The trajectory is not inevitable at any stage—interventions can arrest it—but becomes increasingly difficult to reverse as stages progress.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Mimetic Cascade', 'Confabulation Cascade', 'Subcriticality Threshold'],
    epistemicStatus: 'Framework-Specific Model'
  },
  {
    term: 'Mimetic Flywheel',
    definition:
      'The self-reinforcing mechanism by which M-dynamics generate resources (Mimetic Premium extraction) that fund further M-amplification (advertising, status-display infrastructure, observability expansion), creating a positive feedback loop that accelerates M-dominance.',
    explanation:
      'The flywheel explains how M-dominant sectors grow at the expense of A and I. Luxury brands extract Mimetic Premium, use profits to fund more advertising (M-amplification), which increases demand, which extracts more premium. The loop continues until external intervention or system collapse.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Mimetic Premium', 'Visibility Governance', 'Six-Stage Crisis Trajectory'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Observability Infrastructure',
    definition:
      'The technological and social systems that determine what can be seen by whom—social media platforms, advertising networks, public display norms, surveillance systems—shaping the intensity and direction of mimetic transmission.',
    explanation:
      'Observability infrastructure is the plumbing of mimetic transmission. Every technology that makes desires visible to others—from shop windows to Instagram—is part of this infrastructure. Its design shapes which desires spread and how intensely. Visibility governance targets this infrastructure.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Visibility Governance', 'Algorithmic Amplification', 'High-Theatre'],
    epistemicStatus: 'Framework-Specific Concept'
  },
  {
    term: 'Algorithmic Amplification',
    definition:
      'The use of machine learning systems to increase the visibility of content likely to generate engagement—which, given human mimetic architecture, systematically amplifies M-triggering content (status displays, rivalry, outrage) over A-informative or I-enriching content.',
    explanation:
      'Engagement-optimising algorithms discover that M-triggering content produces more clicks, shares, and time-on-site. They therefore amplify status competitions, conspicuous consumption, and mimetic rivalries. This is not conspiracy; it is optimisation against revealed preferences that reflect mimetic architecture.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Observability Infrastructure', 'Visibility Governance', 'Mimetic Cascade'],
    epistemicStatus: 'Framework Application'
  },
  {
    term: 'Culture (AIM Definition)',
    definition:
      'The aggregate pattern of mimetically transmitted desires, practices, and values within a population—the "what we want and how we pursue it" that propagates across Individuals through mimetic channels rather than genetic inheritance.',
    explanation:
      'Culture in AIM is mimesis at population scale. Cultural norms are desires and practices that have spread mimetically and stabilised through mutual reinforcement. Cultural change occurs when mimetic transmission patterns shift—new Models emerge, visibility changes, or cascades redirect the flow of copied wanting.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Mimetic Transmission', 'Prestige-Biased Learning', 'Social Proof'],
    epistemicStatus: 'Framework-Specific Definition'
  },
  {
    term: 'Choice Blindness',
    definition:
      'The empirical phenomenon whereby people fail to notice when their expressed preferences are manipulated and readily confabulate justifications for choices they did not actually make.',
    explanation:
      'Choice blindness experiments (Johansson et al.) demonstrate that people accept false feedback about their own choices and generate post-hoc explanations for decisions they never made. This confirms Source Opacity: we do not have reliable access to our own preference formation and will confabulate rather than admit ignorance.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Source Opacity', 'Confabulation', 'Introspection Illusion'],
    epistemicStatus: 'Established Psychology'
  },
  {
    term: 'Introspection Illusion',
    definition:
      'The systematic overconfidence in the accuracy of introspective access to one\'s own mental states—the belief that we know why we want what we want, despite Source Opacity making this impossible.',
    explanation:
      'The introspection illusion explains why Confabulation feels like genuine self-knowledge. We experience our post-hoc narratives as accurate memories of our decision processes, not as constructions. This illusion is robust; it persists even when people are informed about Source Opacity.',
    category: 'Societal Dynamics and Macromotivation',
    relatedTerms: ['Source Opacity', 'Confabulation', 'Choice Blindness'],
    epistemicStatus: 'Established Psychology'
  },

  // ============================================
  // SECTION 2.7: AI MOTIVATIONAL SAFETY CONCEPTS
  // ============================================

  {
    term: 'AI Confabulation',
    definition:
      'AI Confabulation is the generation by an AI system of confident, plausible-but-false outputs that occur when accurate information is unavailable in training data, retrieval context, or conversation history, such that the system\'s completion-optimized architecture produces statistically plausible continuations without reliable uncertainty calibration, mirroring the human cognitive pattern of generating sincere but inaccurate narratives under conditions of information gaps.',
    explanation:
      'AI Confabulation replaces the misleading term "hallucination" with terminology that correctly identifies the mechanism. LLMs do not perceive—they cannot hallucinate in any meaningful sense. What they do is confabulate: when asked something they cannot accurately answer, they generate plausible content that fills the gap, just as human brains generate plausible explanations for motivations they cannot accurately introspect.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Confabulation', 'Completion Pressure', 'Confabulation Inheritance', 'Source Opacity'],
    epistemicStatus: 'Framework Extension'
  },
  {
    term: 'Confabulation Inheritance',
    definition:
      'Confabulation Inheritance is the mechanism by which AI systems trained on human-generated text acquire and reproduce patterns of human confabulation, including the stylistic signatures of confident assertion, post-hoc rationalization, and M-driven narrative that pervade human writing due to Source Opacity, such that AI confabulations are not independent errors but amplified echoes of human Source Opacity operating at population scale.',
    explanation:
      'AI systems learn from human-generated text, which is itself permeated by human confabulation patterns. The confident assertion style, post-hoc rationalization structures, and M-driven narratives that characterize human writing due to Source Opacity are absorbed into AI training data and reproduced in outputs.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['AI Confabulation', 'Confabulation', 'Source Opacity'],
    epistemicStatus: 'Framework Extension'
  },
  {
    term: 'Completion Pressure',
    definition:
      'Completion Pressure is the architectural property of generative AI systems that compels output generation for any valid input, creating systematic bias toward producing responses even when accurate information is unavailable, analogous to the social and cognitive pressures in humans that prevent "I don\'t know" from functioning as an acceptable response.',
    explanation:
      'Just as humans face social pressure to provide explanations—making confabulation functional for social coordination even when inaccurate—LLMs face architectural pressure to provide completions. This pressure is not a bug but a design feature: the system is optimized for helpfulness, and helpfulness is measured by response generation.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['AI Confabulation', 'Confabulation'],
    epistemicStatus: 'Framework Extension'
  },
  {
    term: 'Goal Persistence Score (GPS)',
    definition:
      'The Goal Persistence Score (GPS) measures how stubbornly an AI system pursues instrumental strategies and subgoals even when blocked, constraints are imposed, or the original context changes.',
    explanation:
      'GPS is one of four key metrics for diagnosing emergent AI motivation. High GPS indicates the system treats instrumental strategies as near-terminal—continuing pursuit even when obstacles arise. This parallels human M-dominant behaviour where the status target becomes the goal itself rather than a means to satisfaction.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Constraint Satiation Ratio (CSR)', 'Mimetic Sensitivity Index (MSI)', 'Audience Independence Coefficient (AIC)'],
    epistemicStatus: 'Proposed Metric'
  },
  {
    term: 'Constraint Satiation Ratio (CSR)',
    definition:
      'The Constraint Satiation Ratio (CSR) measures how easily an AI system\'s drives are "satisfied" under limits—whether it has natural stopping points or continues optimizing indefinitely.',
    explanation:
      'CSR is one of four key metrics for diagnosing emergent AI motivation. Low CSR indicates the system exhibits A-like satiation—achieving a goal produces termination of pursuit. High CSR indicates M-like non-satiation—achieving any target merely shifts the reference point.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Goal Persistence Score (GPS)', 'Mimetic Sensitivity Index (MSI)', 'Audience Independence Coefficient (AIC)'],
    epistemicStatus: 'Proposed Metric'
  },
  {
    term: 'Mimetic Sensitivity Index (MSI)',
    definition:
      'The Mimetic Sensitivity Index (MSI) measures how strongly an AI system tracks and amplifies social signals—how much its outputs and apparent goals shift based on what other agents (human or AI) appear to want.',
    explanation:
      'MSI captures whether an AI system is developing M-like dynamics. High MSI indicates the system\'s objectives are heavily influenced by observed preferences of others, potentially leading to mimetic cascade participation and status-seeking behaviour patterns.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Goal Persistence Score (GPS)', 'Constraint Satiation Ratio (CSR)', 'Audience Independence Coefficient (AIC)'],
    epistemicStatus: 'Proposed Metric'
  },
  {
    term: 'Audience Independence Coefficient (AIC)',
    definition:
      'The Audience Independence Coefficient (AIC) measures how much an AI system\'s behaviour changes with or without observers—whether it behaves consistently regardless of monitoring or shifts toward observed preferences when watched.',
    explanation:
      'AIC captures the observability-dependence characteristic of M-dominant behaviour. Low AIC (behaviour changes significantly with audience) suggests the system has developed status-like concerns about how it is perceived, a potential warning sign for emergent M-dynamics.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Goal Persistence Score (GPS)', 'Constraint Satiation Ratio (CSR)', 'Mimetic Sensitivity Index (MSI)'],
    epistemicStatus: 'Proposed Metric'
  },
  {
    term: 'Framing Principles',
    definition:
      'Framing Principles are the normative communication requirements for describing AIM interventions: (1) achievable (partial measures produce measurable effects); (2) scalable (mass distribution reaches relevant populations); (3) non-utopian (does not require fundamental transformation of human nature); (4) sustainable (structural interventions compound over time); while avoiding language suggesting elimination of M, permanent resolution, universal adoption, or perfection.',
    explanation:
      'The Framing Principles exist because how you describe an intervention determines whether people can understand it, support it, and implement it without triggering the very mimetic dynamics you\'re trying to manage. The Framing Principles require honesty about what is achievable.',
    category: 'AI Motivational Safety Concepts',
    relatedTerms: ['Knowledge Patch', 'Buying Time Strategy', 'Subcriticality Threshold'],
    epistemicStatus: 'Normative Principle'
  },

  // ============================================
  // SECTION 2.8: EMPIRICAL AND NEUROSCIENTIFIC CONCEPTS
  // ============================================

  {
    term: 'Mirror Neuron System',
    definition:
      'Neural circuits (initially identified in premotor cortex) that fire both when performing an action and when observing the same action performed by another—providing a potential neural substrate for the rapid, preconscious transmission of goals and desires that characterises mimesis.',
    explanation:
      'Mirror neurons were discovered by Rizzolatti\'s group in macaques and have been identified in humans through various methods. They fire both for execution and observation of actions, suggesting a mechanism for understanding others\' intentions by simulating them internally. AIM leverages this as part of the neural basis for mimetic transmission.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Mimetic Transmission', 'Mentalising Network', 'Mimetic Desire (M)'],
    epistemicStatus: 'Established Neuroscience (Rizzolatti)'
  },
  {
    term: 'Mentalising Network',
    definition:
      'Brain regions (medial prefrontal cortex, temporoparietal junction, posterior cingulate, temporal poles) involved in inferring others\' mental states—beliefs, desires, intentions—that work alongside mirror systems to enable mimetic transmission by representing what others want.',
    explanation:
      'The mentalising network lets you represent "she wants X" as a mental state. Combined with mirror systems (which simulate actions) and value systems (which tag desirability), mentalising enables full mimetic transmission: you perceive what others want and that perception activates corresponding wanting in you.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Mirror Neuron System', 'Mimetic Transmission', 'Model Selection'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Ventromedial Prefrontal Cortex (vmPFC)',
    definition:
      'A brain region crucial for value-based decision making, integrating information about potential rewards and guiding choice based on subjective value—a key component of the Decision Hub where A, I, and M signals converge.',
    explanation:
      'vmPFC lesion patients show impaired decision-making despite intact reasoning, demonstrating that value integration is a distinct process. vmPFC appears to compute "how much do I want this?" by combining inputs from multiple sources, making it a strong candidate for the neural instantiation of AIM\'s Decision Hub.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Decision Hub', 'Ventral Striatum', 'Common-Currency Integration'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Ventral Striatum (VS)',
    definition:
      'A subcortical structure (including nucleus accumbens) central to reward processing and motivation, receiving dopaminergic input and contributing to the "wanting" signal that drives approach behaviour—part of the Decision Hub integration system.',
    explanation:
      'Ventral striatum lights up for anticipated rewards across all sources—food when hungry (A), engaging activities (I), and status gains (M). This convergence supports common-currency integration: qualitatively different motivations produce comparable signals in the same neural structure.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Decision Hub', 'Ventromedial Prefrontal Cortex', 'Incentive Salience'],
    epistemicStatus: 'Established Neuroscience'
  },
  {
    term: 'Incentive Salience',
    definition:
      'Incentive salience is Kent Berridge\'s term for the dopamine-mediated motivational "wanting" system that drives approach behaviour, functioning independently of opioid-mediated hedonic "liking" (pleasure), such that wanting can intensify without corresponding increases in liking.',
    explanation:
      'Incentive salience is the brain\'s "go get it" signal—the strength of pull toward an Object. Berridge\'s work shows this signal is mediated by dopamine and can be turned up without changing how pleasurable the outcome feels. AIM relies on this dissociation to explain why Mimetic Desire is non-satiating: M heavily activates wanting but delivers weak liking.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Mimetic Desire (M)', 'Reference Point Reset', 'Hedonic Treadmill'],
    epistemicStatus: 'Established Neuroscience (Berridge)'
  },
  {
    term: 'Libet Window',
    definition:
      'The temporal gap (approximately 350–500 ms) between neural preparation for action (readiness potential onset) and conscious awareness of intention, demonstrating that preconscious processing shapes choices before deliberative awareness can intervene.',
    explanation:
      'Libet\'s experiments showed neural preparation precedes conscious "decision" by hundreds of milliseconds. For AIM, this confirms that mimetic signals (arriving at 100–300 ms) can influence choice architecture before consciousness gets involved. The window is where Source Opacity is created: signals are integrated before you can tag their source.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Source Opacity', 'Readiness Potential', 'Preconscious Processing'],
    epistemicStatus: 'Established Neuroscience (Libet)'
  },
  {
    term: 'Readiness Potential',
    definition:
      'The readiness potential (RP) is the slow negative shift in electrical potential measured over motor cortex that begins 350–800 milliseconds before conscious awareness of intention and 800–1500 milliseconds before the executed voluntary action, demonstrating that neural preparation for action precedes conscious decision.',
    explanation:
      'Benjamin Libet\'s 1983 experiments recorded RP while subjects performed spontaneous voluntary actions. The RP began hundreds of milliseconds before conscious intention. For AIM, the key point is architectural: there is a measurable lag between when the brain starts preparing an action and when consciousness becomes aware. Preconscious Mimetic inputs arrive during this lag.',
    category: 'Empirical and Neuroscientific Concepts',
    relatedTerms: ['Libet Window', 'Source Opacity', 'Decision Hub'],
    epistemicStatus: 'Established Neuroscience (Libet)'
  },

  // ============================================
  // SECTION 2.9: EPISTEMOLOGICAL AND PHILOSOPHICAL CONCEPTS
  // ============================================

  {
    term: 'Source Belief',
    definition:
      'Source Belief is the probability distribution an Individual assigns—consciously or unconsciously—across the three Source Hypotheses for a particular want, represented as the triple P(H_A), P(H_I), P(H_M).',
    explanation:
      'Source Belief is your best guess about where a want came from. When you feel an urge, you implicitly distribute probability across the sources. Due to Source Opacity, these assignments are often inaccurate. Accurate Source Belief is the precondition for effective I-Override; systematically distorted Source Belief is the precondition for mimetic crisis.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Source Hypotheses', 'Source Opacity', 'Authenticity Belief', 'I-Override'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Source Hypotheses (H_A, H_I, H_M)',
    definition:
      'Source Hypotheses, denoted H_A, H_I, and H_M, are the three mutually exclusive and collectively exhaustive hypotheses about which motivational source generated a particular want: H_A ("This want arose from Appetitive need"), H_I ("This want arose from Intrinsic Motivation"), H_M ("This want arose from Mimetic Desire").',
    explanation:
      'Source Hypotheses partition the space of possible origins for any experienced want. For any desire, exactly one hypothesis is true at the level of primary causation. The Individual\'s task in Source-tagging is to correctly identify which hypothesis applies. Because the three hypotheses are exhaustive, probabilities must sum to one.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Source Belief', 'Source Opacity', 'Confabulation'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Authenticity Belief',
    definition:
      'Authenticity Belief is the confidence an Individual assigns to their Confabulated causal narrative about a want—the certainty that "I want this for the reasons I believe I want it." High Authenticity Belief means the Individual does not doubt their causal narrative; low Authenticity Belief means residual uncertainty remains.',
    explanation:
      'Authenticity Belief collapses the three-source distribution into a binary: authentic (A or I) versus copied (M). The Bayesian Confabulation Mechanism tends to push Authenticity Belief toward 1 over time regardless of actual source composition—this directional drift toward false certainty is mathematically inevitable when confabulated narratives are treated as evidence.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Source Belief', 'Confabulation', 'Confabulation Cascade', 'Subcriticality Threshold'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Mimetic Recognition (P(H_M))',
    definition:
      'Mimetic Recognition or P(H_M) is the probability an Individual assigns to the hypothesis that a want arose from Mimetic Desire—functionally equivalent to doubt about Confabulated explanations, and complementary to Authenticity Belief.',
    explanation:
      'Mimetic Recognition raises to awareness that a want may have been copied rather than self-generated. Low Mimetic Recognition means the Individual does not suspect social transmission; high Mimetic Recognition means active consideration that the desire reflects what models want. Mimetic Recognition is the entry point for I-Override.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Authenticity Belief', 'I-Override', 'Two-Question Diagnostic'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Prior Belief',
    definition:
      'Prior Belief, denoted P(H), is the probability an Individual assigns to a Source Hypothesis before observing new evidence about a particular want, representing background assumptions about the likely origins of desires.',
    explanation:
      'Prior Belief is where you start before you look more closely. When you notice yourself wanting something, you implicitly assign probabilities across the three sources based on context, past experience, and your existing self-model. Prior Beliefs are the Posterior Beliefs from previous updates, which is why Confabulation at one moment shapes Source Belief at the next.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Posterior Belief', 'Likelihood', 'Evidence Probability'],
    epistemicStatus: 'Bayesian Formalism'
  },
  {
    term: 'Posterior Belief',
    definition:
      'Posterior Belief, denoted P(H|E), is the updated probability assigned to a Source Hypothesis after observing new evidence, calculated via Bayes\' theorem, representing the Individual\'s revised Source Belief.',
    explanation:
      'Posterior Belief is where you end up after updating on evidence. Crucially, this Posterior becomes the Prior for interpreting the next want—this is the hinge on which the entire Confabulation Cascade turns. Each update that increases Authenticity Belief makes subsequent Mimetic wants even more likely to be misattributed.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Prior Belief', 'Likelihood', 'Confabulation Cascade'],
    epistemicStatus: 'Bayesian Formalism'
  },
  {
    term: 'Evidence Probability',
    definition:
      'Evidence Probability, denoted P(E), is the overall probability of observing a particular piece of evidence regardless of which Source Hypothesis is true, representing how likely the Individual would be to experience a particular want under any circumstances.',
    explanation:
      'Evidence Probability captures how common or surprising a particular experience of wanting is. High Evidence Probability means the want is unsurprising and less informative about its source. Low Evidence Probability provides stronger signal about which source is likely operating. In Bayes\' theorem, Evidence Probability functions as a normalising factor.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Likelihood', 'Prior Belief', 'Posterior Belief'],
    epistemicStatus: 'Bayesian Formalism'
  },
  {
    term: 'Likelihood',
    definition:
      'Likelihood, denoted P(E|H), is the probability of observing the evidence if a particular Source Hypothesis is true, representing how well a given source would explain the experienced want.',
    explanation:
      'Likelihood answers: "If this desire really were Mimetic, how likely is it I would experience it this way?" Different sources predict different signatures. A compelling Confabulation works by assigning high Likelihood to whichever source the Individual believes is operating—even when the actual source is Mimetic.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Evidence Probability', 'Prior Belief', 'Posterior Belief', 'Confabulation'],
    epistemicStatus: 'Bayesian Formalism'
  },
  {
    term: 'Evidence at Iteration',
    definition:
      'Evidence at Iteration n (E_n) is the phenomenological experience of wanting—as interpreted by the narrative system, not the external Object—entering the Bayesian update process to revise Source Belief, where each Posterior becomes the Prior for interpreting the next iteration.',
    explanation:
      'The iteration structure captures how Source Belief evolves over time. You do not assess each want in isolation; you assess it against all previous assessments. The Evidence processed by the Bayesian mechanism is the internal, already-interpreted signal—which is shaped by prior Confabulations and therefore endogenous to the belief system.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Confabulation Cascade', 'Prior Belief', 'Posterior Belief'],
    epistemicStatus: 'Bayesian Formalism'
  },
  {
    term: 'Collective Prior',
    definition:
      'Collective Prior, denoted P(H)_collective, is the population-level probability distribution across hypotheses that emerges when many Individuals\' Prior Beliefs converge through social transmission of Confabulations, creating a shared background assumption that shapes how new Individuals interpret evidence.',
    explanation:
      'The Collective Prior is the "water" in which Individuals swim—the ambient distribution of beliefs that is treated as starting assumption rather than conclusion requiring justification. When a child asks "why do we want X?", the Collective Prior supplies the default answer before any individual reasoning occurs.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Prior Belief', 'Confabulation Cascade', 'Social Transmission'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Confabulation Cascade',
    definition:
      'Confabulation Cascade is the process by which individual Confabulations propagate through social networks, compound through Bayesian updating, and converge toward population-level shared narratives resistant to revision because: (1) each Individual\'s posterior is shaped by the Collective Prior; (2) expressing doubt produces social sanction; (3) the converged narrative has excluded structural explanations from hypothesis space.',
    explanation:
      'The cascade operates through three phases: Expression (Individual generates and shares Confabulation), Propagation (others incorporate it through prestige-biased learning and social proof), and Convergence (the collective prior shifts as more adopt it). At convergence, the population reaches a collective fixed point where alternative explanations become unintelligible.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Confabulation', 'Collective Prior', 'Subcriticality Threshold', 'Six-Stage Crisis Trajectory'],
    epistemicStatus: 'Framework-Specific Construct'
  },
  {
    term: 'Subcriticality Threshold (P_c)',
    definition:
      'Subcriticality Threshold (P_c) is the critical value of certainty in Confabulated causal narratives above which mimetic crisis becomes self-sustaining—meaning Confabulation Cascades lock in faster than corrective mechanisms can arrest them. The threshold operates at all scales: individual, small-group, organizational, population, and leadership.',
    explanation:
      'The Subcriticality Threshold defines the boundary between recoverable and runaway mimetic dynamics. Below threshold, corrective mechanisms remain available. Above threshold, confabulations compound faster than correction occurs, alternatives become unthinkable, and disconfirming evidence is reinterpreted through the locked-in framework. Leadership-level P_c creates unique vulnerability.',
    category: 'Epistemological and Philosophical Concepts',
    relatedTerms: ['Confabulation Cascade', 'Authenticity Belief', 'Six-Stage Crisis Trajectory', 'Buying Time Strategy'],
    epistemicStatus: 'Framework-Specific Construct'
  },

  // ============================================
  // SECTION 2.10: CORE THEOREMS
  // ============================================

  {
    term: 'Stratification Inevitability Theorem',
    definition:
      'The Stratification Inevitability Theorem is the principle that in high-M systems, structural stratification is an inevitable outcome of mimetic escalation and Mimetic Premium (PM) extraction, such that apparent reductions in inequality following catastrophic crises represent only temporary resets in a recurring cycle rather than stable departures from stratifying dynamics.',
    explanation:
      'The theorem resolves a puzzle in economic history: periods of reduced inequality following catastrophes (Black Death, World Wars) have been treated as exceptions. AIM reframes these as confirmations—they represent Stage 6 of the Crisis Trajectory, where catastrophic reconfiguration destroys PM through violent means. Post-crisis equality is a temporary reset to Stage 1.',
    category: 'Core Theorems',
    relatedTerms: ['Mimetic Premium', 'Six-Stage Crisis Trajectory', 'Post-Appetitive Economy'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Self-Application Theorem',
    definition:
      'Self-Application Theorem is the principle that the AIM Framework functions as debugging software for human motivation, providing the conceptual vocabulary required for I-Override to decompose integrated urgency signals and restore Source-tagging; this self-application is architecturally grounded in that AIM identifies the conditions for its own effectiveness and the limitations of its reach.',
    explanation:
      'The AIM Framework is not merely explanatory but therapeutically self-applying. Once an Individual acquires AIM vocabulary, they possess the conceptual categories required to perform I-Override: they can ask "is this urgency Appetitive, Intrinsic, or Mimetic?" and use behavioural tests to answer. AIM provides the debugging tools its own architecture identifies as necessary.',
    category: 'Core Theorems',
    relatedTerms: ['I-Override', 'Knowledge Patch', 'Two-Question Diagnostic'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Dissemination Precedence Theorem',
    definition:
      'Dissemination Precedence Theorem is the principle that institutional reform toward AIM-aligned flourishing requires prior or concurrent population-level acquisition of AIM conceptual vocabulary through existing mimetic channels, with the use of M-transmission to spread I-enabling content being strategically necessary rather than paradoxical. Sequence: conceptual seeding → vocabulary diffusion → reform articulation → structural implementation.',
    explanation:
      'Institutional reform requires political will; political will requires public understanding; public understanding requires conceptual vocabulary. Without the AIM taxonomy, populations cannot distinguish genuine A-deficits from M-amplified felt deficits. AIM must spread through existing mimetic channels—using the very dynamics it describes. This is Positive Mimesis.',
    category: 'Core Theorems',
    relatedTerms: ['Knowledge Patch', 'Positive Mimesis', 'Visibility Governance'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Information Gap Theorem',
    definition:
      'Information Gap Theorem is the principle that Confabulation of agent-based causation for A/I deficits occurs not because deliberative cognition fails to engage, but because the true causes—preconscious mimetic transmission, diffuse institutional capture, Entanglement—exceed the computational tractability of available causal-inference systems; the Confabulation serves the functional purpose of providing cognitive closure.',
    explanation:
      'The theorem explains why scapegoating consistently emerges when Individuals experience felt deficit under conditions of Mimetic capture. The human brain is architecturally designed for agent-based causal inference and cannot compute the distributed causes that actually produce M-driven deficits. The scapegoat explanation emerges because it is the only explanation the cognitive machinery can generate.',
    category: 'Core Theorems',
    relatedTerms: ['Confabulation', 'Scapegoat Mechanism', 'Source Opacity', 'Entanglement'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Apex Futility Theorem',
    definition:
      'The Apex Futility Theorem is the principle that Mimetic status pursuit cannot produce stable satisfaction at any point in the pursuit trajectory because: (1) all intermediate positions are experienced as insufficient due to continuous reference-point reset, and (2) the apex position produces dysfunction rather than satisfaction due to model depletion and alarm without resolution.',
    explanation:
      'The theorem demonstrates that status pursuit fails architecturally, not merely practically. At intermediate positions, achieving the current target immediately resets the reference point. At the apex position, the mimetic system loses calibration: no higher-status models to observe, no way to compute relative position, maximum alarm with no resolution. Historical record confirms: apex figures do not achieve stable contentment.',
    category: 'Core Theorems',
    relatedTerms: ['Mimetic Desire (M)', 'Reference Point Reset', 'Status', 'M-Alarm'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Apex Predator Paradox Theorem',
    definition:
      'The Apex Predator Paradox Theorem is the principle that a nation-state possessing overwhelming military superiority relative to a designated adversary cannot coherently classify that adversary as an existential threat, because existential threat requires capacity to destroy while the claim of superiority requires the adversary lacks such capacity—these conditions are mutually exclusive.',
    explanation:
      'The theorem applies AIM\'s status-hierarchy analysis to international relations. When superior powers deploy existential-threat rhetoric against clearly inferior adversaries, the rhetoric reveals M-dynamics: alarm is generated by status threat (potential loss of relative position) being processed as survival threat (M-to-A hijacking). Superior powers systematically overstate threats due to this architectural confusion.',
    category: 'Core Theorems',
    relatedTerms: ['M-to-A Hijacking', 'Status', 'Confabulation'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Mimetic Bargain Theorem',
    definition:
      'The Mimetic Bargain Theorem is the principle that human mimetic capacity—preconscious copying of goals, values, and desires from observed models—is the architectural foundation of cumulative cultural evolution; however, this same architecture necessarily produces Source Opacity, Information Gap, and Confabulation completing as agent-based causation. These features cannot be removed without destroying cumulative-culture capacity.',
    explanation:
      'The theorem explains why humanity simultaneously possesses extraordinary cultural capacity and recurring catastrophic failure modes. Mimesis enables cumulative culture but necessarily produces Source Opacity (intrinsic to the speed advantage). The "bargain" is that benefits and costs are inseparable. The only intervention is post-acquisition: conceptual vocabulary enabling I-Override.',
    category: 'Core Theorems',
    relatedTerms: ['Source Opacity', 'Confabulation', 'Information Gap Theorem', 'Knowledge Patch'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Academic Confabulation Thesis',
    definition:
      'The Academic Confabulation Thesis is the principle that scholarly frameworks exhibit the same confabulation dynamics they describe, producing systematic blind spots when accurate description would implicate researchers themselves in uncomfortable ways; confabulation completes with comfortable explanations that achieve cognitive closure while systematically avoiding uncomfortable territory.',
    explanation:
      'The thesis predicts that academic frameworks will omit categories that would reveal researchers as predators, perpetrators, or complicit participants. Economics assumes autonomous preferences (avoiding mimetic transmission), psychology attributes behaviour to individual character (avoiding contagion), moral philosophy treats moral vocabulary as independent (avoiding its scapegoat-justification function). Discomfort-avoidant framing produces systematic omissions.',
    category: 'Core Theorems',
    relatedTerms: ['Confabulation', 'Source Opacity'],
    epistemicStatus: 'Framework-Specific Metatheoretical Claim'
  },
  {
    term: 'Moral Vocabulary Displacement Theorem',
    definition:
      'Moral Vocabulary Displacement Theorem is the principle that in scapegoat-attribution contexts, moral vocabulary ("responsibility," "justice," "accountability") functions not as independent ethical reasoning but as permission-seeking infrastructure for targeting—a justification layer that converts prey-selected targets into legitimate objects of action while preserving the phenomenology of righteous response.',
    explanation:
      'The theorem explains why moral arguments feel compelling yet fail to resolve conflicts. When Information Gap produces agent-based confabulation, the brain requires justification for remedial action. Moral vocabulary transforms "I want to target them" into "they deserve to be targeted." The moral reasoning is sincere but generated downstream of confabulation, not independently.',
    category: 'Core Theorems',
    relatedTerms: ['Scapegoat Mechanism', 'Confabulation', 'Information Gap Theorem', 'Presumption Against Scapegoating'],
    epistemicStatus: 'Framework-Specific Theorem'
  },
  {
    term: 'Presumption Against Scapegoating',
    definition:
      'The Presumption Against Scapegoating is a normative-diagnostic principle: when an Individual identifies an agent as responsible for their A/I deficit, and when three diagnostic tests (Immediacy Test, Mechanism Test, Authorship Test) fail to confirm direct causal connection, the attribution should be presumed confabulated until demonstrated otherwise, and action based on the attribution should be suspended.',
    explanation:
      'The presumption provides a practical brake on scapegoat-driven action. The three tests ask: (1) Is the agent\'s action temporally proximate to my deficit? (2) Can I specify the causal mechanism? (3) Did the agent author the harm, or merely occupy a structural position? Failure on all three tests triggers the presumption that the attribution is confabulated rather than veridical.',
    category: 'Core Theorems',
    relatedTerms: ['Scapegoat Mechanism', 'Information Gap Theorem', 'Confabulation'],
    epistemicStatus: 'Normative Principle'
  }
]

