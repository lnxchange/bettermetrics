import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { resolveGlossaryName } from '../lib/glossary'
import {
  parseGlossaryEntries,
  splitCrossReferences
} from './sync-treatise-chapters'

/** Chapter 2 is dated in the filename. Resolve it by chapter number, latest date first. */
class TreatiseChapters {
  static chapterTwo(dir: string) {
    const names = readdirSync(dir).filter(
      name => /^\d{6} - Chapter 02 - .+\.md$/.test(name) && !name.includes('[')
    )
    if (names.length === 0) throw new Error(`no Chapter 02 file in ${dir}`)
    names.sort()
    return path.join(dir, names[names.length - 1])
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const sample = `
### A-Duties

**A-duties are corresponding obligations, distributed by a cascading structure.**

**Explanation.** They fall first on the nearest capable parties.

*Derivation:* Chapter 18, Section 18.11.

*Epistemic Status:* Framework-Specific Construct (normative).

*Cross-references:* A-Rights, Appetitive Floors (A-floors), AIM Weights (wA, wI, wM).

***

### A-Floor

**A-Floor.** The A-Floor is the level of Appetitive provision.

**Explanation.** This entry names that level.

*Cross-references:* Appetites (A); Intrinsic Motivation (I); Mimetic Desire (M).

***

### Appetitive Floors (A-floors)

**Appetitive Floors (A-floors) are institutionally guaranteed baselines.**

*Cross-references:* A-Floor.

***

### Axiom 8 - Bayesian Belief Dynamics

**Axiom 8 - Bayesian Belief Dynamics.** Pointer entry.

*Cross-references:* Belief Register.

***

### Construction Premise 2 - Common-Currency Integration

**Construction Premise 2 - Common-Currency Integration.** Pointer entry.

*Cross-references:* Decision Hub.
`

const parsed = parseGlossaryEntries(sample)
const duties = parsed.find(entry => entry.term === 'A-Duties')
assert(!!duties, 'A-Duties is parsed')
assert(
  duties?.definition ===
    'A-duties are corresponding obligations, distributed by a cascading structure.',
  'a fully bold definition is kept'
)
assert(
  duties?.cross_references.includes('AIM Weights (wA, wI, wM)') === true,
  'commas inside parentheses stay in one reference'
)
assert(
  splitCrossReferences('Appetites (A); Intrinsic Motivation (I).').length === 2,
  'semicolons separate references'
)

const floor = parsed.find(entry => entry.term === 'A-Floor')
assert(
  floor?.definition === 'The A-Floor is the level of Appetitive provision.',
  'a bold label repeating the term is removed'
)

const entries = parsed.map(entry => ({ term: entry.term, slug: entry.term }))
assert(
  resolveGlossaryName('A-floors', entries)?.term ===
    'Appetitive Floors (A-floors)',
  'a parenthetical alias resolves'
)
assert(
  resolveGlossaryName('Bayesian Belief Dynamics (Axiom 8)', entries)?.term ===
    'Axiom 8 - Bayesian Belief Dynamics',
  'an axiom restatement resolves'
)
assert(
  resolveGlossaryName(
    'Common-Currency Integration (Construction Premise 2)',
    entries
  )?.term === 'Construction Premise 2 - Common-Currency Integration',
  'a Construction Premise restatement resolves'
)
assert(
  resolveGlossaryName('Construction Premise 2', entries)?.term ===
    'Construction Premise 2 - Common-Currency Integration',
  'a Construction Premise number resolves through the labelled heading'
)
assert(
  resolveGlossaryName('κ (Coupling Strength)', [
    { term: 'Coupling Strength', slug: 'coupling-strength' }
  ])?.slug === 'coupling-strength',
  'a symbol in parentheses resolves to the named term'
)

const chapterPath = process.env.TREATISE_DIR
  ? TreatiseChapters.chapterTwo(process.env.TREATISE_DIR)
  : ''
if (chapterPath) {
  const chapter = parseGlossaryEntries(readFileSync(chapterPath, 'utf8'))
  const names = new Set(chapter.flatMap(entry => entry.cross_references))
  const missed = Array.from(names).filter(
    name => !resolveGlossaryName(name, chapter)
  )
  const allowed = new Set([
    'A-Loading',
    'AI Assay',
    'Chapter 15 (The Bayesian Self-Model)',
    'G_cross',
    'G_eff',
    'G_net^K',
    'G_net^Λ',
    'G_slow',
    'Satiation (A)',
    'Section 14.5',
    'Type II (Prior Dominance)',
    'κ_self'
  ])
  const unexpected = missed.filter(name => !allowed.has(name))
  assert(
    unexpected.length === 0,
    `unexpected unresolved glossary names: ${unexpected.join('; ')}`
  )
  assert(
    chapter.every(entry => entry.definition.length > 0),
    'every glossary entry has a definition'
  )
}

console.log('glossary sync tests passed')
