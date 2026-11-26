import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { MinimalArchitecture } from '../lib/architecture-data'
import { ArchitectureSpecifications } from '../lib/architecture-specifications'
import { ArchitectureFragments } from './architecture-fragments'

const require = createRequire(__filename)
const { RetiredRoutes } = require('./retired-routes') as {
  RetiredRoutes: {
    all: () => { source: string; destination: string; permanent: boolean }[]
  }
}
const nextConfig = require('../next.config.js') as {
  redirects: () => Promise<
    {
      source: string
      destination: string
      permanent: boolean
      statusCode?: number
    }[]
  >
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const required: [string, string][] = [
  ['/axioms', '/architecture'],
  [
    '/glossary/axiom-1-three-source-taxonomy',
    '/glossary/three-source-taxonomy'
  ],
  [
    '/glossary/axiom-2-common-currency-integration',
    '/glossary/common-currency-integration'
  ],
  ['/glossary/axiom-3-source-opacity', '/glossary/source-opacity'],
  ['/glossary/axiom-4-confabulation', '/glossary/confabulation'],
  [
    '/glossary/axiom-5-m-as-amplifier-the-mimetic-premium',
    '/glossary/object-parasitism'
  ],
  [
    '/glossary/axiom-5-m-as-amplifier-object-parasitism',
    '/glossary/object-parasitism'
  ],
  ['/glossary/axiom-5-object-parasitism', '/glossary/object-parasitism'],
  [
    '/glossary/axiom-6-differential-satiation-dynamics',
    '/glossary/differential-satiation-dynamics'
  ],
  [
    '/glossary/axiom-7-preconscious-transmission',
    '/glossary/preconscious-transmission'
  ],
  [
    '/glossary/axiom-8-bayesian-belief-dynamics',
    '/glossary/bayesian-belief-dynamics'
  ],
  [
    '/glossary/axiom-9-agent-based-causal-default',
    '/glossary/agent-based-causal-default'
  ],
  [
    '/glossary/agent-based-causal-default-axiom-9',
    '/glossary/agent-based-causal-default'
  ],
  [
    '/glossary/b1-b3-slow-layer-axiom-restatements',
    '/glossary/b1-b3-slow-layer-architectural-commitments'
  ],
  [
    '/glossary/fast-layer-axiom-restatements-m1-through-m5b',
    '/glossary/fast-layer-architectural-commitments-m1-through-m5b'
  ],
  [
    '/glossary/network-layer-axiom-restatements-n1-n4',
    '/glossary/network-layer-architectural-commitments-n1-n4'
  ]
]

async function main() {
  const redirects = await nextConfig.redirects()
  for (const [source, destination] of required) {
    const found = redirects.find(item => item.source === source)
    assert(!!found, `missing redirect ${source}`)
    assert(
      found?.destination === destination,
      `${source} goes to ${found?.destination}, expected ${destination}`
    )
    assert(found?.permanent === true, `${source} is not permanent`)
    assert(found?.statusCode === 301, `${source} is not a 301`)
  }
  const configured = RetiredRoutes.all()
  assert(
    configured.length === required.length,
    'the retired-route table matches the required pairs'
  )
  assert(
    new Set(configured.map(item => item.source)).size === configured.length,
    'retired sources are unique'
  )

  assert(
    ArchitectureFragments.premises === `#${MinimalArchitecture.premisesAnchor}`,
    'the fragment target is the premises heading'
  )
  assert(
    ArchitectureFragments.destination('#axiom-1') === '#construction-premises',
    '#axiom-1 lands on the premises'
  )
  assert(
    ArchitectureFragments.destination('#axiom-9') === '#construction-premises',
    '#axiom-9 lands on the premises'
  )
  assert(
    ArchitectureFragments.destination('#Axiom-3') === '#construction-premises',
    'fragment matching ignores case'
  )
  assert(
    ArchitectureFragments.destination('#axiom-list') ===
      '#construction-premises',
    'the old list id lands on the premises'
  )
  assert(
    ArchitectureFragments.destination('#how-they-fit-together') ===
      '#construction-premises',
    'the retired dependency list lands on the premises'
  )
  assert(
    ArchitectureFragments.destination('#source-opacity') === null,
    'a premise slug is left for the browser'
  )
  assert(
    ArchitectureFragments.destination('') === null,
    'an empty fragment is left alone'
  )
  assert(
    MinimalArchitecture.premises
      .filter(premise => premise.standing === 'specified by the architecture')
      .map(premise => premise.number)
      .join(',') === '1,2,6,7,8',
    'premises 1, 2, 6, 7 and 8 are specified by the architecture'
  )
  assert(
    MinimalArchitecture.premises
      .filter(premise => premise.standing === 'derived from the architecture')
      .map(premise => premise.number)
      .join(',') === '3,4,5,9',
    'premises 3, 4, 5 and 9 are derived from the architecture'
  )
  assert(
    MinimalArchitecture.premiseNine ===
      'The architecture and its formal results stand without Premise 9, whose default depends also on what fills the perceived field.',
    'premise 9 keeps the approved line'
  )
  const homepage = readFileSync('app/page.tsx', 'utf8')
  const heroSection = homepage.slice(
    0,
    homepage.indexOf('How the system works')
  )
  const heroParagraph = heroSection.match(
    /<p className="max-w-3xl text-xl text-blue-100">([\s\S]*?)<\/p>/
  )
  if (!heroParagraph) throw new Error('the homepage hero paragraph is present')
  const heroBody = heroParagraph[1]
  const heroText = heroBody
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  assert(
    heroText ===
      'The AIM Framework is a model of the system that produces wanting. Three systems in the brain each produce a signal. One tracks what the body needs (Appetites). One runs thinking and problem-solving, and rewards what is worth doing for its own sake (Intrinsic Motivation). One tracks what stands out as salient around you (Mimetic Desire). A Decision Hub merges them into a single sense of how much you want something, and acts on it.',
    "the hero uses Lex's replacement sentence"
  )
  assert(
    !heroSection.includes('four primary components') &&
      !heroSection.includes('The framework rests on'),
    'the old hero sentence is gone'
  )
  for (const [term, slug] of [
    ['Appetites', '/glossary/appetites-a'],
    ['Intrinsic Motivation', '/glossary/intrinsic-motivation-i'],
    ['Mimetic Desire', '/glossary/mimetic-desire-m'],
    ['Decision Hub', '/glossary/decision-hub']
  ] as const) {
    assert(
      heroBody.includes(`href="${slug}"`) &&
        heroBody.includes(`>${term}</Link>`),
      `the hero links ${term} to ${slug}`
    )
  }
  assert(
    !heroBody.includes('href="/architecture"'),
    'Decision Hub is not linked to /architecture'
  )
  assert(
    (heroSection.match(/href="\/architecture"/g) ?? []).length === 1 &&
      heroSection.includes('The minimal architecture'),
    'the hero area links once to /architecture, on the minimal architecture CTA'
  )
  assert(
    heroSection.includes('A Unifying General Theory of Human Motivation'),
    'the hero names the book as a unifying general theory'
  )
  const homepageText = homepage.replace(/\s+/g, ' ')
  assert(
    homepageText.includes('the dopaminergic system for the Thinker') &&
      homepageText.includes('Intrinsic Motivation, from the Thinker') &&
      !homepageText.includes('dopamine system for intrinsic engagement'),
    'the front page attaches the dopaminergic system to the Thinker'
  )
  assert(
    MinimalArchitecture.lead[0] ===
      'The AIM Framework describes the system that produces wanting as four working parts and one store of beliefs. The Body Manager reports what the body lacks. The Observer reads what stands out around you. The Thinker holds your beliefs and works out what a want is about. The Decision Hub combines all three into one value and picks an action. The Belief Register holds what the Thinker has concluded, so the Observer can use it instantly.',
    'the architecture intro is the plain paragraph'
  )
  assert(
    MinimalArchitecture.lead.length === 1,
    'the architecture intro is one paragraph'
  )
  const belief = ArchitectureSpecifications.of(
    [
      '### 4.3.6 The Belief Register',
      '',
      '**Function-only specification.** The Belief Register ($b_t$ in Appendix A.5.6) is the architectural form in which the Thinker\u2019s current posteriors are made available. The Belief Register is the architecture\u2019s state component: the persistent store over the Hypothesis Space, written only by the Thinker, read by the Observer, and computing nothing. The Belief Register is not a fifth processing component, and the minimality of the specification is a claim about the components that compute, which remain four.',
      '',
      '### 4.3.7 The Thinker\u2019s Default Priors',
      '',
      '**Function-only specification.** A later section must not be read as the Belief Register.'
    ].join('\n'),
    '4.3.6'
  )
  assert(
    belief.includes('not a fifth processing component') &&
      belief.includes('$b_t$') &&
      belief.includes('state component') &&
      !belief.includes('A later section'),
    'the Belief Register formal definition stays off the processing count and keeps its mathematics'
  )
  assert(
    !readFileSync('lib/architecture-data.ts', 'utf8').includes(
      'primary function is action-selection'
    ),
    'the architecture data does not paste a formal definition'
  )

  const prompt = readFileSync('app/api/chat/route.ts', 'utf8')
  assert(
    !prompt.includes('THE NINE AXIOMS'),
    'the inlined nine-axiom block is gone'
  )
  assert(
    !prompt.includes('nine axioms'),
    'the prompt does not tell the model to reason from nine axioms'
  )
  assert(
    prompt.includes('reason from the Minimal Architecture'),
    'the prompt reasons from the Minimal Architecture'
  )
  assert(
    prompt.includes('four primary components'),
    'the prompt names four primary components'
  )
  assert(
    prompt.includes('not a fifth processing component'),
    'the prompt keeps the Belief Register off the processing count'
  )
  for (const file of [
    'app/page.tsx',
    'app/architecture/page.tsx',
    'app/theory/page.tsx',
    'app/about/page.tsx',
    'app/api/chat/route.ts',
    'lib/architecture-data.ts',
    'components/aim-jsonld.tsx'
  ]) {
    assert(
      !readFileSync(file, 'utf8').includes('four components'),
      `${file} does not say four components`
    )
  }
  assert(
    prompt.includes('CONSTRUCTION PREMISES'),
    'the prompt names the Construction Premises'
  )
  assert(
    prompt.includes('Never call them axioms'),
    'derived results are not to be called axioms'
  )
  assert(
    prompt.includes('Section 4.3.1'),
    'the Body Manager keeps its current section'
  )
  assert(
    prompt.includes('Section 4.3.7'),
    'Premise 9 is derived at the current section'
  )
  assert(
    !prompt.includes('Section 4.4):**'),
    'the stale architecture header is gone'
  )

  console.log('retired route tests passed')
}

main()
