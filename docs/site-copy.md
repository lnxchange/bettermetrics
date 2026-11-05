# aimtheory.org: visitor-facing copy

This is every piece of text a visitor can read on aimtheory.org, except the Treatise (`/treatise`) and the Glossary (`/glossary`). It is grouped by page, top to bottom, the way it appears on screen.

## How to edit this document

- Every block has an ID in its heading, for example **HOME-03**. Leave the ID alone and rewrite the text underneath it. That is how your edits get mapped back to the code.
- To remove something, replace its text with `DELETE`.
- To add something new, write `NEW:` followed by the text, directly under the block it should follow.
- To leave me an instruction rather than replacement text, put it in double square brackets, e.g. `[[make this shorter]]` or `[[move this above HOME-05]]`.
- Links are written as `[link text](/address)`. Change the link text freely; change the address only if you want it to point somewhere else.
- Text in *italics* or **bold** is shown that way on the site.
- Blocks marked **(Treatise text)** are quoted word for word from the Treatise. If you change them here, the site and the Treatise will disagree, so you may prefer to change them in the Treatise instead.
- "Ask the AI" chips are the small rounded buttons that open the chat with the question already typed in. The visible label and the question sent to the chat are the same unless the block says otherwise.
- "Search and social" blocks are not shown on the page. They are the title and summary shown in Google results, browser tabs, and link previews on social media and messaging apps. Search engines show roughly the first 60 characters of a title and 155 of a description.

---

## 1. Shared across every page

### Header (top navigation bar)

**NAV-01 · Sign-in link** (shown when signed out)
Sign in

**NAV-02 · Menu items, in order**
- The Theory
- Axioms
- Treatise
- Glossary
- Articles
- About

**NAV-03 · Mobile menu only: extra items**
- Contact
- Theme (label next to the light/dark switch)

**NAV-04 · Chat button**
Ask AI

**NAV-05 · Search box placeholder**
Search site...

**NAV-06 · Search: no results**
No results found for "{what they typed}"

**NAV-07 · Search: keyboard hint at the bottom of results**
↑↓ Navigate · Enter Select · Esc Close

**NAV-08 · Signed-in user menu**
Log Out

### Footer

**FOOT-01 · Footer links, in order**
- The Theory
- Axioms
- Treatise
- Glossary
- Articles
- About
- Contact
- Ask AI

**FOOT-02 · Footer statement**
The AIM Framework is a theoretical synthesis awaiting peer-reviewed validation. Its claims are stated so they can be tested; critical evaluation and research collaboration are welcome.

**FOOT-03 · Copyright line** (the year updates automatically)
© 2026 Yule Guttenbeil. Material on this site may be used for validation research and personal use.

**FOOT-04 · Footer line on shared chat pages only**
AIM Framework website built with Next.js and Supabase.

### Search and social defaults (used when a page does not set its own)

**SITE-01 · Default page title**
The AIM Framework | A General Theory of Human Motivation

**SITE-02 · Title suffix added to most page titles**
| The AIM Framework

**SITE-03 · Default search description**
A Unifying General Theory of Human Motivation: Taxonomic synthesis integrating neuroscience, behavioral economics, Self-Determination Theory, and Girardian mimetic theory. Resolves Code Drift through three neurologically distinct sources—Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).

**SITE-04 · Default social preview title**
AIM Framework | A Unifying General Theory of Human Motivation

**SITE-05 · Default social preview description (Facebook, LinkedIn, messaging apps)**
Taxonomic synthesis resolving definitional inconsistencies in motivation science through three neurologically distinct sources: Appetites, Intrinsic Motivation, and Mimetic Desire.

**SITE-06 · Default social preview description (X / Twitter)**
Taxonomic synthesis resolving Code Drift in motivation science. Three neurologically distinct sources: Appetites (A), Intrinsic Motivation (I), Mimetic Desire (M).

**SITE-07 · Social preview image description (alt text)**
The AIM Framework: Appetites, Intrinsic Motivation, Mimetic Desire

**SITE-08 · Padding added to short article descriptions in search results**
Part of the AIM Framework, a general theory of human motivation.

---

## 2. Home page (`/`)

### Search and social

**HOME-SEO-01 · Page title**
The AIM Framework | A General Theory of Human Motivation

**HOME-SEO-02 · Search description**
A general theory of human motivation: three sources of wanting (Appetites, Intrinsic Motivation, Mimetic Desire), one decision signal, and what mixing hides.

**HOME-SEO-03 · Social preview description**
Three sources of wanting, one decision signal, and what gets lost in the mixing.

### Hero (dark banner at the top)

**HOME-01 · Heading**
A General Theory of Human Motivation

**HOME-02 · Intro paragraph**
The AIM Framework is a model of the system that produces wanting. Three systems in the brain each produce a signal. One tracks what the body needs (Appetites). One tracks what is rewarding to do for its own sake (Intrinsic Motivation). One tracks what stands out as valuable around you (Mimetic Desire). A Decision Hub merges them into a single sense of how much you want something, and acts on it.

**HOME-03 · Second paragraph**
The framework is built from [nine stated axioms](/axioms). Five are taken from established research, one follows mathematically, and three are the framework's own claims. The architecture and its consequences are worked out from them, and the framework is falsifiable.

**HOME-04 · Buttons**
- Ask the AI to explain it *(sends to the chat: "Explain the AIM Framework to me in plain terms, as if I have never heard of it.")*
- Read the theory → *(goes to /theory)*

### How the system works

**HOME-05 · Section heading**
How the system works

**HOME-06 · Paragraph**
A Body Manager (the homeostatic-deficit system) reports bodily deficit, a Thinker (the dopaminergic system) holds beliefs and pursues what is rewarding in the doing, and an Observer (the mirror neuron system) continuously reads which objects in the surrounding field stand out as valuable. All three feed a Decision Hub (the ventromedial prefrontal cortex and ventral striatum), which converts them into one value per option and selects an action.

*(The Decision Hub diagram appears here. Its text is listed under DIAGRAM-01 to DIAGRAM-05 in section 11.)*

**HOME-07 · Subheading**
The asymmetry: two deficits and one Salience signal

**HOME-08 · Paragraph**
The three signals are not the same kind of report. Appetites and Intrinsic Motivation each report a deficit: something is missing, and the right object would close it. Hunger ends when you eat. The Observer reports something else, which is Salience: where value appears to be. It reports no deficit, so there is nothing to close and it has no off switch.

**HOME-09 · Subheading**
M is a Salience signal

**HOME-10 · Paragraph**
The name Mimetic Desire points to its most familiar case, wanting what other people visibly want. The signal itself is simply Salience: *this stands out as worth having*. It works the same way for a limited edition, a new phone in a shop window or a queue outside a door as it does for a friend's new car. Valuing what others value is one case of Salience, not a separate mechanism.

**HOME-11 · Subheading**
What the merge loses

**HOME-12 · Paragraph**
The Hub weighs the three signals and adds them into one value. A want of strength 6 could be 2 + 1 + 3 or 0 + 0 + 6, and nothing that sees only the 6 can tell which. Because the Hub has only one category to receive them in, a Salience reading is felt as a deficit. That is why the part of a want that came from Salience is not satisfied by getting the thing: there was no deficit to close.

**HOME-13 · Paragraph**
Among everything else in the field, each person's Observer reads what the people around them are pursuing, so the same loop also runs between people. The framework builds outward from there without adding new parts.

**HOME-14 · Three boxes**

*Box 1 heading:* Taken from established research
*Box 1 text:* The brain converts different kinds of value into one common currency before choosing. People sincerely invent reasons for choices they cannot introspect. Other people's valuations register faster than awareness. Beliefs update from prior belief and new evidence. Causes are sought in agents first.

*Box 2 heading:* Follows mathematically
*Box 2 text:* Once the signals are merged, which source produced which part cannot be recovered.

*Box 3 heading:* The AIM Framework's own claims
*Box 3 text:* There are exactly three sources, each with its own satiation pattern; M, as Salience, never satiates. M adds value to objects that already serve A or I rather than creating wants of its own.

**HOME-15 · Small print under the boxes**
The AIM Framework is a theory of motivation, not of all cognition, and it builds on Self-Determination Theory, behavioural economics and mimetic theory rather than replacing them. [What it claims and does not claim](/about#claims)

**HOME-16 · Ask the AI chips**
- Why does merging three signals into one make the source unrecoverable?
- How can M be a Salience signal when it is felt as a deficit?
- Which parts of the AIM Framework are established science and which are new?

### Three sources of wanting

**HOME-17 · Section heading**
Three sources of wanting

**HOME-18 · Intro line**
Each has its own neural pathway, its own satiation pattern, and its own tell.

*(The three coloured source cards appear here. Their text is listed under SOURCES-01 to SOURCES-03 in section 11, because the same cards also appear on the Theory page.)*

**HOME-19 · Ask the AI chips**
- Is wanting to be with other people Intrinsic or Mimetic?
- Can one object carry all three sources at once?
- Where does money fit: Appetite, Intrinsic, or Mimetic?

### Why it matters

**HOME-20 · Section heading**
Why it matters

**HOME-21 · Paragraph**
The merged value records *how much* you want something but not *why*. Asked why you chose, the brain does not answer "I don't know." It builds a plausible story and believes it. Wants that came from Salience are the most likely to be misread, because they are felt as a deficit, arrive before awareness, and leave nothing behind to check.

**HOME-22 · Paragraph**
So asking people what they want, or watching what they choose, tells you how much they want something but not why. Consumer research, welfare economics and much of therapy rely on one or the other as if it told them both.

**HOME-23 · Paragraph**
If that is right, the human sciences stand roughly where medicine stood in 1850. Doctors could describe diseases in detail but could not say why they occurred or which treatments would work. Germ theory changed that by naming a cause. The AIM Framework aims to do the same for wanting.

**HOME-24 · Ask the AI chips**
- How can anything be done about a want I cannot see the source of?
- What does the AIM Framework mean by the Romantic Lie?

### Two-Question Diagnostic

**HOME-25 · Section heading**
Try the Two-Question Diagnostic

**HOME-26 · Intro line**
Introspection cannot read the source directly, but you can test which conditions a want depends on. Two questions, by elimination.

*(The interactive diagnostic appears here. Its text is listed under TQD-01 to TQD-14 in section 11.)*

### The framework itself

**HOME-27 · Section heading**
The framework itself

*(The two chapter cards appear here. Their text is listed under CORE-01 to CORE-03 in section 11.)*

### Where to go next

**HOME-28 · Section heading**
Where to go next

**HOME-29 · Card 1** (goes to /theory)
*Heading:* The theory
*Text:* The architecture in seven short sections: sources, integration, opacity, confabulation, parasitism, satiation, and the patch.
*Link:* Read →

**HOME-30 · Card 2** (goes to /axioms)
*Heading:* The nine axioms
*Text:* The premises everything is derived from, and what each one rests on.
*Link:* Read →

**HOME-31 · Card 3** (goes to /chat)
*Heading:* Ask the AI
*Text:* The corpus behind the chat is the full Treatise and research archive, kept current. Specific questions get specific answers.
*Link:* Open the chat →

### Author strip (bottom of page, with photo)

**HOME-32 · Photo description (alt text)**
Yule Guttenbeil

**HOME-33 · Paragraph**
The AIM Framework is the work of **Yule Guttenbeil**, a technology lawyer with a commerce degree in management. The framework is his account of wanting, written so psychology, economics and neuroscience can share one set of definitions.

**HOME-34 · Link**
About the author and the book →

---

## 3. The Theory (`/theory`)

### Search and social

**THEORY-SEO-01 · Page title**
The AIM Framework of Human Motivation Explained

**THEORY-SEO-02 · Search description**
The architecture of the AIM Framework in seven short sections: three sources of motivation, the Decision Hub, Source Opacity, Confabulation, Object Parasitism and Satiation.

**THEORY-SEO-03 · Social preview description**
The architecture of the AIM Framework in seven short sections.

### Top of page

**THEORY-01 · Heading**
The theory

**THEORY-02 · Intro paragraph**
Enough of the architecture to know what question you want to ask. Each part ends with questions the chat can answer from the Treatise itself. The framework these pages summarise is stated in full in Chapter 4 and Appendix A.

*(The two chapter cards appear here; see CORE-01 to CORE-03 in section 11.)*

**THEORY-03 · Jump links under the intro, in order**
- Three sources
- One signal
- Source Opacity
- Confabulation
- Object Parasitism
- Satiation
- The Knowledge Patch
- Applications

**THEORY-04 · Small label above each section heading**
Part 1, Part 2, … Part 8

### Part 1

**THEORY-05 · Heading**
Three sources of wanting

**THEORY-06 · Paragraph**
Every motivational signal entering the brain's decision system comes from one of three sources. They are distinct neural systems with different properties, and the same object can carry weight from all three at once: a meal addresses hunger (A), can be a pleasure in the eating (I), and can signal status through what it cost (M).

*(The three source cards appear here; see SOURCES-01 to SOURCES-03.)*

**THEORY-07 · Ask the AI chips**
- Why does the AIM Framework say loneliness and the desire to connect are Intrinsic, not Mimetic?
- What would a fourth source of motivation have to show to be admitted?

### Part 2

**THEORY-08 · Heading**
One signal: the Decision Hub

**THEORY-09 · Paragraph**
The brain cannot act on three signals at once. A Body Manager (the homeostatic-deficit system) reports bodily deficit, a Thinker (the dopaminergic system) holds priors and pursues intrinsic engagement, and an Observer (the mirror neuron system) continuously reads which objects the surrounding field marks as valued. All three feed a Decision Hub (the ventromedial prefrontal cortex and ventral striatum) that converts them into one value per option and selects an action.

*(The Decision Hub diagram and the Integration Equation box appear here; see DIAGRAM-01 to DIAGRAM-05 and EQ-01 to EQ-03 in section 11.)*

**THEORY-10 · Ask the AI chips**
- What are the four components of the AIM Framework architecture and what does each do?
- What is the Belief Register and how does it condition the Observer?

### Part 3

**THEORY-11 · Heading**
Source Opacity

**THEORY-12 · Paragraph**
Summing three quantities into one is a many-to-one map. Whatever the sum, a whole family of A, I, M combinations could have produced it, so no process downstream of the sum can recover which one did. Introspection reads the sum. The loss is not a failure of self-awareness; it is information theory.

**THEORY-13 · Paragraph**
It is worse than losing a label. Two of the inputs report a deficit that an object would close. The third, the Observer's, reports where value sits in the field and carries no termination condition at all. After integration the Hub has only one category to receive them in, so a pointer to where value is located arrives feeling like a lack. Acquiring the object then closes nothing, because nothing was open.

**THEORY-14 · Ask the AI chips**
- Explain the Salience-Deficit Conflation Principle with an everyday example.
- If Source Opacity is permanent, what does the Two-Question Diagnostic actually read?

### Part 4

**THEORY-15 · Heading**
Confabulation, and why it points at people

**THEORY-16 · Paragraph**
Asked why, the brain does not report "no data." It constructs a plausible narrative from available material and presents it as the true reason. The person sincerely believes it. Challenge produces elaboration, and each articulation is new evidence for the self-model, so the story deepens under scrutiny rather than correcting.

**THEORY-17 · Paragraph**
The stories have a characteristic shape. Causal cognition is built to track agents, who generate dense, fast-changing evidence; systemic causes generate almost none and have to be constructed deliberately. So the gap is filled with an author: "I chose this because of who I am," or, when a population is in distress, "they did this to us." The scapegoat mechanism follows.

**THEORY-18 · Ask the AI chips**
- How does the Agent-Based Causal Default produce scapegoating from collective distress?
- What is the Presumption Against Scapegoating and its Three-Test Battery?

### Part 5

**THEORY-19 · Heading**
Object Parasitism and the Mimetic Premium

**THEORY-20 · Paragraph**
Mimetic Desire does not invent its own objects. It attaches to things that already serve the body or an intrinsic pursuit and inflates their value by a Mimetic Premium that feels like a property of the thing. That is what makes it hard to detect: the A and I reasons for wanting the bigger house are genuinely present, and the premium rides on top of them with no phenomenology of its own.

**THEORY-21 · Paragraph**
Every price can therefore be decomposed into an A-functional price, an I-adequate price, and a Mimetic Premium. The premium is paid as though status could be bought, but status is computed in other people's minds, is zero-sum across the group, and is not for sale.

*(The Mimetic Premium box appears here; see PREMIUM-01 to PREMIUM-04 in section 11.)*

**THEORY-22 · Ask the AI chips**
- What is the Status-Premium Duality?
- Why did black pepper stop being a status good, and what does that show about M?

### Part 6

**THEORY-23 · Heading**
Why some wants end and one never does

**THEORY-24 · Paragraph**
Appetites satiate and recur: eat, and hunger ends until it returns. Intrinsic engagement deepens rather than ending: mastery opens new frontiers, though the tools it needs do satiate once they are adequate. Mimetic Desire has no stopping point, because the Observer is reading an unbounded field, not measuring an internal shortfall. Achieving a status goal simply resets the comparison.

**THEORY-25 · Paragraph**
This is why societies can reach material abundance without reaching widespread wellbeing. Surplus flows into status competition rather than intrinsic engagement, spending rises, and welfare plateaus. It is also, in the formal treatment, why mimetic crises crash rather than oscillate.

**THEORY-26 · Ask the AI chips**
- What is the Mimetic Treadmill and the Reference-Set Reset?
- Why does the Treatise say mimetic crises end in a fold rather than a cycle?

### Part 7

**THEORY-27 · Heading**
The Knowledge Patch

**THEORY-28 · Paragraph**
If the source cannot be read by introspection, it can still be inferred from how a want behaves across contexts. The Treatise's intervention, the Knowledge Patch, is seven operations that work by generating doubt where a belief system has settled on a false prior:

**THEORY-29 · Numbered list**
1. **AIM Vocabulary Acquisition**, so the mimetic hypothesis is even representable.
2. **Epistemic Suspension**, tolerating "I don't know" as a stable state.
3. **The Two-Question Diagnostic**, source identification by elimination.
4. **Behavioural Signatures**, reading the pattern over time, in oneself and others.
5. **The Presumption Against Scapegoating**, with the Grievance Gateway and Three-Test Battery.
6. **The Push-Pull Obligation Principle**, for interpersonal obligation.
7. **The Normality Fiction Breaker**, for self-comparison against a mimetic template.

**THEORY-30 · Buttons**
- Ask about the Knowledge Patch *(sends to the chat: "Explain the seven operations of the Knowledge Patch and why the Treatise says vocabulary acquisition has to come first.")*
- Try the diagnostic → *(goes to the diagnostic on the home page)*

### Part 8

**THEORY-31 · Heading**
Applications

**THEORY-32 · Paragraph**
The same architecture, traced through markets, law, institutions and relationships. The Treatise and research corpus cover these in depth; the chat is the fastest route into any of them.

**THEORY-33 · Application buttons** (each shows "Topic: question" and sends the question to the chat)
- Economics: How does the AIM Framework explain the Easterlin Paradox and Veblen goods?
- Money and debt: Why does the AIM Treatise describe interest as a pure Mimetic Premium?
- Law and justice: How does the AIM Framework define freedom, coercion and justice without importing moral premises?
- Psychology: How does the AIM Framework relate to Self-Determination Theory, and where do they differ?
- Organisations: What does the AIM Framework say about status tournaments at work and how to protect intrinsic motivation?
- Health and policy: How would the AIM Framework separate need from socially amplified demand in health policy?
- Marketing: How does the AIM Framework account for why some products go viral and others do not?
- Education: How does the AIM Framework explain the crowding-out of curiosity by grades and status?
- Social media: What does the AIM Framework predict about high-visibility platforms and mimetic crisis?
- Artificial intelligence: What does Appendix C of the Treatise say about applying the architecture of the AIM Framework to AI?
- Violence and crisis: How does the AIM Framework derive violence and scapegoating as architectural outputs?
- Governance: What is the governance architecture in the AIM Framework and what does it try to secure?

### Bottom of page

**THEORY-34 · Buttons**
- The nine axioms → *(goes to /axioms)*
- Glossary → *(goes to /glossary)*

---

## 4. The Nine Axioms (`/axioms`)

Each axiom card shows: number, title, a status badge, a plain-English summary, sometimes a status note, then a "Canonical statement and citations" drop-down, then two Ask the AI chips. The canonical statements inside the drop-down are Treatise text and are not reproduced here; the citations are reference data and are also left out.

### Search and social

**AXIOMS-SEO-01 · Page title**
The Nine Axioms of Human Motivation | The AIM Framework

**AXIOMS-SEO-02 · Search description**
The nine axioms of the AIM Framework: the premises from which the theory is derived, each with its epistemic status and foundational citations.

**AXIOMS-SEO-03 · Social preview description**
The premises from which the AIM Framework is derived, with epistemic status and citations.

**AXIOMS-SEO-04 · Structured-data description** (read by search engines, not shown on the page)
The nine axioms on which the AIM Framework rests, as stated in the AIM Treatise, Chapter 4, with their epistemic status and foundational citations.

### Top of page

**AXIOMS-01 · Heading**
The Nine Axioms

**AXIOMS-02 · Intro paragraph**
Everything in the AIM Framework is derived from these nine premises. Most are inherited from established science; one follows mathematically from another; three are the AIM Framework's own. The framework is falsifiable.

*(Jump links follow, one per axiom, using the axiom titles below.)*

### Status badges

**AXIOMS-03 · Badge names, and the tooltip shown when hovering over each**
- Inherited: Taken from established, replicated scholarship.
- Mathematically entailed: Follows from other axioms by a formal result (here, the Data Processing Inequality).
- Novel synthesis: Specific to the AIM Framework.

**AXIOMS-04 · Drop-down label on every card**
Canonical statement and citations

**AXIOMS-05 · Source line inside each drop-down**
AIM Treatise, Chapter 4, Section 4.3.{axiom number}

### Axiom 1

**AX1-01 · Title**
Three-Source Taxonomy

**AX1-02 · Badge**
Novel synthesis

**AX1-03 · Plain summary**
Every want comes from one of three places: the body (Appetites), the activity itself (Intrinsic Motivation), or other people wanting it (Mimetic Desire). Nothing else is needed, and fewer would blur things the brain keeps apart.

**AX1-04 · Status note**
A and I are inherited (Cannon; Deci & Ryan). The claim that these plus M are exactly three, and exhaustive, is the AIM Framework's own, defended by the bidirectional consilience argument in Chapter 4.

**AX1-05 · Ask the AI chips**
- Why does the AIM Framework say there are exactly three sources of motivation and not four?
- Is loneliness an Appetite, Intrinsic Motivation, or Mimetic Desire?

### Axiom 2

**AX2-01 · Title**
Common-Currency Integration

**AX2-02 · Badge**
Inherited

**AX2-03 · Plain summary**
The brain has to pick one thing to do next, so it mixes the three inputs into a single value signal, like three audio channels into one speaker. The weights on each channel shift with your state.

**AX2-04 · Ask the AI chips**
- What is the Integration Equation in the AIM Framework and what do the weights mean?
- How does the wanting-liking dissociation support common-currency integration?

### Axiom 3

**AX3-01 · Title**
Source Opacity

**AX3-02 · Badge**
Mathematically entailed

**AX3-03 · Plain summary**
Once the three are mixed into one signal, the label saying which source contributed what is gone. You can feel how much you want something; you cannot read off why. This is a structural fact, not a lack of self-awareness.

**AX3-04 · Status note**
Three inputs summed into one output is a many-to-one map; the Data Processing Inequality guarantees nothing downstream can recover what the sum discarded.

**AX3-05 · Ask the AI chips**
- If introspection cannot tell me where a want came from, how can I ever find out?
- What is the Salience-Deficit Conflation Principle?

### Axiom 4

**AX4-01 · Title**
Confabulation

**AX4-02 · Badge**
Inherited

**AX4-03 · Plain summary**
Asked why you wanted something, your brain does not say "I don't know." It builds a plausible story and believes it. Socially caught wants are the most likely to be misfiled, because they arrive looking like a need and leave nothing behind to check.

**AX4-04 · Ask the AI chips**
- What is the Romantic Lie and how does it relate to Confabulation?
- Why does challenging someone's reasons make them more certain, not less?

### Axiom 5

**AX5-01 · Title**
M as Amplifier (Object Parasitism)

**AX5-02 · Badge**
Novel synthesis

**AX5-03 · Plain summary**
Mimetic Desire never invents new things to want. It inflates the value of things that already serve the body or an intrinsic pursuit, adding a Mimetic Premium that feels like it belongs to the object itself.

**AX5-04 · Status note**
Derived from the fact that mirror-neuron systems detect goal-directed action toward Objects, not Objects themselves.

**AX5-05 · Ask the AI chips**
- What is the Mimetic Premium and how does Price Decomposition work?
- Why does the AIM Framework say status cannot be purchased?

### Axiom 6

**AX6-01 · Title**
Differential Satiation Dynamics

**AX6-02 · Badge**
Novel synthesis

**AX6-03 · Plain summary**
Hunger ends when you eat and comes back later. Mastery never "fills up"; it opens new frontiers, though the tools you need do satiate. Status never ends at all, because it reads what others value, and there is always more to read.

**AX6-04 · Ask the AI chips**
- How does Differential Satiation explain the Easterlin Paradox?
- What is the Mimetic Treadmill?

### Axiom 7

**AX7-01 · Title**
Preconscious Transmission

**AX7-02 · Badge**
Inherited

**AX7-03 · Plain summary**
You catch other people's wants faster than you can notice. By the time "I want that" is in awareness, the copied signal has already been mixed in, so it feels like your own.

**AX7-04 · Ask the AI chips**
- Why do wisdom traditions' prohibitions on coveting have limited effect under the AIM Framework?
- What is the Transmission Window and the Libet Window?

### Axiom 8

**AX8-01 · Title**
Bayesian Belief Dynamics

**AX8-02 · Badge**
Inherited

**AX8-03 · Plain summary**
Beliefs update by weighing what you already believed against new evidence, and today's conclusion becomes tomorrow's starting point. The machinery does not care whether a belief is true, so a confabulated story gets entrenched like any other.

**AX8-04 · Ask the AI chips**
- What is a Confabulation Cascade and when does it become self-sustaining?
- What are the Crisis State Phases in the AIM Framework?

### Axiom 9

**AX9-01 · Title**
Agent-Based Causal Default

**AX9-02 · Badge**
Inherited

**AX9-03 · Plain summary**
When something goes wrong, the brain asks "who did this?" before "what system produced this?" Agent-shaped explanations are cheap to compute; systemic ones have to be built. So confabulation points at people, which is why distress finds scapegoats.

**AX9-04 · Status note**
Axiom 9 is not load-bearing for the architecture or its mathematics; Axioms 1 to 8 are. It is load-bearing for the account of the form the architecture's failures take: why confabulation is agent-shaped and why collective distress converges on scapegoats.

**AX9-05 · Ask the AI chips**
- Why is Axiom 9 described as not load-bearing for the architecture?
- How does the Agent-Based Causal Default lead to the scapegoat mechanism?

### How they fit together (bottom of page)

**AXIOMS-06 · Heading**
How they fit together

**AXIOMS-07 · List**
- **1 and 2** set up the three sources and how they are combined.
- **3 and 4** explain why the three are invisible to introspection.
- **5** explains why M rides on A and I instead of standing alone.
- **6** explains why satisfying each source has different results.
- **7** fixes the timing that makes 3 and 4 unavoidable.
- **8** explains how confabulated beliefs get entrenched and spread.
- **9** explains why they take the shape of a culprit.

**AXIOMS-08 · Buttons**
- Ask how the axioms interlock *(sends to the chat: "Walk me through how the nine axioms of the AIM Framework depend on each other and what each one is load-bearing for.")*
- Read the theory → *(goes to /theory)*

---

## 5. About (`/about`)

### Search and social

**ABOUT-SEO-01 · Page title**
About the Author and the AIM Framework

**ABOUT-SEO-02 · Search description**
Who is behind the AIM Framework, the Treatise, and what the framework claims and does not claim.

**ABOUT-SEO-03 · Social preview description**
The author, the book, and its claims.

### Top of page

**ABOUT-01 · Heading**
About

**ABOUT-02 · Intro line**
The author, the book, and what it claims and does not claim.

### Author

**ABOUT-03 · Photo description (alt text)**
Yule Guttenbeil

**ABOUT-04 · Heading**
Yule Guttenbeil

**ABOUT-05 · Opening line (beside the photo)**
I'm **Yule Guttenbeil**, the person who formulated the AIM Framework and creator of aimtheory.org.

**ABOUT-06 · Paragraph**
The purpose of this website and the AIM Framework is to explain how recent neuroscientific discoveries shed light on where our motivations come from in the brain. These discoveries make it easier to understand ourselves, our relationships with others, and how society is arranged as a whole. The flow-on effects from how we understand our own motivations extend to how we think about most of the human behavioural sciences.

**ABOUT-07 · Paragraph**
I'm a technology lawyer with a bachelor's degree in commerce majoring in management. Management is the study of how to align the motivations of the members of an organisation with the goals of that organisation. It adopts frameworks from many fields of the humanities that study motivation, many of which when examined closely and compared with each other can't be reconciled. I'm also a [software developer](https://libris.au/), [award winning AI ethicist and consultant](https://smbtech.au/news/attune-legals-yule-guttenbeil-awarded-ai-consultant-of-the-year-for-responsible-ai-advocacy/), and [musician](https://themusic.com.au/features/ulysses-wulf-brynn-davies/4ZHy9fT39vk/15-04-16).

**ABOUT-08 · Paragraph**
While it might seem unusual for a lawyer to develop a framework of human motivation, my professional background, particularly in writing and analysing contracts, has given me a unique ability when assessing the literature I've read across the human behavioural sciences (psychology, economics, philosophy, neuroscience, etc.). Writing contracts is like building a machine: every definition and term in a contract operates like a cog that must fit precisely with the others, or the machine breaks down.

**ABOUT-09 · Paragraph**
In behavioural science, I believe we've been dealing with a definitional error that causes a kind of "code drift", in how we define wants, needs, and preferences. The AIM Framework provides refined definitions that align more accurately with how our motivations work neurologically and play out in behaviour, allowing the reduction of friction in human interactions.

**ABOUT-10 · Paragraph**
Contracts exist to manage rivalry; they make implicit expectations explicit and help prevent conflict by clearly defining boundaries and roles. Without them, confusion and disputes arise because competing motivations remain unarticulated. In that sense, (despite the popular imagining) lawyers help grease the wheels of human relationships.

**ABOUT-11 · Paragraph**
In that light, I invite you to explore the resources I have made available on this website which are based on my own research. This is a living project, so the structure and information on this site will be updated as the theory, hypothesis and findings develop over time.

**ABOUT-12 · Highlighted box (amber)**
The AIM Framework is a synthetic theory. It provides a basis for hypothesising predictions and tightly boundered tests in order to validate its premise. I am not a professional psychologist, economist, philosopher or neuro-scientist. Though I have read broadly across those fields. Therefore, I am seeking assistance from experts in each of those fields to help me validate the theory, because if what the AIM Framework suggests is correct, it may provide a scientific basis for restructuring human societies, economies and governmental structures to enable human flourishing – by removing memetic noise and distortion from areas where it should not override the intrinsic motivations of every individual.

**ABOUT-13 · Subheading**
How It All Started

**ABOUT-14 · Paragraph**
One of my strongest early memories is believing I was an alien. I was no older than 4. I felt that my father didn't understand me and that I couldn't understand him. I couldn't relate to him or effectively communicate the importance of my wants and needs to him. That feeling persisted in various forms throughout my life and ultimately led me to therapy in 2010.

**ABOUT-15 · Paragraph**
It was here that I told my therapist that I didn't know whether I wanted things for myself because I genuinely wanted them, or because my dad wanted them for me. The therapist responded, "Well, then that's where your work is — finding that out." The AIM Framework represents the culmination of that work. It appears to me that in answering that question for myself, I may have inadvertently answered the same question for everyone's self.

### The book

**ABOUT-16 · Heading**
The book

**ABOUT-17 · Book title**
A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and Mimetic Desire

*(The two chapter cards appear here; see CORE-01 to CORE-03 in section 11.)*

**ABOUT-18 · Paragraph**
Twenty chapters and further appendices follow that pair. They explain the framework and show how it plays out, so that each step can be checked and each prediction tested. In active revision; the chat is always answering from the current text.

**ABOUT-19 · Chapter list heading, Part I**
Part I: Diagnosis

**ABOUT-20 · Chapter list, Part I** (these are the Treatise's chapter titles; change them only if the Treatise changes)
1. Introduction
2. Definitions and Glossary
3. System Scope and OCEP
4. The Axiomatic and Architectural Foundation of AIM
5. Why Motivation Requires Disaggregation
6. Appetites
7. Intrinsic Motivation
8. Mimetic Desire
9. Neural Integration and Source Opacity
10. The Evolutionary Mismatch Hypothesis
11. Confabulation, Projection and the Scapegoat Mechanism
12. Money, Debt and the Architecture of Mimetic Extraction
13. Bayesian Belief Dynamics
14. Quantum Epistemology

**ABOUT-21 · Chapter list heading, Part II**
Part II: Response

**ABOUT-22 · Chapter list, Part II**
15. The Bayesian Self-Model
16. Conflict and Justice
17. Violence as Architectural Output
18. The Knowledge Patch
19. The Dissolution of Individualism and the Derivation of Relationalism
20. The Governance Architecture

**ABOUT-23 · Note under Part II**
The other appendices propose a validation roadmap and follow the architecture into particular cases, including artificial intelligence.

**ABOUT-24 · Ask the AI chips**
- Give me a chapter-by-chapter summary of the AIM Treatise.
- What is in Appendix A, the mathematical structure of the AIM system?
- What does the validation roadmap in Appendix B propose?

### Claims

**ABOUT-25 · Heading**
What the AIM Framework claims, and does not

**ABOUT-26 · Column heading**
Claims

**ABOUT-27 · Claims list** (Treatise text, Chapter 1, Section 1.4)
1. Human motivation decomposes into three neurologically distinct sources: Appetites (A), Intrinsic Motivation (I), and Mimetic Desire (M).
2. A and I report deficits; M reports Salience. The three converge through Common-Currency Integration in the Decision Hub, which produces a single decision signal.
3. The architecture does not stop at the boundary of the individual. It is one coupled system, the same loops at every scale, with no new primitives beyond the first.
4. After integration, which source produced which part of the signal is lost (Source Opacity). A Salience signal is therefore felt as a deficit.
5. The brain compensates by generating sincere but often inaccurate narratives about why it chose (Confabulation).
6. The three sources satiate differently. A and I close when repaired; M has no terminal value and so no natural stopping point.
7. These features, with the preconscious transmission of M, produce predictable patterns of individual dysfunction and collective crisis.
8. Thin normative concepts (freedom, fairness, justice, coercion, consent, harm, dignity, well-being) can be derived from the architecture without importing moral premises.
9. Institutions can be evaluated by how well they secure basic needs, protect the space in which I operates, and manage the M dynamics that lead to crisis.

**ABOUT-28 · Column heading**
Does not claim

**ABOUT-29 · Does-not-claim list** (Treatise text, Chapter 1, Section 1.4)
1. That only three categories can ever exist. Three is the most parsimonious decomposition consistent with current evidence; a fourth would require revision.
2. That the AIM Framework is already validated. It is a coherent synthesis that generates testable predictions and awaits peer-reviewed validation. A validation roadmap is in the appendices.
3. That the AIM Framework explains all of cognition, emotion or behaviour. It is a theory of motivation: how wanting arises, forms beliefs, and drives action.
4. That the AIM Framework replaces other frameworks. Self-Determination Theory, behavioural economics, mimetic theory and drive theories remain valuable; the AIM Framework integrates and clarifies them.
5. That applying it is simple. Identifying the dominant source and designing an intervention takes skill and judgement. The framework supplies diagnostics, not automatic answers.
6. That interventions aligned with the AIM Framework always succeed. Correct diagnosis does not guarantee effective treatment.

**ABOUT-30 · Source line**
From the Treatise, Chapter 1, Section 1.4.

### Get in touch

**ABOUT-31 · Heading**
Get in touch

**ABOUT-32 · Paragraph**
Peer review, research collaboration and corrections are all welcome. For questions about the theory itself, the chat will usually be faster and more precise than I can be by email.

**ABOUT-33 · Buttons**
- Contact → *(goes to /contact)*
- Ask where to start *(sends to the chat: "I'm a researcher. Where should I start with the AIM Framework and the Treatise?")*

---

## 6. Contact (`/contact`)

### Search and social

**CONTACT-SEO-01 · Page title**
Contact Yule Guttenbeil | The AIM Framework

**CONTACT-SEO-02 · Search description**
Get in touch about the AIM Framework: research collaboration, speaking, or questions about applying it.

**CONTACT-SEO-03 · Social preview description**
Research collaboration, speaking, or questions about applying it.

### Top of page

**CONTACT-01 · Heading**
Get in Touch

**CONTACT-02 · Intro line**
Whether you're a researcher, practitioner, organization, or journalist—we'd love to hear from you.

**CONTACT-03 · Blue box heading**
Have Questions About the AIM Framework?

**CONTACT-04 · Blue box text**
For questions about the AIM Framework, testable predictions, or research applications, we encourage you to try the **AIM Framework** AI assistant first. It has access to the latest versions of our research documentation and can provide detailed answers about the framework's theoretical foundations and practical applications.

**CONTACT-05 · Blue box button**
Ask the AI →

### Form

**CONTACT-06 · Form heading**
Send us a message

**CONTACT-07 · Field labels** (* means required)
- Name *
- Email *
- Affiliation/Organization
- I'm interested in: *
- Subject *
- Message *

**CONTACT-08 · "I'm interested in" options, in order**
- Select an option *(the empty default)*
- Request Research Paper
- Research Collaboration
- Testing & Validation
- Organizational Consulting
- Speaking Engagement
- Media Inquiry
- General Question

**CONTACT-09 · Subject placeholder**
Brief description of your inquiry

**CONTACT-10 · Shown only when "Request Research Paper" is chosen: note**
**Note:** As Yule is a working lawyer, papers will generally include limited references but will provide sufficient information for you to further investigate and critique the framework's application to your specific domain.

**CONTACT-11 · Research paper fields** (replace the Message field when "Request Research Paper" is chosen)
*Label:* Research Paper Scope * (Your field, topic, or domain of interest)
*Placeholder:* e.g., Application of AIM Framework to consumer behavior in sustainable fashion markets, or neuroscience grounding for mimetic desire in adolescents...

*Label:* Specific Questions * (What you want the paper to address)
*Placeholder:* e.g., How does the AIM Framework explain the rise of sustainable fashion preferences? What testable predictions can it make about consumer behavior changes? How would you measure intrinsic vs. mimetic motivations in this context?

**CONTACT-12 · Submit button**
Send Message *(while sending: "Sending...")*

**CONTACT-13 · Pop-up messages after submitting**
- Success: Message sent successfully! We'll get back to you within 48 hours.
- Failure: Failed to send message. Please try again.
- Missing name or email: Name and email are required
- Missing research paper fields: Research paper scope and questions are required
- Missing message: Message is required
- Server error: Failed to process message. Please try again or email directly.

### Why collaborate (blue band)

**CONTACT-14 · Heading**
Why Collaborate on the AIM Framework?

**CONTACT-15 · Intro**
This isn't an incremental improvement—it's a fundamental reorganization of how we understand human motivation, with implications for every field of human behavior.

**CONTACT-16 · Card 1**
*Heading:* Not Incremental—Revolutionary
*Text:* Most theories propose new mechanisms. The AIM Framework proposes new **categories**. It provides the first neuroscientific basis for cross-disciplinary definitions of fundamental human concepts, organizing existing evidence into a coherent taxonomic framework.

**CONTACT-17 · Card 2**
*Heading:* Unique Cross-Disciplinary Applications
*Text:* The AIM Framework enables scientific definitions of freedom, respect, fairness, and privacy that apply uniformly across economics, law, psychology, and policy—resolving conflicts between different fields' approaches to human behavior.

**CONTACT-18 · Card 3**
*Heading:* Testable Predictions Existing Frameworks Cannot Make
*Text:* The AIM Framework's tri-source model enables predictions about market failures, intervention backfires, and social dynamics escalation that no existing theory can make—providing a competitive advantage in research and practice.

**CONTACT-19 · Wide box**
*Heading:* The Opportunity
*Text:* The AIM Framework represents the first time in history that concepts like "freedom," "respect," "fairness," and "privacy" can be defined scientifically rather than philosophically, with testable predictions about when they are violated and how to restore them.

### Collaboration opportunities

**CONTACT-20 · Heading**
Collaboration Opportunities

**CONTACT-21 · For Researchers**
- Test the AIM Framework's predictions across disciplines
- Co-author publications
- Access framework materials and datasets

**CONTACT-22 · For Practitioners**
- Organizational design consulting
- Contract & policy design support
- Training & workshops

**CONTACT-23 · For Organizations**
- Pilot interventions based on the AIM Framework
- System redesign projects
- Research partnerships

**CONTACT-24 · For Media**
- Expert commentary on motivation science
- Speaking engagements
- Access to research papers and findings

### Connect

**CONTACT-25 · Heading**
Connect

**CONTACT-26 · Text**
Email: yule@attune.legal

We aim to respond to all inquiries within 48 hours.

---

## 7. Articles

The article bodies, titles, summaries, categories and tags live in the database and are edited through the admin panel, so they are not included here. This section covers the fixed text around them.

### Articles list (`/articles`)

**ARTICLES-SEO-01 · Page title**
Articles Applying the AIM Framework

**ARTICLES-SEO-02 · Search description**
Insights and analysis applying the AIM Framework to economics, psychology, law, organisations, and more.

**ARTICLES-SEO-03 · Social preview description**
Applying the AIM Framework to economics, psychology, law, organisations, and everyday life.

**ARTICLES-01 · Heading**
Articles

**ARTICLES-02 · Intro line**
Applying the AIM Framework to economics, psychology, law, organisations, and everyday life.

**ARTICLES-03 · Shown when nothing is published**
No articles published yet.

**ARTICLES-04 · Byline format**
By {author} · {date, e.g. October 21, 2026}

### Single article page (`/articles/…`)

**ARTICLE-01 · Breadcrumb**
Home / Articles / {article title}

**ARTICLE-02 · Line under the title**
By {author} · {date} · {n} min read

**ARTICLE-03 · Button**
Download as PDF

**ARTICLE-04 · Share heading and buttons**
Share this article
- Share on X
- Share on LinkedIn
- Share on Facebook

**ARTICLE-05 · Browser-tab title when an article is missing**
Article Not Found

---

## 8. Ask the AI (`/chat`)

**CHAT-SEO-01 · Page title**
Ask the AI | The AIM Framework *(signed-in users see the conversation's title instead; the bare /chat address shows "AIM Framework Chat | The AIM Framework" for a moment before a new conversation opens)*

**CHAT-SEO-02 · Search description**
Chat with the AIM Framework AI Assistant

**CHAT-01 · Bar at the top of the chat**
Ask the AI

**CHAT-02 · Welcome box heading**
Ask the AI about the AIM Framework

**CHAT-03 · Welcome box text**
Answers come from the AIM Treatise and research corpus, which is kept current. Ask anything, or start with one of these:

**CHAT-04 · Starter questions**
- What are the three sources of motivation in the AIM Framework, in plain terms?
- Why can't I tell where a desire came from just by thinking about it?
- What is Object Parasitism, and what is the Mimetic Premium?
- Why does status-seeking never feel finished?
- What are the two questions in the Two-Question Diagnostic?
- How does the AIM Framework explain scapegoating?

**CHAT-05 · Message box placeholder**
Ask a question about the AIM Framework
*(after a guest runs out of free questions: "Sign in to keep asking")*

**CHAT-06 · Line under the message box**
Answers are drawn from the AIM Framework corpus. Verify, and use your own judgement.
*(guests also see: "· Guest · {n} questions left", or "1 question left")*

**CHAT-07 · Answer-style switch, beside that line**
Plain English / Academic

**CHAT-08 · Buttons above the message box**
- Stop generating *(while an answer is being written)*
- Regenerate response *(after an answer)*

**CHAT-09 · Hover labels**
- New Chat
- Send message

**CHAT-10 · Guest limit reached**
*Heading:* You've used your {n} free questions
*Text:* Sign in to keep asking and to save your conversations. It's free.
*Buttons:* Sign in · Create an account

**CHAT-11 · Error messages**
- The server had trouble answering. Please try again.
- Request failed ({error code}).
- Something went wrong. Your message was kept so you can retry.
- Your session has expired. Please sign in again.
- Button: Retry

**CHAT-12 · Loading**
- Loading chat
- Loading...

**CHAT-13 · Chat history panel (signed-in users)**
- Panel heading: Chat History
- Empty state: No chat history
- Hover label on shared chats: This is a shared chat.
- Clear history *(button)*

**CHAT-14 · Clear-history confirmation**
*Heading:* Are you absolutely sure?
*Text:* This will permanently delete your chat history and remove your data from our servers.
*Buttons:* Cancel · Delete

**CHAT-15 · Share and delete a single chat**
- Hover labels: Share chat · Delete chat
- Share dialog heading: Share link to chat
- Share dialog text: Anyone with the URL will be able to view the shared chat.
- Share dialog button: Copy link *(while working: "Copying...")*
- Pop-ups: Share link copied to clipboard · Could not copy share link to clipboard · Clipboard not available
- Delete confirmation heading: Are you absolutely sure?
- Delete confirmation text: This will permanently delete your chat message and remove your data from our servers.
- Delete confirmation buttons: Cancel · Delete
- Pop-up after deleting: Chat deleted

**CHAT-16 · Treatise side panel** (opens when you click a Treatise citation in an answer)
- Loading the section…
- This section could not be loaded.
- Next →

**CHAT-17 · Shared chat page** (`/share/…`)
{chat title}
{date} · {n} messages

---

## 9. Motivational Self-Diagnosis (`/diagnostic`)

This page is live and listed in the sitemap, so Google can find it, but nothing on the site links to it. It predates the Two-Question Diagnostic on the home page and works differently. You may want to delete the page rather than rewrite it; if so, write `DELETE` under DIAG-00.

**DIAG-00 · Keep or delete this page?**
Keep

**DIAG-SEO-01 · Page title**
Motivational Self-Diagnosis | The AIM Framework

**DIAG-SEO-02 · Search description**
A short set of scenarios showing which source of motivation, Appetite, Intrinsic Motivation or Mimetic Desire, is driving a decision, using the AIM Framework.

**DIAG-SEO-03 · Social preview description**
Which source of motivation is driving your decision? A short diagnostic built on the AIM Framework.

**DIAG-01 · Heading**
Motivational Self-Diagnosis

**DIAG-02 · Intro line**
Answer three questions to identify which motivational source is currently dominant in your decision-making

**DIAG-03 · Instructions box**
**How this works:** Each question presents three options representing the three motivational sources. Choose the option that most accurately reflects your current thinking. There are no "right" answers—this is about self-awareness, not judgment.

**DIAG-04 · Scenario 1**
*Question:* You're considering a major career change. What's your primary motivation?
- A: The current job doesn't pay enough to cover my basic needs and I'm constantly stressed about money
  *Explanation:* This is appetitive motivation—your physiological security needs are unmet and dominating your decision-making.
- I: I'm bored and unchallenged. I want to master new skills and work on projects that genuinely interest me
  *Explanation:* This is intrinsic motivation—you're seeking autonomy, competence, and engagement for their own sake.
- M: Everyone in my social circle is advancing faster than me. I need a more prestigious title or company
  *Explanation:* This is mimetic desire—you're comparing yourself to social models and wanting what they have.

**DIAG-05 · Scenario 2**
*Question:* Why do you want to buy that new item (car, phone, clothes, etc.)?
- A: My current one is broken or unsafe, and I need it to function properly in daily life
  *Explanation:* Appetitive—the item serves a genuine functional need for safety or basic capability.
- I: The new features would genuinely improve my workflow or enable creative projects I'm passionate about
  *Explanation:* Intrinsic—you value the tool for how it enables autonomous, meaningful activity.
- M: I see others with it and feel like I'm falling behind or missing out. It would show I'm successful
  *Explanation:* Mimetic—you're responding to social visibility and status signaling, not intrinsic quality.

**DIAG-06 · Scenario 3**
*Question:* You have a free Saturday afternoon. How do you decide what to do?
- A: I'm exhausted and need to rest, or I have urgent household needs that can't wait
  *Explanation:* Appetitive—your body is signaling deficit (fatigue, hunger) or basic maintenance needs.
- I: I choose an activity I find genuinely absorbing—reading, creating, learning—regardless of what others think
  *Explanation:* Intrinsic—you're selecting based on autonomous interest and process-rewarding engagement.
- M: I check what friends are doing, look at social media, and feel pulled toward whatever seems popular or impressive
  *Explanation:* Mimetic—your choices are mediated through observation of others' visible activities.

**DIAG-07 · Submit button and hint**
See Your Results →
Please answer all 3 questions to see results

**DIAG-08 · Results headings**
- Your Results
- Your Dominant Source: {Appetites / Intrinsic Motivation / Mimetic Desire}
- What to do:
- Understanding Your Answers
- You chose: …
- Analysis: …

**DIAG-09 · Result: Appetites**
*Summary:* Your motivations are currently dominated by physiological and safety needs.
*Insight:* When appetites dominate, it's difficult to focus on intrinsic projects or resist mimetic pressure. This isn't a personal failing—it's how the brain's valuation system works. Securing basic needs should be the priority.
*What to do:* Focus on stabilizing your A-layer: consistent income, safe housing, reliable food access, adequate rest. Once appetites are secured, intrinsic motivation and autonomous choice become much more accessible.

**DIAG-10 · Result: Intrinsic Motivation**
*Summary:* Your motivations are primarily driven by autonomous interest and mastery.
*Insight:* You're making choices based on genuine engagement rather than external pressures. This is associated with higher well-being, creativity, and resilience. However, don't neglect appetitive needs or become oblivious to mimetic pressures that can still influence you.
*What to do:* Protect your intrinsic space: guard against mimetic infiltration (status competitions, social comparison), ensure A-layer security doesn't erode, and be mindful when institutions try to hijack your I-motivation with external rewards.

**DIAG-11 · Result: Mimetic Desire**
*Summary:* Your motivations are strongly influenced by social observation and comparison.
*Insight:* You're making choices based on what you see others wanting or having. This isn't inherently bad—social learning is essential—but when mimetic signals dominate, they can crowd out intrinsic interests and lead to rivalry, anxiety, and unfulfilling pursuits.
*What to do:* Practice the audience-removal test: would you still want this if no one could see it? Reduce exposure to high-visibility social media. Seek low-status environments where genuine skill matters more than prestige. Reconnect with activities that absorbed you before you worried about comparison.

**DIAG-12 · Buttons after results**
- Take Again
- Learn More About the AIM Framework → *(goes to /theory)*

**DIAG-13 · Important Context section**
*Heading:* Important Context

**This is situational, not permanent:** Your dominant motivational source can change based on context. When you're sleep-deprived or financially stressed, A dominates. When secure and engaged, I can flourish. When surrounded by high-status models and visible competition, M intensifies.

**All three are always present:** You always have appetites, intrinsic interests, and mimetic influences. This diagnostic identifies which is currently winning the weighting in your brain's common-currency valuation system.

**Not a personality test:** This isn't about fixed traits. It's about understanding the structural dynamics of motivation so you can make more intentional choices about your environment, goals, and priorities.

---

## 10. Accounts, errors and system pages

### Sign in (`/sign-in`) and sign up (`/sign-up`)

**AUTH-01 · Form labels and buttons**
- Email
- Password
- Forgot password? *(sign-in only)*
- Sign In / Sign Up *(button)*
- Don't have an account? Sign Up
- Already have an account? Sign In
- Login with GitHub *(only shown if GitHub login is switched on)*

**AUTH-02 · Pop-up after signing up**
Check your inbox to confirm your email address!

**AUTH-03 · Shown above the sign-in form when someone tried to download a document**
Please sign in to download research documents. This helps us maintain our researcher mailing list.

**AUTH-04 · Shown if sign-in is not configured** (should never appear on the live site)
*Heading:* Authentication Not Available
*Text:* The authentication service is being configured. Please check back soon.
*Button:* Return to Home

### Reset password (`/reset-password`)

**AUTH-05 · Form**
*Heading:* Reset Password
*Text:* Enter your email and we'll send you a reset link
*Label:* Email
*Button:* Send Reset Link *(while working: "Sending...")*
*Link:* Back to Sign In

**AUTH-06 · After sending**
*Pop-up:* Check your email for the password reset link
*Heading:* Check Your Email
*Text:* We've sent a password reset link to {email}
*Link:* Return to Sign In

### Update password (`/update-password`)

**AUTH-07 · Form**
*Heading:* Update Password
*Text:* Enter your new password
*Labels:* New Password · Confirm Password
*Button:* Update Password *(while working: "Updating...")*

**AUTH-08 · Pop-ups**
- Passwords do not match
- Password must be at least 6 characters
- Password updated successfully

### Page not found (404)

**404-01 · Browser-tab title**
Page not found

**404-02 · Small label**
404

**404-03 · Heading**
This page could not be found

**404-04 · Paragraph**
The address may have changed when the site moved to aimtheory.org, or the page may have been retired. Everything that is published lives under one of the sections below.

**404-05 · Cards**
- The Theory: The architecture of the AIM Framework in seven short sections.
- Articles: The framework applied to economics, law, psychology and more.
- The Treatise: The current working text of the book.
- Glossary: Every defined term in the framework.

**404-06 · Link**
Return to the home page

### Error page

**ERR-01 · Small label**
Error

**ERR-02 · Heading**
Something went wrong loading this page

**ERR-03 · Paragraph**
The content is still there; the request failed on our side. Trying again usually works.

**ERR-04 · Buttons and reference line**
- Try again
- Return home
- Reference: {error code}

### Service unavailable (`/service-unavailable`)

**DOWN-01 · Heading**
Service Temporarily Unavailable

**DOWN-02 · Text**
The authentication service is currently being configured. This affects the chat feature, admin panel, and research document downloads. All research content and framework documentation remains accessible for reading.

**DOWN-03 · Button**
Return to Home

---

## 11. Shared building blocks (appear on more than one page)

Editing these changes every page they appear on.

### The three source cards (home page and Theory page)

**SOURCES-01 · Appetites (A)** (red card)
*Text:* What the body and basic security need: food, rest, warmth, safety, shelter, a floor of income. Urgent while active; fades once met; returns when the deficit does.
*Signature line:* Signature: satiates, then recurs.

**SOURCES-02 · Intrinsic Motivation (I)** (green card)
*Text:* What is rewarding in the doing: curiosity, mastery, play, care, creative work, genuine connection. Continues in private with no audience or reward, and deepens as competence grows.
*Signature line:* Signature: persists in private.

**SOURCES-03 · Mimetic Desire (M)** (blue card)
*Text:* A Salience signal: what stands out as valuable in the surroundings. What other people visibly want is the most familiar case, but anything that stands out in the environment registers the same way. Prone to rivalry when people converge on the same targets.
*Signature line:* Signature: interest evaporates once novelty is worn off.

### The framework chapter cards (home, Theory and About pages)

**CORE-01 · Paragraph above the cards**
The framework itself is Chapter 4 and Appendix A, taken together. Chapter 4 states the axioms and the architecture. Appendix A is the mathematics of that system. The rest of the treatise explains what the framework is and how it plays out.

**CORE-02 · Card 1** (goes to Chapter 4)
*Label:* Chapter 4
*Title:* The Axiomatic and Architectural Foundation of AIM
*Text:* States the axioms and the architecture.
*Link:* Read →

**CORE-03 · Card 2** (goes to Appendix A)
*Label:* Appendix A
*Title:* The Mathematical Structure of the AIM System
*Text:* The mathematics of that same system.
*Link:* Read →

### The Two-Question Diagnostic (home page)

**TQD-01 · Prompt**
Name something you want right now

**TQD-02 · Placeholder in the box**
a promotion, a bigger house, to learn the cello

**TQD-03 · Button**
Start

**TQD-04 · Privacy line**
Nothing you type here is sent anywhere until you choose to ask the AI.

**TQD-05 · Question label format**
Question 1 · A-Test / Question 2 · I-Test

**TQD-06 · Question 1** ("{thing}" is what the visitor typed, or "this" if they left it blank)
Would you still need {thing} if your survival were secure?

**TQD-07 · Question 1 hint**
Tests whether the want is addressing a real deficit of the body or basic security.

**TQD-08 · Question 2**
Would you still want {thing} if no one could ever see you having or doing it?

**TQD-09 · Question 2 hint** (Treatise text)
Tests whether the desire persists without social observation.

**TQD-10 · Answer buttons**
Yes / No

**TQD-11 · Result: Appetite** (shown if Question 1 is Yes)
*Small label:* Result
*Heading:* An Appetite is present
*Text:* This want is addressing a real need of the body or basic security. Expect it to subside once the need is met and to return when it recurs.
*Question sent to the chat:* I used the Two-Question Diagnostic on "{thing}" and it looks Appetite-led. What does the AIM Framework say about how Appetites behave, and could Mimetic Desire still be inflating how much of this I think I need?

**TQD-12 · Result: Intrinsic Motivation** (shown if Question 1 is No and Question 2 is Yes)
*Heading:* Intrinsic Motivation is present
*Text:* You would still want this with no audience. Expect it to deepen rather than finish. The tools it needs will satiate; the engagement itself will not.
*Question sent to the chat:* I used the Two-Question Diagnostic on "{thing}" and it looks Intrinsically motivated. How can I protect that from being crowded out, and how would I notice if a Mimetic Premium was creeping in?

**TQD-13 · Result: Mimetic Desire** (shown if both answers are No) (Treatise text)
*Heading:* M is likely the primary driver
*Text:* If both tests fail, the desire is not bodily-need-driven and would not persist in private, M is identified by exclusion. M is the Salience signal. The Mimetic contribution arrives in the form of the very thing an introspective test would be looking for, a felt lack, and introspection asked to distinguish a Salience reading from a deficit is asked to read a distinction the integrated Scalar does not carry.
*Question sent to the chat:* I used the Two-Question Diagnostic on "{thing}" and it came out as Mimetic Desire by elimination. What does the AIM Framework say I should do with that, given Source Opacity and the Knowledge Patch?

**TQD-14 · Below every result**
*Buttons:* Ask the AI about this · Try another
*Small print:* The diagnostic is eliminative and reads behaviour, not introspection. Your own report is least reliable exactly where a confabulation is operating, which is why the Treatise pairs it with Behavioural Signatures read by others.

### The Decision Hub diagram (home page and Theory page)

**DIAGRAM-01 · Boxes, top row**
- Body Manager (A)
- Thinker (I)
- Observer (M)

**DIAGRAM-02 · Other boxes**
- Sensory input
- Hypothesis Space
- Belief Register
- Fast protective reflexes / spinal / brainstem / collicular / presupposed, not modelled
- Memory Store
- Decision Hub / integrate A, I, M → Scalar V / tag-strip: Source Opacity / holds cached habit store
- Action
- Behaviour without action / disengagement, interception

**DIAGRAM-03 · Arrow labels**
- interoceptive
- resolved over
- constitutes
- conditions Salience (top-down, not from the Decision Hub)
- deliberative timescale only
- perceptual + social (preconscious)
- reafference
- A: deficit
- V (tag-stripped)
- I: evaluative
- writes
- M: Salience (preconscious)
- selected action
- disengagement or interception

**DIAGRAM-04 · Description read aloud by screen readers**
Decision Hub diagram. Body Manager, Thinker, and Observer are aligned across the top and feed one Decision Hub. Every other part connects to those same nodes.

**DIAGRAM-05 · Enlarge controls**
- Click to enlarge
- The whole diagram is fitted to the screen.
- Smaller · Fit · Larger · Close

### The Integration Equation box (Theory page, Part 2)

**EQ-01 · Heading**
The Integration Equation

**EQ-02 · Text above the equation**
All three sources combine in the brain's common-currency valuation system to create a unified motivational signal:

*(Equation: U(x) = w_A · U_A(x) + w_I · U_I(x) + w_M · U_M(x))*

**EQ-03 · Key**
**Where:**
- w_A, w_I, w_M: weights that sum to 1, for how much each source influences this choice right now
- U_A: utility from appetite satisfaction (cyclical, terminally satisfiable)
- U_I: utility from intrinsic engagement (persistent, autonomous)
- U_M: utility from mimetic desire (amplified by social visibility)

### The Mimetic Premium box (Theory page, Part 5)

**PREMIUM-01 · Heading**
Price Decomposition and the Mimetic Premium (P_M)

**PREMIUM-02 · Text**
Any price separates into three parts: what the object would cost bought purely to correct a deficit, the extra for quality sufficient to support genuine engagement, and the residual paid for what owning it signals.

**PREMIUM-03 · Example**
Example: a $5 bottle of water
- A-Functional Price: about $0.50 for hydration
- I-Adequate Price: close to nothing; there is no process to support
- Mimetic Premium: the remaining $4.50, paid for the brand and the bottle being seen

**PREMIUM-04 · Small print**
The premium is not set by any one model; it is the internalised network average of a reference group's valuations, each of which its holder experiences as their own.

---

## 12. Text read only by search engines (structured data)

Google and other search engines read this to understand who you are and what the site is. It can appear in knowledge panels and rich results, but visitors never see it on the page. It is the oldest copy on the site and no longer matches the rest (for example, it still describes the neural pathways and "Code Drift" framing that the pages have moved away from).

**SCHEMA-01 · The AIM Framework (description)**
A taxonomic synthesis integrating neuroscience, behavioral economics, and legal systems analysis to resolve definitional inconsistencies in motivation science through three neurologically distinct sources.

**SCHEMA-02 · Alternate name**
Appetites-Intrinsic-Mimetic Framework

**SCHEMA-03 · Appetites (A)**
Cyclical biological drives arising from homeostatic deficits, mediated through hypothalamus → orbitofrontal cortex → ventral striatum pathways. Characterized by terminal satisfiability and predictable recovery cycles.

**SCHEMA-04 · Intrinsic Motivation (I)**
Persistent engagement in activities valued for their own sake, not terminally satisfiable. Mediated through VTA dopamine → hippocampus → prefrontal cortex pathways. Aligns with Self-Determination Theory's autonomy, competence, and relatedness needs.

**SCHEMA-05 · Mimetic Desire (M)**
Socially transmitted wanting arising from observation of others' goal-directed actions. Mediated through mirror neuron systems (parietal/premotor cortex) → ventral striatum. Amplifies with model status and social visibility, building on Girardian mimetic theory.

**SCHEMA-06 · Yule Guttenbeil (job title)**
Principal Commercial Lawyer & Behavioral Systems Architect

**SCHEMA-07 · Yule Guttenbeil (description)**
Creator of the AIM Framework. Specializes in definitional systems architecture and cross-disciplinary synthesis in behavioral sciences.

**SCHEMA-08 · Yule Guttenbeil (knows about)**
Commercial Law, Contract Systems, Behavioral Economics, Motivational Taxonomy, Neuroscience Synthesis, Systems Architecture

**SCHEMA-09 · Website (description)**
Research platform for the AIM Framework: a taxonomic synthesis resolving definitional inconsistencies across neuroscience, behavioral economics, and psychology.

**SCHEMA-10 · The book (title, alternate title, description)**
*Title:* A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and Mimetic Desire (AIM)
*Alternate title:* The AIM Framework Book
*Description:* A comprehensive theoretical synthesis integrating neuroscience, behavioral economics, Self-Determination Theory, and Girardian mimetic theory to resolve definitional inconsistencies (Code Drift) in motivation science through three neurologically distinct sources.

**SCHEMA-11 · The book (listed part)**
*Name:* Chapter 2: General Theory of Motivation
*Description:* Defines the core constructs, axioms, theorems, and glossary of the AIM Framework.

**SCHEMA-12 · Keywords** (site-wide)
AIM Framework, motivational taxonomy, theoretical synthesis, behavioral economics, definitional framework, systems architecture, neuroscience integration, intrinsic motivation, mimetic desire, heuristic utility model, Code Drift, Self-Determination Theory, Girardian theory, construct validity, falsifiable predictions

---

## 13. Things I noticed while compiling this

These are pointers, not edits. Nothing has been changed on the site.

- **Spelling is mixed.** Most pages use Australian/British spelling (behaviour, organisation), but the Contact page, the /diagnostic page, the site-wide search descriptions (SITE-03 to SITE-06) and the structured data use American spelling (behavior, organization, signaling). Dates on articles are also shown in American order (October 21, 2026).
- **"Seven short sections."** HOME-29, THEORY-SEO-02, THEORY-SEO-03 and 404-05 say the Theory page has seven sections; it has eight parts.
- **"We" and "I".** The About page speaks as "I"; the Contact page speaks as "we" and refers to Yule in the third person (CONTACT-10).
- **Contact page tone.** CONTACT-14 to CONTACT-19 make the strongest claims on the site ("Revolutionary", "first time in history", "no existing theory can make"), which sit awkwardly beside the footer and the About page's "awaiting peer-reviewed validation".
- **Likely typos on the About page.** "tightly boundered" (ABOUT-12, probably "tightly bounded"), "memetic noise" (ABOUT-12, probably "mimetic"), "neuro-scientist", and a sentence fragment ("Though I have read broadly across those fields.").
- **Grammar in SOURCES-03.** "interest evaporates once novelty is worn off" (probably "has worn off").
- **Two different diagnostics.** The orphaned /diagnostic page (section 9) is a three-scenario multiple-choice quiz that contradicts the framework's own point that introspection cannot read the source. The Two-Question Diagnostic on the home page replaced it.
- **Old framing still in search results.** SITE-03 to SITE-06 and all of section 12 still lead with "taxonomic synthesis" and "Code Drift", which is what Google and social previews show for most pages.
- **Footer credit.** FOOT-04 ("built with Next.js and Supabase") is a leftover from the chat template the site was built on.
- **Service-unavailable page.** DOWN-02 says authentication "is currently being configured", which is no longer true; the page only appears if sign-in breaks.
