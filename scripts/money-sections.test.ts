import {
  buildCorpusIndex,
  composeRedirects,
  treatisePath
} from '../lib/treatise-citations'
import { MoneySections } from '../lib/money-sections'
import { TreatisePlacement } from '../lib/treatise-placement'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const reworked = new Set([
  '14.1',
  '14.2',
  '14.2.1',
  '14.3.1',
  '14.5.1',
  '14.6.1',
  '14.10.8'
])

const seventeen = MoneySections.arrival('12.17', reworked)
assert(
  seventeen.kind === 'move' && seventeen.id === '14.5.1',
  '12.17 lands on 14.5.1'
)
assert(
  MoneySections.arrival('14.17', reworked).kind === 'move' &&
    MoneySections.arrival('14.17', reworked).kind === 'move',
  '14.17 is a known old fragment'
)
const renumbered = MoneySections.arrival('14.17', reworked)
assert(
  renumbered.kind === 'move' && renumbered.id === '14.5.1',
  '14.17 lands on 14.5.1'
)
assert(
  renumbered.kind === 'move' && renumbered.id !== '14.17',
  '14.17 is not left as 14.17'
)

const introduction = MoneySections.arrival('14.1', reworked)
assert(introduction.kind === 'keep', 'a live 14.1 stays the introduction')

const oldIntroduction = MoneySections.arrival('12.6', reworked)
assert(
  oldIntroduction.kind === 'top',
  '12.6 has no successor and opens at the top'
)
assert(
  MoneySections.arrival('14.6', reworked).kind === 'top',
  '14.6 opens at the top when it is not a heading'
)
assert(
  MoneySections.arrival(
    '14.6',
    new Set(['14.1', '14.2', '14.2.1', '14.6', '14.10.8'])
  ).kind === 'keep',
  'the new section 14.6 stays when it is a heading'
)

const bayesian = new Set(['12.2', '12.6', '12.11'])
assert(
  MoneySections.arrival('12.2', bayesian).kind === 'keep',
  'a live 12.2 stays on its own page'
)
assert(
  MoneySections.arrival('12.6', bayesian).kind === 'keep',
  'Bayesian 12.6 is not cleared'
)
assert(
  MoneySections.arrival('12.17', bayesian).kind === 'ignore',
  '12.17 is not moved when 14.5.1 is absent'
)

const oldMoney = new Set(['12.1', '12.17', '12.39'])
assert(
  MoneySections.arrival('12.17', oldMoney).kind === 'keep',
  'the old Money text keeps 12.17'
)

const moves = composeRedirects(
  [
    {
      from_section: '12.17',
      from_slug: '12',
      to_section: null,
      to_slug: '12'
    },
    ...MoneySections.storedMoves()
  ],
  buildCorpusIndex([
    {
      slug: '12',
      markdown:
        '## 12.2 The Bayesian Framework\n\n## 12.6 The Subcriticality Threshold\n'
    },
    {
      slug: '14',
      markdown: '## 14.5.1 The Time-Bound Asymmetry of the A and I Signals\n'
    }
  ])
)
assert(moves['12.2'] === undefined, 'a live 12.2 is not redirected')
assert(
  moves['12.17']?.section === '14.5.1',
  'a removed 12.17 follows the table'
)
assert(moves['12.17']?.slug === '14', '12.17 now belongs to chapter 14')
assert(moves['12.17']?.section !== '14.17', '12.17 does not become 14.17')

const before = [
  {
    slug: '12',
    title: 'Money, Debt and the Architecture of Mimetic Extraction'
  },
  { slug: '13', title: 'Bayesian Belief Dynamics' },
  {
    slug: '14',
    title:
      'Quantum Epistemology - Why Order Effects in Cognition Call for a General Probability Theory'
  }
]
assert(
  TreatisePlacement.storedSlug('14', before) === '12',
  'chapter 14 still reads the Money row'
)
assert(
  TreatisePlacement.storedSlug('12', before) === '13',
  'chapter 12 still reads Bayesian Belief Dynamics'
)
assert(
  TreatisePlacement.storedSlug('13', before) === '14',
  'chapter 13 still reads Quantum Epistemology'
)

const presented = TreatisePlacement.present({
  slug: '12',
  title: before[0].title,
  label: 'Chapter 12',
  part: 'I' as const,
  position: 12,
  href: '/treatise/chapter-12'
})
assert(
  presented.href === '/treatise/chapter-14',
  'the Money row is addressed as chapter 14'
)
assert(presented.label === 'Chapter 14', 'the Money row is labelled Chapter 14')
assert(presented.position === 14, 'Money sorts as chapter 14')

const placed = TreatisePlacement.apply(
  buildCorpusIndex([
    {
      slug: '12',
      markdown: '## 12.2 Money Is the External Common-Currency Scalar\n'
    }
  ]),
  before
)
assert(
  treatisePath(placed.sections['12.2'].slug, '12.2') ===
    '/treatise/chapter-14#12.2',
  'a Money section link uses the public chapter'
)

const after = [
  { slug: '12', title: 'Bayesian Belief Dynamics' },
  { slug: '13', title: 'Quantum Epistemology' },
  {
    slug: '14',
    title: 'Money, Debt and the Architecture of Mimetic Extraction'
  }
]
assert(
  TreatisePlacement.storedSlug('14', after) === '14',
  'after publish, chapter 14 reads slug 14'
)
assert(
  TreatisePlacement.storedSlug('12', after) === '12',
  'after publish, chapter 12 reads slug 12'
)
assert(
  TreatisePlacement.apply(buildCorpusIndex([]), after).chapters.length === 0,
  'a matched publish does not remap an empty index'
)
const unchanged = TreatisePlacement.present({
  slug: '14',
  title: after[2].title,
  label: 'Chapter 14',
  part: 'I' as const,
  position: 14,
  href: '/treatise/chapter-14'
})
assert(
  unchanged.href === '/treatise/chapter-14',
  'a published Money row keeps its address'
)

console.log('money section tests passed')
