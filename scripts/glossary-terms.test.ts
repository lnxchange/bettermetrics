import { findGlossarySpans } from '../lib/glossary-terms'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const terms = [
  { term: 'Decision Hub', slug: 'decision-hub' },
  { term: 'Decision', slug: 'decision' },
  { term: 'I', slug: 'i' },
  { term: 'Mimetic Desire', slug: 'mimetic-desire' }
]

const text = 'The Decision Hub holds a Decision. I still read, and Mimetic Desire persists. DecisionHub is untouched.'
const spans = findGlossarySpans(text, terms)
const found = spans.map(span => span.text)

assert(found.includes('Decision Hub'), 'longest heading is matched')
assert(found.filter(item => item === 'Decision').length === 1, 'the shorter heading matches on its own')
assert(!found.includes('I'), 'a one-letter heading is not marked')
assert(found.includes('Mimetic Desire'), 'a second capitalised term is matched')
assert(!text.slice(spans[spans.length - 1]?.end).includes('DecisionHub') || !found.some(item => item === 'DecisionHub'), 'a term inside a longer word is left alone')
assert(!spans.some(span => span.text === 'Decision' && text.slice(span.start, span.start + 12) === 'Decision Hub'), 'Decision is not taken out of Decision Hub')

console.log('glossary terms ok', found.join(', '))
