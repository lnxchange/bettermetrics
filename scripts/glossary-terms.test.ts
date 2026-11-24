import { findGlossarySpans } from '../lib/glossary-terms'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const terms = [
  { term: 'Decision Hub', slug: 'decision-hub' },
  { term: 'Decision', slug: 'decision' },
  { term: 'I', slug: 'i' },
  { term: 'Mimetic Desire', slug: 'mimetic-desire' }
]

const text =
  'The Decision Hub holds a Decision. I still read, and Mimetic Desire persists. DecisionHub is untouched.'
const spans = findGlossarySpans(text, terms)
const found = spans.map(span => span.text)

assert(found.includes('Decision Hub'), 'longest heading is matched')
assert(
  found.filter(item => item === 'Decision').length === 1,
  'the shorter heading matches on its own'
)
assert(!found.includes('I'), 'a one-letter heading is not marked')
assert(found.includes('Mimetic Desire'), 'a second capitalised term is matched')
assert(
  !text.slice(spans[spans.length - 1]?.end).includes('DecisionHub') ||
    !found.some(item => item === 'DecisionHub'),
  'a term inside a longer word is left alone'
)
assert(
  !spans.some(
    span =>
      span.text === 'Decision' &&
      text.slice(span.start, span.start + 12) === 'Decision Hub'
  ),
  'Decision is not taken out of Decision Hub'
)

const aliased = [
  { term: 'Mimetic Desire (M)', slug: 'mimetic-desire-m' },
  { term: 'Appetites (A)', slug: 'appetites-a' },
  { term: 'Intrinsic Motivation (I)', slug: 'intrinsic-motivation-i' },
  {
    term: 'Common-Currency Scalar (the Scalar)',
    slug: 'common-currency-scalar-the-scalar'
  },
  { term: 'Scalar', slug: 'bare-scalar' },
  { term: 'Quantum Epistemology (QE)', slug: 'quantum-epistemology-qe' },
  { term: 'Mimetic Premium (PM, the Premium)', slug: 'mimetic-premium' },
  {
    term: 'Mimetic Premium Asymmetry Principle',
    slug: 'mimetic-premium-asymmetry-principle'
  },
  { term: 'Axiom 8 - Bayesian Belief Dynamics', slug: 'axiom-8' },
  { term: 'GDPA, GDPI, GDPM', slug: 'gdpa' },
  { term: 'I', slug: 'i' },
  { term: 'A', slug: 'a' }
]
const aliasText = [
  'Mimetic Desire shapes Appetites.',
  'Intrinsic Motivation holds. A capital I and A stay plain.',
  'The Common-Currency Scalar, also called the Scalar, is the decision variable.',
  'Quantum Epistemology leaves QE alone.',
  'Mimetic Desire (M) is the headword.',
  'Mimetic Premium Asymmetry Principle covers Mimetic Premium.',
  'Bayesian Belief Dynamics and GDPI follow.'
].join(' ')
const aliasSpans = findGlossarySpans(aliasText, aliased)
const aliasOf = (label: string) => aliasSpans.find(span => span.text === label)

assert(
  aliasOf('Mimetic Desire')?.slug === 'mimetic-desire-m',
  'the parenthetical stem links to the glossary entry'
)
assert(
  aliasOf('Appetites')?.slug === 'appetites-a',
  'Appetites links from its stem'
)
assert(
  aliasOf('Intrinsic Motivation')?.slug === 'intrinsic-motivation-i',
  'Intrinsic Motivation links from its stem'
)
assert(
  !aliasSpans.some(
    span => span.text === 'I' || span.text === 'A' || span.text === 'M'
  ),
  'a single-letter form is not linked'
)
assert(
  aliasOf('the Scalar')?.slug === 'common-currency-scalar-the-scalar',
  'an inner alias of 3 or more characters links to the entry'
)
assert(
  aliasOf('Common-Currency Scalar')?.slug ===
    'common-currency-scalar-the-scalar',
  'the stem of the scalar links to the entry'
)
assert(
  !aliasSpans.some(span => span.text === 'Scalar'),
  'a shorter term does not win inside a longer one'
)
assert(
  aliasOf('Quantum Epistemology')?.slug === 'quantum-epistemology-qe',
  'a stem still links when its inner alias is too short'
)
assert(
  !aliasSpans.some(span => span.text === 'QE'),
  'a two-letter inner alias is not linked'
)
assert(
  aliasOf('Mimetic Desire (M)')?.slug === 'mimetic-desire-m',
  'the full headword wins over its stem'
)
assert(
  aliasOf('Mimetic Premium Asymmetry Principle')?.slug ===
    'mimetic-premium-asymmetry-principle',
  'the longest overlapping headword wins'
)
assert(
  aliasOf('Mimetic Premium')?.slug === 'mimetic-premium',
  'the shorter headword still matches on its own'
)
assert(
  aliasOf('Bayesian Belief Dynamics')?.slug === 'axiom-8',
  'an axiom title links without its number'
)
assert(
  aliasOf('GDPI')?.slug === 'gdpa',
  'a comma-separated alias links to the entry'
)

const premiseSpans = findGlossarySpans(
  'The Construction Premises hold, and one Construction Premise does too.',
  [{ term: 'Construction Premise', slug: 'construction-premise' }]
)
assert(
  premiseSpans.some(
    span =>
      span.text === 'Construction Premises' &&
      span.slug === 'construction-premise'
  ),
  'Construction Premises matches the Construction Premise entry'
)
assert(
  premiseSpans.filter(span => span.text === 'Construction Premise').length ===
    1,
  'the singular Construction Premise still matches on its own'
)
assert(
  findGlossarySpans('The premises stay plain.', [
    { term: 'Construction Premise', slug: 'construction-premise' }
  ]).length === 0,
  'a bare premises is not the Construction Premise plural'
)

const scalarTerms = [
  {
    term: 'Common-Currency Scalar (the Scalar)',
    slug: 'common-currency-scalar-the-scalar'
  }
]
const scalarSpans = findGlossarySpans(
  'The Scalar resolves. the Scalar holds. A bare Scalar returns.',
  scalarTerms
)
const scalarText = (label: string) =>
  scalarSpans.filter(span => span.text === label)
assert(
  scalarText('The Scalar').length === 1 &&
    scalarText('The Scalar')[0].slug === 'common-currency-scalar-the-scalar',
  'a sentence-initial the Scalar keeps its capital'
)
assert(
  scalarText('the Scalar').length === 1,
  'the lowercase alias still matches'
)
assert(
  scalarText('Scalar').length === 1,
  'Scalar matches once, and not inside The Scalar'
)

const moneyTerms = [
  { term: 'Claim', slug: 'claim' },
  { term: 'Debt', slug: 'debt' },
  { term: 'Interest', slug: 'interest' },
  { term: 'Claimed Self-Defence', slug: 'claimed-self-defence' },
  { term: 'Interest-Only Threshold', slug: 'interest-only-threshold' },
  { term: 'Debt to Society', slug: 'debt-to-society' },
  { term: 'Forced Participation', slug: 'forced-participation' },
  { term: 'Mimetic Lock-In', slug: 'mimetic-lock-in' },
  { term: 'Aggregation Confabulation', slug: 'aggregation-confabulation' }
]
const moneyText = [
  'A Claim rests on two Beliefs. claim stays a common word.',
  'Interest is the premium. An interest payment stays plain.',
  'Debt names the obligation. debt in passing stays plain.',
  'Claimed Self-Defence keeps its own entry.',
  'Interest-Only Threshold keeps its own entry.',
  'Debt to Society keeps its own entry.',
  'Forced Participation and Mimetic Lock-In and Aggregation Confabulation are defined.'
].join(' ')
const moneySpans = findGlossarySpans(moneyText, moneyTerms)
const moneySlug = (label: string) => moneySpans.find(span => span.text === label)?.slug
assert(moneySlug('Claim') === 'claim', 'capitalised Claim links to Claim')
assert(
  !moneySpans.some(span => span.text.toLowerCase() === 'claim' && span.text !== 'Claim'),
  'a lowercase claim is not linked'
)
assert(moneySlug('Interest') === 'interest', 'capitalised Interest links to Interest')
assert(
  !moneySpans.some(span => span.text === 'interest'),
  'a lowercase interest is not linked'
)
assert(moneySlug('Debt') === 'debt', 'capitalised Debt links to Debt')
assert(
  moneySlug('Claimed Self-Defence') === 'claimed-self-defence',
  'Claimed Self-Defence keeps its own entry'
)
assert(
  moneySlug('Interest-Only Threshold') === 'interest-only-threshold',
  'Interest-Only Threshold keeps its own entry'
)
assert(
  moneySlug('Debt to Society') === 'debt-to-society',
  'Debt to Society keeps its own entry'
)
assert(
  !moneySpans.some(
    span =>
      span.text === 'Claim' &&
      moneyText.slice(span.start, span.start + 'Claimed'.length) === 'Claimed'
  ),
  'Claim is not taken out of Claimed Self-Defence'
)

console.log('glossary terms ok', found.join(', '))
