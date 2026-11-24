import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

/**
 * Phrases the copy handovers say must not appear in site copy.
 * "the Hub" is the short form only. "the Decision Hub" is allowed.
 * Checked on whitespace-collapsed text so a phrase split across lines still counts.
 */
class CopyDeck {
  static normalise(text: string): string {
    return text
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&quot;|&#34;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
  }

  static count(text: string, phrase: string): number {
    const haystack = CopyDeck.normalise(text)
    let count = 0
    let from = 0
    while (from <= haystack.length) {
      const at = haystack.indexOf(phrase, from)
      if (at === -1) return count
      count += 1
      from = at + phrase.length
    }
    return count
  }
}

const phrases = [
  'floor of income',
  'novelty is worn off',
  'its own neural pathway',
  'distinct neural systems',
  'tracks conscious awareness',
  'terminally satisfiable',
  'interest as a pure Mimetic Premium',
  'in this section',
  'Germ theory',
  'as if it told them both',
  'Where the Construction Premises are carried',
  'At each cycle: the Body Manager',
  'cannot enter Salience computation',
  'Enough of the architecture',
  'Not Incremental',
  'Revolutionary',
  "isn't an incremental improvement",
  'first neuroscientific basis',
  'no existing theory can make',
  'competitive advantage',
  'first time in history',
  'Unique Cross-Disciplinary Applications',
  'Existing Frameworks Cannot Make',
  'apply engineering concepts to that issue',
  'what a loose definition does',
  'boundered',
  'memetic',
  'believing I was an alien'
]

const roots = ['app', 'components', 'lib', 'content', 'public/search-index.json']

function filesIn(entry: string): string[] {
  const full = path.resolve(entry)
  let info
  try {
    info = statSync(full)
  } catch {
    return []
  }
  if (info.isFile()) return [full]
  const found: string[] = []
  for (const name of readdirSync(full)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    found.push(...filesIn(path.join(entry, name)))
  }
  return found
}

function textOf(file: string) {
  return readFileSync(file, 'utf8')
}

const files = roots.flatMap(filesIn)
assert.ok(files.length > 0, 'the copy roots are present')

for (const file of files) {
  const text = textOf(file)
  const prose = CopyDeck.normalise(text)
  const relative = path.relative(process.cwd(), file)
  for (const phrase of phrases) {
    assert.equal(
      prose.includes(phrase),
      false,
      `${relative} still contains "${phrase}"`
    )
  }
  assert.equal(
    prose.includes('yule@attune.legal'),
    false,
    `${relative} still shows yule@attune.legal`
  )
  const shortHub = text.match(/\bthe Hub\b/gi) ?? []
  assert.deepEqual(shortHub, [], `${relative} uses the short form "the Hub"`)
}

const once: Array<[string, string]> = [
  ['components/contact-page.tsx', 'Potentially Groundbreaking'],
  ['components/contact-page.tsx', 'Shared Definitions Across Disciplines'],
  ['components/contact-page.tsx', 'the difference is the test'],
  ['components/contact-page.tsx', 'Email: info@aimtheory.org'],
  ['app/about/page.tsx', 'see how motivation behaves as a system'],
  ['app/about/page.tsx', 'it becomes legible at scale'],
  ['app/about/page.tsx', 'feeling unrelated to my father'],
  ['app/about/page.tsx', 'tightly bounded tests'],
  ['app/about/page.tsx', 'removing mimetic noise and distortion'],
  [
    'app/about/page.tsx',
    'One of my strongest early memories is feeling unrelated to my father. I was no older than 4. I felt that my father didn\'t understand me and that I couldn\'t understand him. I couldn\'t relate to him or effectively communicate the importance of my wants and needs to him. That feeling persisted in various forms throughout my life and ultimately led me to therapy in 2010.'
  ],
  [
    'app/about/page.tsx',
    'It was here that I told my therapist that I didn\'t know whether I wanted things for myself because I genuinely wanted them, or because my dad wanted them for me. The therapist responded, "Well, then that\'s where your work is — finding that out." The AIM Framework represents the culmination of that work. It appears to me that in answering that question for myself, I may have inadvertently answered the same question for everyone\'s self.'
  ]
]

for (const [file, phrase] of once) {
  assert.equal(
    CopyDeck.count(readFileSync(file, 'utf8'), phrase),
    1,
    `${file} should contain "${phrase}" once`
  )
}
