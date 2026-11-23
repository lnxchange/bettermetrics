import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

/**
 * Phrases the copy handover says must not appear in site copy.
 * "the Hub" is the short form only. "the Decision Hub" is allowed.
 */
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
  'Enough of the architecture'
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
  const relative = path.relative(process.cwd(), file)
  for (const phrase of phrases) {
    assert.equal(
      text.includes(phrase),
      false,
      `${relative} still contains "${phrase}"`
    )
  }
  const shortHub = text.match(/\bthe Hub\b/gi) ?? []
  assert.deepEqual(shortHub, [], `${relative} uses the short form "the Hub"`)
}
