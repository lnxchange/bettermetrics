import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { MinimalArchitecture } from '../lib/architecture-data'
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
