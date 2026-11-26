import { GlossarySearch } from '../lib/glossary-search'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const highObservability = {
  slug: 'high-observability-goods',
  term: 'High-Observability Goods',
  definition:
    'High-Observability Goods are goods, services, and assets whose value is materially affected by being seen, known about, or comparable to others’ holdings, including ownership claims in High-Observability Sectors themselves, where the payoff is disproportionately Mimetic because control or association with the sector functions as a status signal over and above any cashflow or functional utility, and classical positional goods as standard economics already recognises.',
  explanation:
    'High-Observability Goods matter in AIM not because of their intrinsic properties, but because their value is tightly coupled to being seen, tracked, and compared in social space. Classical positional goods / Veblen goods fit this pattern because their main payoff is relative status (owning a rare bag, a trophy house, or a prestige degree) shifts perceived status more than it changes appetitive sufficiency or intrinsic opportunity. Ownership claims in High-Observability Sectors extend the same logic to assets: a publicly known stake in a flagship platform, league franchise, or iconic media property functions as a standing broadcast of social status, so the Mimetic premium embedded in the price reflects the reputational and narrative control it confers, over and above any ordinary return on investment the asset delivers.',
  derivation: 'Chapter 8, Section 8.8.3.'
}

const money = {
  slug: 'money',
  term: 'Money',
  definition:
    'Money is the external instantiation of the Common-Currency Scalar: the capacity to discharge a later deficit, which exchange leaves in the hands of another party who releases an Object to correct the first party’s deficit, and which can be held across time and passed between Individuals. Every exchangeable Object carries this capacity to some degree (Saleability), and Saleability is set by the acceptances of a particular population; Money is the substrate at the top of that gradient within a population, and no line separates it from the goods it is exchanged for. Where two populations have converged on different substrates, each holds its own Money and holds the other’s as a good, and an exchange rate is the price of one population’s Money in the other’s. Its function is fixed by the architecture and its substrate is free to vary: shells, coin, ledger entries and signatures are substrates of one function, and barter is the same function discharged through a substrate that discharges it poorly. Money’s proper purpose is bounded, since it is wanted up to the level that secures the Appetitive floor and equips the Intrinsic process. It is an Object constituted not by any Appetitive or Intrinsic use of its own but by convertibility into such use, which makes it the ideal host for Mimetic Desire under Object Parasitism; M attached to it converts Money into a generic Veblen good, wanted for the standing it signals rather than for what it converts into. Because the Scalar is tag-stripped before it leaves the body, Money carries no record of the sources whose demand it discharges, and the divergent accounts cultures give of what Money is are Confabulation at the scale of a population.',
  explanation:
    'Inside the brain, every want is turned into one value so that different wants can be compared. Money is that value once it leaves the body. When you cannot get what you need yourself and someone else holds it, you need a way of handing over the value of your want, and Money is that way. Every society that trades finds one, in whatever material is to hand, which is why Money looks like an invention made many times over when it is the same function appearing wherever people exchange.',
  derivation: 'Chapter 14, Section 14.2.'
}

const easterlin = {
  slug: 'easterlin-paradox',
  term: 'Easterlin Paradox',
  definition:
    'The Easterlin Paradox is the empirical observation that within countries richer people report higher life satisfaction than poorer people, while across countries and across time rising GDP does not correlate with rising average life satisfaction.',
  explanation: 'Richard Easterlin’s 1974 finding created a puzzle for economics.',
  derivation: 'Chapter 5, Section 5.6.4 ; Chapter 8, Section 8.5.3.'
}

const plateau = {
  slug: 'easterlin-plateau',
  term: 'Easterlin Plateau',
  definition: 'The Easterlin Plateau is the flattening of the income-satisfaction curve beyond a threshold.',
  explanation: '',
  derivation: 'Chapter 5, Section 5.6.4.'
}

const citation = {
  slug: 'epistemic-status-guide',
  term: 'Epistemic Status Guide',
  definition: 'Labels used in this chapter.',
  explanation:
    'Veblen, T. (1899). The Theory of the Leisure Class. Macmillan. Veblen’s foundational analysis of pecuniary emulation and conspicuous consumption argues that pecuniary emulation is comparative.',
  derivation: null
}

const confabulation = {
  slug: 'a-default-confabulation-principle',
  term: 'A-Default Confabulation Principle',
  definition: 'The mind completes the available vocabulary by selecting the most physiologically legible source.',
  explanation:
    'Engel’s Law, Veblen’s account of conspicuous consumption, and the Maslow hierarchy’s economic borrowings are the three principal sites at which the study of exchange registers that need does not exhaust it.',
  derivation: 'Chapter 4, Section 4.5.2.'
}

const positional = {
  slug: 'positional-goods-aim-integration',
  term: 'Positional Goods (AIM Integration)',
  definition:
    'Positional Goods are the population-scale aggregate of Positional Objects, market-transacted Objects whose value depends primarily on relative scarcity.',
  explanation: 'Positional goods is the economist’s name for luxury brands, trophy houses, and prestige degrees.',
  derivation: 'Chapter 8, Section 8.8.4 ; Chapter 8, Section 8.12.4.'
}

const docs = [highObservability, money, easterlin, plateau, citation, confabulation, positional]

function described(query: string) {
  return GlossarySearch.matches(docs, query, { namedLimit: 5, focusLimit: 3 })
    .map(hit => `${hit.tier}:${hit.score.toFixed(3)}:${hit.document.term}`)
    .join(' | ')
}

const veblen = described('Veblen goods')
assert(
  veblen.startsWith('2:') && veblen.includes('High-Observability Goods'),
  `Veblen goods should open on the entry that is about them: ${veblen}`
)
assert(!veblen.includes('Money'), `a late clause in Money is not the entry: ${veblen}`)
assert(!veblen.includes('Epistemic Status Guide'), `a bibliography citation is not the entry: ${veblen}`)
assert(!veblen.includes('A-Default'), `Veblen’s account is the author, not the good: ${veblen}`)

const defined = GlossarySearch.matches(
  [
    ...docs,
    {
      term: 'Veblen good',
      definition:
        'A Veblen good is an object wanted more as its price rises, because the price is what makes it a marker of standing.',
      explanation: 'Lower the price and it stops sorting people by rank.',
      derivation: 'Chapter 8, Section 8.8.3.'
    }
  ],
  'Veblen goods',
  { focusLimit: 3 }
)
assert(defined[0]?.document.term === 'Veblen good' && defined[0].tier === 0, 'the defined term outranks an entry that only discusses it')
assert(
  defined.some(hit => hit.document.term === 'High-Observability Goods'),
  'the entry concentrated on Veblen goods stays available behind the defined term'
)

const questionHits = GlossarySearch.matches(
  docs,
  'How does the AIM Framework explain the Easterlin Paradox and Veblen goods?',
  { focusLimit: 3 }
)
const question = questionHits.map(hit => `${hit.tier}:${hit.score.toFixed(3)}:${hit.document.term}`).join(' | ')
assert(question.includes('1:') && question.includes('Easterlin Paradox'), `the named term is included: ${question}`)
assert(question.includes('High-Observability Goods'), `the Veblen phrase still brings its entry: ${question}`)
assert(
  question.indexOf('Easterlin Paradox') < question.indexOf('High-Observability Goods'),
  'the named term comes before the concentrated entry'
)
const focused = questionHits.filter(hit => hit.tier === 2)
assert(
  focused[0]?.document.term === 'High-Observability Goods',
  `the phrase match leads the concentrated entries: ${question}`
)

const byPrefix = described('easterlin')
assert(byPrefix.includes('Easterlin Paradox') && byPrefix.includes('Easterlin Plateau'), `both Easterlin headwords lead: ${byPrefix}`)
assert(byPrefix.startsWith('1:'), `a headword prefix outranks a mention: ${byPrefix}`)

const positionalHit = described('positional goods')
assert(positionalHit.startsWith('0:') && positionalHit.includes('Positional Goods'), `the parenthetical headword is the term: ${positionalHit}`)

const singular = described('positional good')
assert(singular.startsWith('0:') && singular.includes('Positional Goods'), `the singular still finds the defined term: ${singular}`)

const surname = described('Veblen')
assert(
  surname.includes('High-Observability Goods') && !surname.includes('Epistemic Status Guide'),
  `the surname still finds the entry about the good, not the citation: ${surname}`
)

const preview = GlossarySearch.preview(highObservability, 'Veblen goods', 2)
assert(
  preview.startsWith('Classical positional goods / Veblen goods'),
  'the row starts at the sentence about the query, not mid-word'
)
assert(preview.includes('Derivation: Chapter 8, Section 8.8.3.'), 'the row shows the derivation line')

const definitionPreview = GlossarySearch.preview(easterlin, 'Easterlin Paradox', 0)
assert(definitionPreview.startsWith('The Easterlin Paradox is'), 'a defined term shows its own definition')
assert(definitionPreview.includes('Derivation: Chapter 5, Section 5.6.4'), 'a defined term shows its derivation line')

console.log('glossary search tests passed')
