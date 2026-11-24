import { createRequire } from 'module'
import { TreatiseAddress } from '../lib/treatise-address'
import { TreatiseIndexKeys } from '../lib/rag/treatise-index'
import { appendixPath, chapterPath } from '../lib/treatise-citations'

const require = createRequire(__filename)
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

const handover: [string, string][] = [
  ['/treatise/1', '/treatise/chapter-1'],
  ['/treatise/2', '/treatise/chapter-2'],
  ['/treatise/3', '/treatise/chapter-3'],
  ['/treatise/4', '/treatise/chapter-4'],
  ['/treatise/5', '/treatise/chapter-5'],
  ['/treatise/6', '/treatise/chapter-6'],
  ['/treatise/7', '/treatise/chapter-7'],
  ['/treatise/8', '/treatise/chapter-8'],
  ['/treatise/9', '/treatise/chapter-9'],
  ['/treatise/10', '/treatise/chapter-10'],
  ['/treatise/11', '/treatise/chapter-11'],
  ['/treatise/12', '/treatise/chapter-14'],
  ['/treatise/13', '/treatise/chapter-12'],
  ['/treatise/14', '/treatise/chapter-13'],
  ['/treatise/15', '/treatise/chapter-15'],
  ['/treatise/16', '/treatise/chapter-16'],
  ['/treatise/17', '/treatise/chapter-17'],
  ['/treatise/18', '/treatise/chapter-18'],
  ['/treatise/19', '/treatise/chapter-19'],
  ['/treatise/20', '/treatise/chapter-20'],
  ['/treatise/appendix-12a', '/treatise/appendix-14a']
]

async function main() {
  const redirects = await nextConfig.redirects()
  for (const [source, destination] of handover) {
    const found = redirects.find(item => item.source === source)
    assert(!!found, `missing redirect ${source}`)
    assert(
      found?.destination === destination,
      `${source} goes to ${found?.destination}, expected ${destination}`
    )
    assert(found?.permanent === true, `${source} is not permanent`)
    assert(found?.statusCode === 301, `${source} is not a 301`)
    assert(
      TreatiseAddress.destinationFor(source) === destination,
      `address table disagrees on ${source}`
    )
  }

  const glossary = redirects.find(item => item.source === '/treatise/chapter-2')
  assert(
    glossary?.destination === '/glossary',
    'chapter 2 continues to the glossary'
  )
  assert(glossary?.statusCode === 301, 'chapter 2 glossary hop is a 301')

  assert(
    TreatiseAddress.publicPath('12') === '/treatise/chapter-12',
    'stored 12 stays chapter-12'
  )
  assert(
    TreatiseAddress.publicPath('8') === '/treatise/chapter-8',
    'stored 8 is chapter-8'
  )
  assert(
    TreatiseAddress.publicPath('2') === '/glossary',
    'stored chapter 2 is the glossary'
  )
  assert(
    TreatiseAddress.publicPath('appendix-12a') === '/treatise/appendix-14a',
    'the stored 12A slug is addressed as 14A'
  )
  assert(
    TreatiseAddress.publicPath('appendix-a') === '/treatise/appendix-a',
    'lettered appendices keep their address'
  )
  assert(
    TreatiseAddress.storageSlug('chapter-8') === '8',
    'chapter-8 reads slug 8'
  )
  assert(
    TreatiseAddress.storageSlug('12') === null,
    'a bare number is not a page'
  )
  assert(
    TreatiseAddress.storageSlug('chapter-21') === null,
    'chapter 21 is not a chapter address'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/12') === '14',
    'old 12 opens chapter 14'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/13') === '12',
    'old 13 opens chapter 12'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/14') === '13',
    'old 14 opens chapter 13'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/8') === '8',
    'old 8 opens chapter 8'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/appendix-12a') ===
      'appendix-14a',
    'old appendix 12A opens appendix 14A'
  )
  assert(
    TreatiseAddress.storageSlugFromPath('/treatise/2') === null,
    'old chapter 2 is the glossary'
  )
  assert(
    chapterPath('12') === '/treatise/chapter-12',
    'a citation of chapter 12 uses the new address'
  )
  assert(
    chapterPath('4') === '/treatise/chapter-4',
    'a citation of chapter 4 uses the new address'
  )
  assert(
    appendixPath('12A') === '/treatise/appendix-14a',
    'a citation of appendix 12A uses the new address'
  )
  assert(appendixPath('A') === '/treatise/appendix-a', 'a citation of appendix A keeps its address')

  assert(
    TreatiseIndexKeys.retired.length === 4,
    'the four retired index keys are listed'
  )
  assert(
    TreatiseIndexKeys.retired[0] ===
      'Chapter 12 - Money, Debt and the Architecture of Mimetic Extraction',
    'the money key is the old filename'
  )
  assert(
    TreatiseIndexKeys.retired[3] ===
      'Appendix 12A - Claims Against Generative Capacity',
    'the appendix key is the old filename'
  )

  console.log('treatise route tests passed')
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
