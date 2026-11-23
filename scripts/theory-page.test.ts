import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function source(path: string) {
  return readFileSync(path, 'utf8')
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

const page = source('app/theory/page.tsx')
const definitions = source('components/aim-definitions.tsx')
const framework = source('components/framework-core.tsx')
const diagram = source('components/decision-hub-diagram.tsx')

const required = [
  'The AIM theory of motivation says wanting comes from three sources: Appetites, Intrinsic Motivation, and Mimetic Desire. The brain adds all three into a single feeling of wanting, and in doing so loses track of which source each want came from. Most of what the theory explains follows from that one loss: why some wants end and others never do, why people misread their own motives, and why a group under strain looks for someone to blame.',
  'The eight short parts below walk through it. The full statement is Chapter 4, which sets out the architecture, and Appendix A, which gives its mathematics.',
  'Every want the brain acts on draws on one or more of three sources. Each behaves in its own recognisable way, and one object can draw on all three at once: a meal answers hunger (A), can be a pleasure to cook and eat (I), and can signal status through what it cost (M).',
  'The brain cannot act on three signals at once. A Body Manager reports what the body lacks, a Thinker holds beliefs and pursues what is rewarding in the doing, and an Observer continuously reads which objects in the surrounding field stand out as valuable. All three feed a Decision Hub, which converts them into one value per option and selects an action. (Candidate brain systems: homeostatic signalling for the Body Manager, the dopamine system for intrinsic engagement, the mirror neuron system for the Observer, and the ventromedial prefrontal cortex and ventral striatum for the Decision Hub.)',
  'Summing three quantities into one is a many-to-one map. Whatever the sum, many combinations of A, I and M could have produced it, so nothing downstream can recover which one did. Introspection reads only the sum. That is not a failure of self-awareness; it is a mathematical property of adding things together.',
  'The cost falls hardest on Mimetic Desire. Appetites and Intrinsic Motivation each report a gap that some object would close. The Observer reports only where value sits, and carries no stopping point. Once mixed into the single value it can only be felt the way the other two are, as a lack. So getting the object closes nothing, because nothing was open. The source cannot be seen in the moment, but it can be inferred from how a want behaves over time (Part 7).',
  'The stories have a characteristic shape. The mind learns about causes in a world full of other people, whose actions are vivid and easy to see; systemic causes are slow and diffuse, and have to be worked out deliberately. So the gap is filled with an author: "I chose this because of who I am," or, when a population is in distress, "they did this to us." That is the root of scapegoating.',
  "but status exists only in how others value you, one person's gain in it is another's loss, and no one can buy how others value them.",
  'The three sources differ most in what happens after a want is met. Appetites recur: eat, and hunger ends until the body runs short again. Intrinsic Motivation deepens rather than ending: each pursuit closes when it is done, felt as accomplishment, and the interest carries on into the next. Mimetic Desire moves on: getting the object ends that want, and the Observer, still reading a field with no edge, settles on the next target. Reaching a status goal simply resets the comparison.',
  'This is why societies can reach material abundance without widespread wellbeing: surplus flows into status competition, spending rises, and welfare plateaus. It is also why a mimetic crisis, past a tipping point, flips suddenly rather than swinging back and forth: only the Mimetic channel has no brake of its own.',
  'is seven operations that work by reopening questions the mind has closed too early on a wrong answer',
  'Why does the AIM Treatise treat the part of interest above bounded cost as a Mimetic Premium?'
]

for (const phrase of required) {
  assert.equal(page.includes(phrase), true, `theory page keeps: ${phrase.slice(0, 72)}`)
}

const removed = [
  'Enough of the architecture to know what question you want to ask',
  'Each part ends with questions the chat can answer',
  'They are distinct neural systems',
  'It is worse than losing a label',
  'Causal cognition is built to track agents',
  'status is computed in other',
  'Intrinsic pursuits close',
  'generating doubt where a belief system has settled',
  'pure Mimetic Premium',
  'mimetic crises crash rather than oscillate'
]

for (const phrase of removed) {
  assert.equal(page.includes(phrase), false, `theory page drops: ${phrase}`)
}

assert.equal(
  page.includes('Source Opacity is derived from the architecture.'),
  true,
  'the Source Opacity lead stays'
)
assert.equal(
  page.includes('Confabulation is derived from the architecture.'),
  true,
  'the Confabulation lead stays'
)
assert.equal(
  page.includes('Asked why, the brain does not report'),
  true,
  'the first Confabulation paragraph stays'
)
assert.match(page, /seven operations/, 'Part 7 still says seven')
assert.equal(
  page.includes('AIM Vocabulary Acquisition') &&
    page.includes('The Normality Fiction Breaker'),
  true,
  'the seven operations stay listed'
)

const cards = [
  "The body's signals that something physical needs repair: hunger, thirst, breathlessness, cold, tiredness, pain. Urgent while the deficit lasts, quiet once it is repaired, back when the body runs short again.",
  'Signature: satiates, then recurs.',
  'What is rewarding in the doing: curiosity, mastery, play, care, creative work, connection. It carries on in private with no audience or reward, and deepens as competence grows.',
  'Signature: persists in private.',
  'A reading of what stands out as valuable in the surroundings. What other people visibly want is the most familiar case, but anything that stands out registers the same way. It records no lack, so getting the object never satisfies it.',
  'Signature: the want ends on getting the thing, and moves on.',
  'mathbf{w_A}$, $\\mathbf{w_I}$, $\\mathbf{w_M}$',
  'sum to 1, and set how much each source counts in this choice right now',
  'value from repairing a bodily deficit (ends when repaired, then recurs)',
  'value from an engagement rewarding in itself',
  'value from what the surroundings mark as valued (grows with visibility, never satisfied)',
  'Each term can pull toward an option or push away from it.',
  'The premium is not set by any one person; it is the average of what a reference group values, absorbed so thoroughly that each holder feels it as their own.'
]

for (const phrase of cards) {
  assert.equal(definitions.includes(phrase), true, `definitions keep: ${phrase.slice(0, 72)}`)
}

for (const phrase of [
  'floor of income',
  'interest evaporates once novelty is worn off',
  'terminally satisfiable',
  'not set by any one model'
]) {
  assert.equal(definitions.includes(phrase), false, `definitions drop: ${phrase}`)
}

assert.equal(
  framework.includes(
    'The framework itself is Chapter 4 and Appendix A, taken together.'
  ),
  true,
  'other pages keep the chapter-card lead'
)
assert.equal(
  diagram.includes('presupposed, not modelled') &&
    diagram.includes('reafference') &&
    diagram.includes('tag-strip: Source Opacity'),
  true,
  'the diagram labels stay'
)
