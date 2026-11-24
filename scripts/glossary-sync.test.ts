import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { previewOf, resolveGlossaryName } from '../lib/glossary'
import { GlossaryText } from '../lib/glossary-text'
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
    '**A-duties are corresponding obligations, distributed by a cascading structure.**',
  'a fully bold definition keeps its markdown'
)
assert(
  GlossaryText.plain(duties?.definition ?? '') ===
    'A-duties are corresponding obligations, distributed by a cascading structure.',
  'the plain reading of a fully bold definition has no markers'
)
assert(
  previewOf(duties?.definition ?? '') ===
    'A-duties are corresponding obligations, distributed by a cascading structure.',
  'the search preview of a fully bold definition has no markers'
)
assert(
  GlossaryText.prose(duties?.definition ?? '') ===
    'A-duties are corresponding obligations, distributed by a cascading structure.',
  'meta text of a fully bold definition has no markers'
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
assert(
  GlossaryText.plain(floor?.definition ?? '') ===
    'The A-Floor is the level of Appetitive provision.',
  'a removed label leaves no markers in the plain reading'
)

const marked = parseGlossaryEntries(`
### Loop Gain

**Loop Gain.** The gain is **critical** when $G_{crit}$ exceeds *one*.

***

### Critical Loop Gain

**Critical Loop Gain (G_crit).** The Critical Loop Gain $G_{crit}$ is the threshold.

***

### Wrapped Label

**Wrapped Label. The rest stays bold.**

***
`)
const loop = marked.find(entry => entry.term === 'Loop Gain')
assert(
  loop?.definition ===
    'The gain is **critical** when $G_{crit}$ exceeds *one*.',
  'bold, italics and math in the remainder are kept'
)
assert(
  GlossaryText.plain(loop?.definition ?? '') ===
    'The gain is critical when $G_{crit}$ exceeds one.',
  'plain text drops emphasis markers and keeps math delimiters'
)
assert(
  GlossaryText.prose(loop?.definition ?? '') ===
    'The gain is critical when G_crit exceeds one.',
  'meta text drops emphasis markers and TeX delimiters'
)
assert(
  !GlossaryText.plain(loop?.definition ?? '').includes('**'),
  'the plain consumer has no bold markers'
)
const critical = marked.find(entry => entry.term === 'Critical Loop Gain')
assert(
  critical?.definition ===
    '**Critical Loop Gain (G_crit).** The Critical Loop Gain $G_{crit}$ is the threshold.',
  'a parenthetical after the term is not treated as a label'
)
assert(
  GlossaryText.plain(critical?.definition ?? '').includes('$G_{crit}$'),
  'the plain reading of a parenthetical definition keeps the math'
)
assert(
  !GlossaryText.plain(critical?.definition ?? '').includes('**'),
  'the plain reading of a parenthetical definition has no bold markers'
)
const sections = parseGlossaryEntries(`
### Admiration

**Admiration is the Positive Mimesis response.**

**Explanation.** Admiration is what you feel.

The distinction matters.

**Diagnostic.** Does observing the Model make you want to develop a capacity?

**Why hatred cannot ground Admiration.** Hatred-grounded fascination produces M-escalation.

*Derivation:* Chapter 8, Section 8.11.4.
`)
const admiration = sections.find(entry => entry.term === 'Admiration')
assert(
  admiration?.definition === '**Admiration is the Positive Mimesis response.**',
  'a one-paragraph definition stays one paragraph'
)
assert(
  admiration?.explanation ===
    [
      'Admiration is what you feel.',
      '',
      'The distinction matters.',
      '',
      '**Diagnostic.** Does observing the Model make you want to develop a capacity?',
      '',
      '**Why hatred cannot ground Admiration.** Hatred-grounded fascination produces M-escalation.'
    ].join('\n'),
  'explanation sub-sections keep their paragraph breaks'
)
assert(
  !admiration?.explanation.includes('feel. The distinction'),
  'adjacent explanation paragraphs are not joined'
)

const riders = parseGlossaryEntries(`
### Agentic Precedence Principle

**Agentic Precedence Principle.** In any explanatory domain, agent-based explanation comes first.

Two riders bound the principle.

**Corollary (Gradient Survives).** The gradient remains.

***
`)
const agentic = riders.find(entry => entry.term === 'Agentic Precedence Principle')
assert(
  agentic?.definition ===
    [
      'In any explanatory domain, agent-based explanation comes first.',
      '',
      'Two riders bound the principle.',
      '',
      '**Corollary (Gradient Survives).** The gradient remains.'
    ].join('\n'),
  'a definition keeps later paragraphs and their bold labels'
)

const wrapped = marked.find(entry => entry.term === 'Wrapped Label')
assert(
  wrapped?.definition === '**The rest stays bold.**',
  'a label inside one bold span keeps the remainder bold'
)
assert(
  GlossaryText.plain(wrapped?.definition ?? '') === 'The rest stays bold.',
  'the plain reading of a wrapped label has no markers'
)

function dollarsBalanced(value: string) {
  return (value.split('$').length - 1) % 2 === 0
}

const typeset = previewOf(
  '**Critical Loop Gain ($G_{crit}$).** The Critical Loop Gain $G_{crit}$ is the threshold value of the internal loop gain $G = \\kappa_S \\cdot \\beta \\cdot \\gamma \\cdot \\sigma\'(V^{*})$.',
  90
)
assert(
  typeset === 'Critical Loop Gain ($G_{crit}$).',
  'a short formula stays whole in the preview'
)
assert(!typeset.includes('**') && dollarsBalanced(typeset), 'that preview has no markers')

const internal = previewOf(
  "**Internal Loop Gain is the quantity $G \\equiv \\kappa_S\\cdot\\beta\\cdot\\gamma\\cdot\\sigma'(V^{*})$ defined in Appendix A.5, being the product of the three couplings.**",
  90
)
assert(
  internal === 'Internal Loop Gain is the quantity…',
  'a formula that does not fit is left out instead of being sliced open'
)
assert(!internal.includes('**') && !internal.includes('$'), 'the shortened preview has no markers')

const joint = previewOf(
  'The Joint Stability Condition is $G_{joint} = G_{eff} + G_{slow} + G_{cross} < G_{crit}^{joint}$, where $G_{eff}$ is the fast layer.',
  90
)
assert(
  joint === 'The Joint Stability Condition is…',
  'the joint-stability preview does not open a dollar it cannot close'
)
assert(dollarsBalanced(joint), 'the joint-stability preview keeps formulas whole')

const ratio = previewOf('The ratio is $1.5$ exactly today.', 140)
assert(
  ratio === 'The ratio is $1.5$ exactly today.',
  'a decimal point inside a formula is not the end of the sentence'
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
function legacyDefinition(raw: string, term: string) {
  const text = raw.replace(/\s+/g, ' ').replace(/\*\*/g, '').trim()
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const labelled = text.match(
    new RegExp(`^${escaped}\\s*[:.]\\s+([\\s\\S]+)$`, 'i')
  )
  return labelled ? labelled[1].trim() : text
}

function definitionRegion(body: string) {
  const stop = body.search(
    /^\*\*Explanation\.?\*\*|^\*Derivation:|^\*Epistemic Status:|^\*Cross-references:|^\*\*\*\s*$/m
  )
  return stop === -1 ? body : body.slice(0, stop)
}

if (chapterPath) {
  const markdown = readFileSync(chapterPath, 'utf8')
  const chapter = parseGlossaryEntries(markdown)
  const rawByTerm = new Map<string, string>()
  for (const part of markdown.split(/^### /m).slice(1)) {
    const newline = part.indexOf('\n')
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim()
    const body = newline === -1 ? '' : part.slice(newline + 1)
    rawByTerm.set(heading, definitionRegion(body))
  }
  const drifted = chapter.filter(entry => {
    const raw = rawByTerm.get(entry.term)
    const legacy = legacyDefinition(raw ?? '', entry.term)
      .replace(/\s+/g, ' ')
      .trim()
    const rich = entry.definition
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return raw === undefined || legacy !== rich
  })
  assert(
    drifted.length === 0,
    `definition words changed: ${drifted
      .slice(0, 8)
      .map(entry => entry.term)
      .join('; ')}`
  )
  assert(
    chapter.every(
      entry => !GlossaryText.plain(entry.definition).includes('**')
    ),
    'plain definitions have no bold markers'
  )
  assert(
    chapter.every(entry => {
      const preview = previewOf(entry.definition, 90)
      return !preview.includes('**') && dollarsBalanced(preview)
    }),
    'index previews have no bold markers and no sliced formulas'
  )
  assert(
    chapter.some(entry => entry.definition.includes('**')),
    'stored definitions keep markdown bold'
  )
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
    'M as Amplifier (Chapter 4, Section 4.5.3)',
    'Satiation (A)',
    'Section 13.5',
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
