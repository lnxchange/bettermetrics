import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TestingDocument } from '../components/testing-page'
import { CorpusIndex, emptyCorpusIndex } from '../lib/treatise-citations'
import { TestingBasis } from '../lib/testing-basis'
import { TestingChip } from '../lib/testing-chip'
import { TestingStatus, TestingStatusFile } from '../lib/testing-status'
import fixtureJson from '../test/sample-testing-status.json'

const fixture = TestingStatus.parse(fixtureJson)
assert.ok(fixture, 'the sample file is version 1')

assert.equal(
  TestingStatus.formatDate('2026-11-25'),
  '25 November 2026',
  'dates are en-AU long form'
)
assert.equal(
  TestingStatus.dateLine(fixture),
  'Last updated 25 November 2026 · Latest change 25 November 2026'
)
assert.equal(
  TestingStatus.resultLine(fixture.derived),
  '69 theorems machine-checked · 2 results rest on a cited theorem · 1 open'
)
assert.equal(TestingStatus.taskLine(fixture.derived.taskCounts), '9 tasks open')

assert.equal(TestingStatus.parse({ ...fixtureJson, schemaVersion: 2 }), null)
assert.equal(TestingStatus.parse({ ...fixtureJson, page: undefined }), null)
const partial = JSON.parse(JSON.stringify(fixtureJson)) as Record<
  string,
  unknown
>
delete partial.page
assert.equal(
  TestingStatus.parse(partial),
  null,
  'a missing page is not a partial status'
)
assert.equal(
  TestingStatus.parse({ ...fixtureJson, note: 'ignored extra field' })?.page
    .title,
  fixture.page.title,
  'an extra field does not reject version 1'
)

const withConsent = TestingStatus.parse({
  ...fixtureJson,
  collaborators: [
    {
      name: 'Ada Lovelace',
      affiliation: 'Analytical Engines',
      contribution: 'Reviewed the fold conditions.',
      consent: true,
      consent_date: '2026-11-01'
    }
  ]
})
assert.ok(withConsent)
assert.equal(TestingStatus.brief(withConsent).includes('Ada Lovelace'), true)
assert.equal(TestingStatus.brief(withConsent).includes('2026-11-01'), false)
assert.equal(TestingStatus.brief(withConsent).includes('consent'), false)

const book: CorpusIndex = {
  chapters: ['appendix-a', '13'],
  owners: { a: 'appendix-a', '13a': '13' },
  sections: {
    'a.5.3': { slug: 'appendix-a', text: 'A.5.3' },
    'a.5.4': { slug: 'appendix-a', text: 'A.5.4' },
    'a.5.7': { slug: 'appendix-a', text: 'A.5.7' },
    'a.5.7.4': { slug: 'appendix-a', text: 'A.5.7.4' },
    'a.5.7.5': { slug: 'appendix-a', text: 'A.5.7.5' },
    'a.5.7.6': { slug: 'appendix-a', text: 'A.5.7.6' },
    '13a': { slug: '13', text: 'Appendix 13A' }
  }
}

function basis(text: string, index: CorpusIndex = book) {
  return TestingBasis.resolve(text, index)
}

const expected: Record<string, string> = {
  'Appendix A, Section A.5.3': '/treatise/appendix-a#a.5.3',
  'Appendix A, Section A.5.7.4': '/treatise/appendix-a#a.5.7.4',
  'Appendix A, Section A.5.7.6': '/treatise/appendix-a#a.5.7.6',
  'Appendix A, Sections A.5.7.4 and A.5.7.5': '/treatise/appendix-a#a.5.7.4',
  'Appendix A, Sections A.5.7.4 and A.5.7.6': '/treatise/appendix-a#a.5.7.4',
  'Appendix A, Equation A.4-1': '/treatise/appendix-a',
  'Appendix A, M3 and M5a': '/treatise/appendix-a',
  'Appendix A, Section A.5.7': '/treatise/appendix-a#a.5.7',
  'Appendix A, Section A.5.4': '/treatise/appendix-a#a.5.4',
  'Appendix 13A': '/treatise/chapter-13#13a'
}

const seen = new Set<string>()
for (const prediction of fixture.falsification.predictions)
  seen.add(prediction.basis)
for (const row of fixture.validation.internal.results) seen.add(row.basis)
for (const text of Array.from(seen)) {
  const resolved = basis(text)
  const key = text.replace(/\s+\([^)]*\)$/, '')
  assert.equal(resolved.href, expected[key], text)
  assert.equal(resolved.href?.includes('appendix-13a') ?? false, false)
  if (text.includes('(')) {
    assert.match(resolved.note, /^\([^)]*\)$/)
    assert.equal(resolved.text.endsWith(')'), false)
  }
}

const cited = basis('Appendix A, Section A.5.3 (Sotomayor; Kuznetsov)')
assert.equal(cited.href, '/treatise/appendix-a#a.5.3')
assert.equal(cited.text, 'Appendix A, Section A.5.3')
assert.equal(cited.note, '(Sotomayor; Kuznetsov)')

const perron = basis(
  'Appendix A, Sections A.5.7.4 and A.5.7.6 (Perron–Frobenius)'
)
assert.equal(perron.href, '/treatise/appendix-a#a.5.7.4')
assert.equal(perron.note, '(Perron–Frobenius)')

const missingSection = basis('Appendix A, Section A.9.9')
assert.equal(
  missingSection.href,
  '/treatise/appendix-a',
  'a missing heading is not a broken anchor'
)

const firstMissing = basis('Appendix A, Sections A.9.9 and A.5.3')
assert.equal(
  firstMissing.href,
  '/treatise/appendix-a',
  'only the first named section may anchor'
)

TestingBasis.forgetWarnings()
const warnings: string[] = []
const originalWarn = console.warn
console.warn = (message?: unknown) => {
  warnings.push(String(message))
}
try {
  const missing = basis('Appendix Z, Section Z.1')
  assert.equal(missing.href, null)
  assert.equal(missing.text, 'Appendix Z, Section Z.1')
  basis('Appendix Z, Section Z.1')
} finally {
  console.warn = originalWarn
}
assert.equal(warnings.length, 1, 'an unresolved document warns once')
assert.match(
  warnings[0],
  /Unresolved basis, rendered as text: Appendix Z, Section Z.1/
)

assert.equal(TestingChip.treatment('machine-checked'), 'strong')
assert.equal(TestingChip.treatment('cited'), 'outlined')
assert.equal(TestingChip.treatment('check pending'), 'muted')
assert.equal(TestingChip.treatment('not-a-status'), 'neutral')

function htmlFor(status: TestingStatusFile | null, index: CorpusIndex = book) {
  return renderToStaticMarkup(createElement(TestingDocument, { status, index }))
}

const page = htmlFor(fixture)
const headings = [
  'What would count against the framework',
  'What has been checked',
  'What still needs measuring',
  'Open problems',
  'Log',
  'How to read the status labels'
]
let cursor = 0
for (const heading of headings) {
  const at = page.indexOf(heading, cursor)
  assert.equal(at > cursor, true, `section order includes ${heading}`)
  cursor = at
}
assert.equal(
  page.includes('Collaborators'),
  false,
  'an empty collaborator list is omitted'
)
assert.equal(page.includes('id="decoupled-body-survives"'), true)
assert.equal(page.includes('69 theorems machine-checked'), true)
assert.equal(page.includes('9 tasks open'), true)
assert.equal(
  page.includes('Show earlier entries'),
  false,
  'five log entries need no expander'
)
assert.match(page, /<summary[^>]*>Derivation: machine-checked<\/summary>/)
assert.equal(
  page.includes(
    'Proved in the Lean proof assistant against the Mathlib library, with no unproved steps.'
  ),
  true,
  'the chip definition is in the page'
)
assert.equal(page.includes('href="/treatise/appendix-a#a.5.3"'), true)
assert.equal(page.includes('href="/treatise/chapter-13#13a"'), true)
assert.equal(page.includes('href="/treatise/appendix-13a"'), false)
assert.equal(page.includes('(Sotomayor; Kuznetsov)'), true)
assert.equal(page.includes('href="/contact"'), true)
assert.equal(page.toLowerCase().includes('validated'), false)
assert.equal(page.toLowerCase().includes('proven'), false)

const named = htmlFor(withConsent)
assert.equal(named.includes('Collaborators'), true)
assert.equal(named.includes('Ada Lovelace'), true)
assert.equal(named.includes('Analytical Engines'), true)
assert.equal(named.includes('Reviewed the fold conditions.'), true)
assert.equal(named.includes('2026-11-01'), false)
assert.equal(named.includes('consent'), false)

const unknown: TestingStatusFile = JSON.parse(JSON.stringify(fixture))
unknown.validation.internal.results[0].status = 'tentative'
const unknownHtml = htmlFor(unknown)
assert.match(unknownHtml, /data-treatment="neutral"[^>]*>tentative</)
assert.equal(unknownHtml.includes('What has been checked'), true)

const longLog: TestingStatusFile = JSON.parse(JSON.stringify(fixture))
longLog.log = Array.from({ length: 12 }, (_, index) => ({
  ...fixture.log[0],
  title: `Entry ${index}`
}))
assert.equal(htmlFor(longLog).includes('Show earlier entries'), true)
assert.equal(TestingStatus.splitLog(longLog.log).latest.length, 10)
assert.equal(TestingStatus.splitLog(longLog.log).earlier.length, 2)

const fallback = htmlFor(null, emptyCorpusIndex())
assert.equal(fallback.includes(TestingStatus.preparing), true)
assert.equal(fallback.includes('What has been checked'), false)
assert.equal(fallback.includes('What would count against the framework'), false)

const route = readFileSync('app/api/revalidate/route.ts', 'utf8')
assert.equal(route.includes('revalidateTag(TestingStatus.cacheTag)'), true)
assert.equal(route.includes('revalidatePath(TestingStatus.path)'), true)

const header = readFileSync('components/header.tsx', 'utf8')
const footer = readFileSync('components/footer.tsx', 'utf8')
assert.match(
  header,
  /href: '\/treatise'[\s\S]{0,80}href: '\/testing', label: 'Testing the Framework'/
)
assert.match(
  footer,
  /href: '\/treatise'[\s\S]{0,80}href: '\/testing', label: 'Testing the Framework'/
)

const contact = readFileSync('components/contact-page.tsx', 'utf8')
assert.equal(
  contact.includes(
    'Where the framework stands, and where help is needed, is set out at'
  ),
  true
)
assert.match(contact, /href="\/testing"/)

const sitemap = readFileSync('app/sitemap.xml/route.ts', 'utf8')
assert.match(sitemap, /path: '\/testing', changefreq: 'weekly'/)

const fixedSources = [
  'components/testing-page.tsx',
  'lib/testing-status.ts',
  'lib/testing-basis.ts',
  'lib/testing-chip.ts',
  'lib/testing-metadata.ts',
  'app/testing/page.tsx',
  'app/testing/fixture/page.tsx'
]
for (const file of fixedSources) {
  const source = readFileSync(file, 'utf8').toLowerCase()
  assert.equal(
    source.includes('validated'),
    false,
    `${file} does not say validated`
  )
  assert.equal(source.includes('proven'), false, `${file} does not say proven`)
}

console.log('testing status tests passed')
