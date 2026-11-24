import { TreatiseTitle } from '../lib/treatise-title'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const glossary = [
  'Evolutionary Mismatch Hypothesis',
  'Confabulation',
  'Projection',
  'Scapegoat Mechanism',
  'GDPA, GDPI, GDPM',
  'Housing PM Decomposition',
  'Minimal Architecture Specification (MAS)',
  'AIM Weights (wA, wI, wM)',
  'Cost of a Belief',
  'Flow (AIM sense)',
  'Quantum Epistemology (QE)'
]

assert(
  TreatiseTitle.normalise('THE EVOLUTIONARY MISMATCH HYPOTHESIS', glossary) ===
    'The Evolutionary Mismatch Hypothesis',
  'chapter 10 is title case'
)
assert(
  TreatiseTitle.fromMarkdown(
    '# Chapter 10: THE EVOLUTIONARY MISMATCH HYPOTHESIS\n\nBody.\n',
    'Chapter 10',
    glossary
  ) === 'The Evolutionary Mismatch Hypothesis',
  'a capital chapter heading is stored in title case'
)

assert(
  TreatiseTitle.normalise(
    'CONFABULATION, PROJECTION, AND THE SCAPEGOAT MECHANISM',
    glossary
  ) === 'Confabulation, Projection, and the Scapegoat Mechanism',
  'chapter 11 lowercases the small words'
)
assert(
  TreatiseTitle.fromMarkdown(
    '# Chapter 11 - CONFABULATION, PROJECTION, AND THE SCAPEGOAT MECHANISM\n',
    'Chapter 11',
    glossary
  ) === 'Confabulation, Projection, and the Scapegoat Mechanism',
  'a dashed capital chapter heading is stored in title case'
)

const mixed = 'The Minimal Architecture of AIM and Its Construction'
assert(
  TreatiseTitle.normalise(mixed, glossary) === mixed,
  'a mixed-case title is left as written'
)
assert(
  TreatiseTitle.normalise('Cost of a Belief', glossary) === 'Cost of a Belief',
  'a mixed-case defined term is left as written, including its lowercase a'
)
assert(
  TreatiseTitle.normalise('AIM, MAS and GDP', glossary) === 'AIM, MAS and GDP',
  'a mixed title that is mostly capitals is still left as written'
)
assert(
  TreatiseTitle.fromMarkdown(
    '# Chapter 4: The Minimal Architecture of AIM and Its Construction\n',
    'Chapter 4',
    glossary
  ) === mixed,
  'a mixed-case heading is stored as written'
)

assert(
  TreatiseTitle.normalise('HOUSING PM AND THE AIM OF MAS (A)', glossary) ===
    'Housing PM and the AIM of MAS (A)',
  'glossary acronyms and the AIM letters stay uppercase'
)
assert(
  TreatiseTitle.normalise('THE AIM OF MAS (M)') === 'The AIM of MAS (M)',
  'AIM, MAS and a parenthetical letter stay uppercase without a glossary'
)
assert(
  TreatiseTitle.normalise('AIM WEIGHTS (WA, WI, WM)', glossary) ===
    'AIM Weights (wA, wI, wM)',
  'a defined term keeps the glossary capitals'
)
assert(
  TreatiseTitle.normalise('COST OF A BELIEF', glossary) === 'Cost of a Belief',
  'the glossary article stays lowercase inside the defined term'
)
assert(
  TreatiseTitle.normalise('FLOW (AIM SENSE)', glossary) === 'Flow (AIM sense)',
  'glossary casing wins inside parentheses'
)
assert(
  TreatiseTitle.normalise('QUANTUM EPISTEMOLOGY (QE)', glossary) ===
    'Quantum Epistemology (QE)',
  'a parenthetical acronym keeps the glossary capitals'
)

assert(
  TreatiseTitle.normalise('NOTES: THE AIM OF WELL-BEING') ===
    'Notes: The AIM of Well-Being',
  'a small word is capitalised after a colon and after a dash'
)
assert(
  TreatiseTitle.normalise('HOME-AND-AWAY') === 'Home-And-Away',
  'a small word is capitalised after a dash when it is not a defined term'
)
assert(
  TreatiseTitle.normalise('VIOLENCE AS ARCHITECTURAL OUTPUT') ===
    'Violence as Architectural Output',
  'as stays lowercase in the middle of a capital title'
)
assert(
  TreatiseTitle.normalise('THE KNOWLEDGE PATCH') === 'The Knowledge Patch',
  'the first word is capitalised even when it is a small word'
)

assert(
  TreatiseTitle.normalise('THE EVOLUTIONARY MISMATCH hypothesis') ===
    'THE EVOLUTIONARY MISMATCH hypothesis',
  'one lowercase word keeps the title as written'
)

console.log('treatise titles ok')
