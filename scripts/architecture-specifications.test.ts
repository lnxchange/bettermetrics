import { ArchitectureSpecifications } from '../lib/architecture-specifications'
import { GlossaryProse } from '../lib/glossary-prose'
import { GlossaryText } from '../lib/glossary-text'
import { buildCorpusIndex } from '../lib/treatise-citations'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const chapter = `
## 4.3 The Minimal Architecture

Introductory prose.

### 4.3.1 The Body Manager

The opening sentence.

**Function-only specification.** The Body Manager is the component whose primary function is homeostatic deficit signalling and deficit-repair termination. The Body Manager produces valuation signals scaled to the deficit states of the body or body-analogous system it monitors, and terminates those signals on consumption or repair.

A later paragraph in the same section is not the specification.

### 4.3.2 The Thinker

**Function-only specification.** The Thinker is the component whose two architecturally inseparable primary functions are, first, continuous maintenance of the priors, and, second, Ground-Resolution.

#### 4.3.2.1 How the Order of Experience Shapes the Thinker

**Function-only specification.** This child section is not the Thinker specification.

### 4.3.3 The Observer

**Function-only specification.** The Observer is the component whose primary function is continuous conditional Salience assessment over the perceived Object field, conditioned on priors maintained by the Thinker. The reading is locative as well as scalar (it says where each Object sits as well as how much it matters). That is what produces the error modes (Section 4.5.1).

#### 4.3.3.2 Observer Quiescence and Thinker Privacy

**Function-only specification.** The Thinker's ground-resolution function, specified in 4.3.2, presupposes a prior generative step.

### 4.3.4 The Decision Hub

**Function-only specification.** The Decision Hub is the component whose primary function is action-selection. The Decision Hub receives valuation inputs from the other three components, integrates them into a single Common-Currency Scalar, and emits a selected action for execution. The Decision Hub also returns the integrated Scalar to the Thinker as the feedback signal on which Bayesian ground-resolution operates. An unselected claim is held as a prior (Chapter 14, Section 14.2.3). Action-selection is single-channel: the Decision Hub emits one selected action at a time. The Decision Hub is therefore the bottleneck (Section 4.1).

### 4.3.6 The Belief Register

**Function-only specification.** The Belief Register ($b_t$ in Appendix A.5.6) is the architectural form in which the Thinker's current posteriors and Salience-conditioning templates are made available for downstream access at timescales shorter than the Thinker's deliberative cycle permits. The Belief Register is the architecture's state component: the persistent store over the Hypothesis Space, written only by the Thinker, read by the Observer, and computing nothing. The Belief Register is not a fifth processing component, and the minimality of the specification is a claim about the components that compute, which remain four.

### 4.3.7 The Thinker's Default Priors

**Function-only specification.** This section is not the Belief Register.
`

const body = ArchitectureSpecifications.of(chapter, '4.3.1')
assert(
  body.endsWith('terminates those signals on consumption or repair.'),
  'the Body Manager specification is the whole paragraph'
)
assert(
  !body.includes('later paragraph'),
  'prose after the specification stays out of it'
)

const thinker = ArchitectureSpecifications.of(chapter, '4.3.2')
assert(
  thinker.includes('Ground-Resolution') && !thinker.includes('child section'),
  'a child section does not replace the Thinker specification'
)

const observer = ArchitectureSpecifications.of(chapter, '4.3.3')
assert(
  observer.includes('locative as well as scalar') &&
    !observer.includes('generative step'),
  'the Observer specification keeps the locative sentence and not the later section'
)

const hub = ArchitectureSpecifications.of(chapter, '4.3.4')
assert(
  hub.includes('returns the integrated Scalar to the Thinker') &&
    hub.includes('single-channel'),
  'the Decision Hub specification is not cut after the first two sentences'
)

const belief = ArchitectureSpecifications.of(chapter, '4.3.6')
assert(
  belief.includes('$b_t$') &&
    belief.includes("architecture's state component") &&
    belief.includes('not a fifth processing component') &&
    !belief.includes('not the Belief Register'),
  'the Belief Register specification keeps its mathematics and its state sentence'
)

const html = GlossaryProse.html(belief)
assert(
  html.includes('<math'),
  'the specification is set with the site maths renderer'
)
assert(!html.includes('$b_t$'), 'the TeX delimiters are not left on the page')
assert(
  html.includes('encoding="application/x-tex">b_t<'),
  'the Belief Register symbol is b sub t'
)
assert(
  GlossaryText.prose(belief).includes('b_t') &&
    !GlossaryText.prose(belief).includes('$'),
  'structured data reads the symbol without TeX delimiters'
)

let missing = false
try {
  ArchitectureSpecifications.of(chapter, '4.3.5')
} catch (error) {
  missing = error instanceof Error && error.message.includes('4.3.5')
}
assert(missing, 'a section with no specification is refused')

let blank = false
try {
  ArchitectureSpecifications.of(
    '### 4.3.1 The Body Manager\n\n**Function-only specification.**\n',
    '4.3.1'
  )
} catch (error) {
  blank = error instanceof Error && error.message.includes('no function-only')
}
assert(blank, 'a label with no specification is refused')

const book = buildCorpusIndex([
  {
    slug: '4',
    markdown: '## 4.1 A Specified Architecture\n\n## 4.5.1 Source Opacity\n\n'
  },
  {
    slug: '14',
    markdown: '## 14.2.3 The Chain of Objects and What Can Be Afforded\n\n'
  },
  {
    slug: 'appendix-a',
    markdown: '## A.5.6 The Fast-to-Slow Coupling\n\n'
  }
])

const linkedHub = ArchitectureSpecifications.cited(hub, book)
assert(
  linkedHub.includes(
    '[Chapter 14, Section 14.2.3](/treatise/chapter-14#14.2.3)'
  ) && linkedHub.includes('[Section 4.1](/treatise/chapter-4#4.1)'),
  'Decision Hub references link to the published headings'
)
assert(
  ArchitectureSpecifications.unresolved(hub, book).length === 0,
  'both Decision Hub references resolve'
)

const linkedObserver = ArchitectureSpecifications.cited(observer, book)
assert(
  linkedObserver.includes('[Section 4.5.1](/treatise/chapter-4#4.5.1)'),
  'the Observer reference links to Section 4.5.1'
)

const linkedBelief = ArchitectureSpecifications.cited(belief, book)
assert(
  linkedBelief.includes('$b_t$') &&
    linkedBelief.includes('[Appendix A.5.6](/treatise/appendix-a#a.5.6)'),
  'the Belief Register symbol stays TeX beside its appendix link'
)
const beliefHtml = GlossaryProse.html(linkedBelief)
assert(
  beliefHtml.includes('<math') && !beliefHtml.includes('$b_t$'),
  'a citation link does not stop the maths renderer'
)
assert(
  beliefHtml.includes('href="/treatise/appendix-a#a.5.6"'),
  'the appendix link survives the prose renderer'
)

const hubHtml = GlossaryProse.html(linkedHub)
assert(
  hubHtml.includes('href="/treatise/chapter-14#14.2.3"') &&
    hubHtml.includes('href="/treatise/chapter-4#4.1"'),
  'the Decision Hub links survive the prose renderer'
)
assert(
  !GlossaryText.prose(linkedHub).includes('/treatise/') &&
    GlossaryText.prose(linkedBelief).includes('b_t') &&
    !GlossaryText.prose(linkedBelief).includes('$'),
  'structured data keeps the words and the symbol, without the link addresses'
)

const mixed = 'See Section 9.9.9 and Section 4.1.'
const linkedMixed = ArchitectureSpecifications.cited(mixed, book)
assert(
  linkedMixed.includes('Section 9.9.9') &&
    !linkedMixed.includes('9.9.9]') &&
    linkedMixed.includes('[Section 4.1](/treatise/chapter-4#4.1)'),
  'a reference with no heading stays plain text'
)
const unresolved = ArchitectureSpecifications.unresolved(mixed, book)
assert(
  unresolved.length === 1 && unresolved[0].text === 'Section 9.9.9',
  'the unresolved reference is reported'
)

console.log('architecture specification tests passed')
