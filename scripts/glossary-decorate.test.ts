import { GlossaryMarkup } from '../lib/glossary-markup'
import { prepareTreatiseMarkdown } from '../lib/treatise-render'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const terms = [
  { term: 'Thinker', slug: 'thinker' },
  { term: 'Phenomenal Affect', slug: 'phenomenal-affect' },
  { term: 'Construction Premise', slug: 'construction-premise' },
  {
    term: 'Common-Currency Scalar (the Scalar)',
    slug: 'common-currency-scalar-the-scalar'
  },
  { term: 'Source Opacity Theorem', slug: 'source-opacity-theorem' }
]

const mark =
  'glossary-term cursor-pointer underline decoration-dotted underline-offset-[0.15em]'

function occurrences(html: string, slug: string) {
  return html.split(`data-glossary="${slug}"`).length - 1
}

const late = Array.from(
  { length: 120 },
  (_, index) => `Paragraph ${index} names Thinker once.`
).join('\n\n')

const chapter = `
## 4.1 Early

Thinker opens the chapter.

See [Thinker](/glossary/thinker) and \`Thinker\` before the prose Thinker.

\`\`\`
Thinker
\`\`\`

## 4.2.1 The Construction Premises

The nine Construction Premises were fixed here. Construction Premises again.

## 4.3.2 The Thinker

${late}

## 4.7 The Two Outputs of Integration

Phenomenal Affect is the second output of the Common-Currency Scalar.
The Scalar resolves rapidly, and a bare Scalar returns.
The Thinker receives Phenomenal Affect again.
Source Opacity Theorem covers the feeling.
`

const prepared = prepareTreatiseMarkdown(chapter, undefined, terms)
const html = prepared.html

assert(
  prepared.headings.every(heading => !heading.text.includes('data-glossary')),
  'table of contents labels stay plain text'
)
assert(
  prepared.headings.every(heading => !heading.text.includes('<')),
  'table of contents labels are not HTML'
)
assert(
  prepared.headings.some(heading =>
    heading.text.includes('Construction Premises')
  ),
  'the Construction Premises heading is still a menu label'
)
assert(
  prepared.headings.some(heading => heading.id === '4.7'),
  'section 4.7 is still a menu entry'
)

const headingTags = html.match(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi) ?? []
assert(headingTags.length >= 4, 'the chapter rendered its headings')
assert(
  headingTags.every(
    tag => !tag.includes('data-glossary') && !tag.includes(mark)
  ),
  'headings used for the table of contents are not underlined'
)
assert(
  /<h2\b[^>]*>4\.2\.1 The Construction Premises<\/h2>/.test(html),
  'the Construction Premises heading is plain'
)
assert(
  /<h2\b[^>]*>4\.3\.2 The Thinker<\/h2>/.test(html),
  'the Thinker heading is plain'
)

const section = html.slice(html.indexOf('id="4.7"'))
assert(section.includes('id="4.7"'), 'section 4.7 is in the rendered HTML')
assert(
  occurrences(section, 'phenomenal-affect') === 2,
  'both Phenomenal Affect occurrences in section 4.7 are wrapped'
)
assert(
  section.includes('>Phenomenal Affect</span>'),
  'Phenomenal Affect is inside a glossary span'
)
assert(
  section.includes(`class="${mark}"`),
  'section 4.7 uses the glossary underline class'
)
assert(
  occurrences(section, 'common-currency-scalar-the-scalar') >= 3,
  'Common-Currency Scalar, The Scalar, and Scalar are wrapped in section 4.7'
)
assert(
  section.includes('>The Scalar</span>'),
  'sentence-initial The Scalar is wrapped in section 4.7'
)
assert(
  section.includes('>Source Opacity Theorem</span>'),
  'Source Opacity Theorem is wrapped in section 4.7'
)
assert(
  occurrences(section, 'construction-premise') === 0,
  'section 4.7 does not invent a Construction Premise span'
)

assert(
  occurrences(html, 'construction-premise') === 2,
  'both Construction Premises in the body are wrapped'
)
assert(
  html.includes('>Construction Premises</span>'),
  'the plural is the wrapped text'
)

const thinkerSpans = occurrences(html, 'thinker')
assert(
  thinkerSpans === 123,
  `every prose Thinker is wrapped, including repeats (${thinkerSpans})`
)

const link = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []
assert(
  link.some(tag => tag.includes('Thinker') && !tag.includes('data-glossary')),
  'a term inside a link is not wrapped'
)
const code = html.match(/<code\b[^>]*>[\s\S]*?<\/code>/gi) ?? []
assert(
  code.some(tag => tag.includes('Thinker') && !tag.includes('data-glossary')),
  'a term inside code is not wrapped'
)

const again = GlossaryMarkup.html(html, terms)
assert(again === html, 'decorating rendered HTML again does not change it')
assert(
  !/<span\b[^>]*data-glossary="[^"]*"[^>]*>\s*<span\b/.test(again),
  'spans are not nested'
)

const raw = GlossaryMarkup.html(
  [
    '<p><button type="button">Thinker</button></p>',
    '<style>Thinker { color: red; }</style>',
    '<script>var Thinker = 1;</script>',
    '<p>Thinker&#39;s prior names Thinker.</p>',
    '<p><span data-glossary="thinker" class="' +
      mark +
      '">Thinker</span> and Thinker</p>'
  ].join(''),
  terms
)
assert(!raw.includes('<button type="button"><span'), 'a button is skipped')
const style = raw.match(/<style>[\s\S]*?<\/style>/)
const script = raw.match(/<script>[\s\S]*?<\/script>/)
assert(
  Boolean(style && !style[0].includes('data-glossary')),
  'style is skipped'
)
assert(
  Boolean(script && !script[0].includes('data-glossary')),
  'script is skipped'
)
assert(
  raw.includes('>Thinker</span>&#39;s'),
  'an apostrophe entity stays outside the span'
)
assert(
  occurrences(raw, 'thinker') === 4,
  'the prose Thinkers are wrapped and the existing span is not doubled'
)
assert(
  !/<span\b[^>]*data-glossary="thinker"[^>]*>\s*<span\b/.test(raw),
  'an existing glossary span is not wrapped again'
)

const math = GlossaryMarkup.html(
  '<p>Thinker wrote <math><mi>Thinker</mi></math> in the formula.</p>',
  terms
)
assert(occurrences(math, 'thinker') === 1, 'a term inside math is not wrapped')
assert(math.includes('<mi>Thinker</mi>'), 'math text stays intact')

console.log('glossary decorate tests passed', thinkerSpans)
