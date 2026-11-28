import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ReadingPlaces } from '../lib/reading-place'

const now = 1_735_000_000_000
const at = 1_730_000_000_000

const chapter = ReadingPlaces.capture({
  headings: [
    { id: '4.1', top: 400 },
    { id: '4.2', top: 1200 }
  ],
  scrollY: 500,
  scrollHeight: 5000,
  viewport: 800,
  at
})
assert.equal(chapter.id, '4.1')
assert.equal(chapter.offset, 500 - (400 - ReadingPlaces.margin))

const aligned = ReadingPlaces.capture({
  headings: [{ id: '4.2', top: 1200 }],
  scrollY: 1200 - ReadingPlaces.margin,
  scrollHeight: 5000,
  viewport: 800,
  at
})
assert.equal(aligned.id, '4.2')
assert.equal(aligned.offset, 0)
assert.equal(
  ReadingPlaces.scrollTarget(aligned, [{ id: '4.2', top: 1200 }], 5000, 800),
  1200 - ReadingPlaces.margin
)

const above = ReadingPlaces.capture({
  headings: [{ id: '4.1', top: 400 }],
  scrollY: 0,
  scrollHeight: 5000,
  viewport: 800,
  at
})
assert.equal(above.id, '')
assert.equal(above.offset, 0)

const jumped = ReadingPlaces.atHeading('12.17', 2400, 8000, 800, at)
assert.equal(jumped.id, '12.17')
assert.equal(jumped.offset, 0)
assert.equal(
  ReadingPlaces.scrollTarget(jumped, [{ id: '12.17', top: 2400 }], 8000, 800),
  2400 - 96
)

const moved = { ...chapter, id: '4.9' }
assert.equal(
  ReadingPlaces.scrollTarget(moved, [{ id: '4.1', top: 400 }], 5000, 800) > 0,
  true
)
assert.equal(
  ReadingPlaces.scrollTarget(
    { id: '', offset: 40, ratio: 0, at },
    [],
    5000,
    800
  ),
  40
)

assert.equal(ReadingPlaces.isLayoutReset(chapter, above), true)
assert.equal(ReadingPlaces.isLayoutReset(above, chapter), false)
assert.equal(ReadingPlaces.isLayoutReset(chapter, aligned), false)

const round = ReadingPlaces.decode(
  ReadingPlaces.encode({ '4': chapter, 'appendix-a': jumped }),
  now
)
assert.deepEqual(round['4'], chapter)
assert.deepEqual(round['appendix-a'], jumped)

const dirty = `1|4~4.2~10~500~${at}|not a record|../x~a~0~0~${at}|14~bad id~0~0~${at}`
const kept = ReadingPlaces.decode(dirty, now)
assert.deepEqual(kept['4'], { id: '4.2', offset: 10, ratio: 500, at })
assert.equal(kept['../x'], undefined)
assert.equal(Object.keys(kept).length, 1)
assert.equal(
  Object.keys(ReadingPlaces.decode('2|4~4.2~0~0~' + at, now)).length,
  0
)

const older = { ...chapter, at: at - 1000 }
const newer = { ...chapter, at: at + 1000, offset: 80 }
assert.equal(ReadingPlaces.choose(older, newer)?.offset, 80)
assert.equal(ReadingPlaces.choose(newer, older)?.offset, 80)
assert.equal(ReadingPlaces.choose(newer, { ...newer, offset: 1 })?.offset, 80)
assert.equal(ReadingPlaces.choose(null, newer), newer)
assert.equal(ReadingPlaces.choose(older, null), older)

const many: Record<string, typeof chapter> = {}
for (let i = 0; i < 45; i += 1) many[String(i + 1)] = { ...above, at: at + i }
const trimmed = ReadingPlaces.remember(many, '14', { ...chapter, at: at + 100 })
assert.equal(Object.keys(trimmed).length <= ReadingPlaces.maxPlaces, true)
assert.equal(trimmed['14']?.id, '4.1')
assert.equal(ReadingPlaces.remember(trimmed, '14', older)['14']?.at, at + 100)

const body = ReadingPlaces.parseBody(
  {
    places: {
      '4': { id: '4.2', offset: 12, ratio: 100, at: now + 1000 },
      'appendix-a': { id: '', offset: 0, ratio: 0, at }
    }
  },
  now
)
assert.equal(body?.['4']?.at, now)
assert.equal(body?.['appendix-a']?.id, '')
assert.equal(
  ReadingPlaces.parseBody({ places: { '../4': chapter } }, now),
  null
)
assert.equal(
  ReadingPlaces.parseBody(
    { places: { '4': { id: '4.2', offset: 1.5, ratio: 0, at } } },
    now
  ),
  null
)
const polluted = JSON.parse(
  `{"places":{"__proto__":{"id":"4.2","offset":0,"ratio":0,"at":${at}}}}`
) as unknown
assert.equal(ReadingPlaces.parseBody(polluted, now), null)

const page = readFileSync('app/treatise/[slug]/page.tsx', 'utf8')
const view = readFileSync('components/treatise-chapter.tsx', 'utf8')
const removal = readFileSync('lib/account-deletion.ts', 'utf8')
assert.equal(page.includes('chapterReadingPlace'), true)
assert.equal(page.includes('readingPlace={reading.place}'), true)
assert.equal(view.includes('noteHeading'), true)
assert.equal(view.includes('window.location.hash'), true)
assert.equal(removal.includes("from('reading_places')"), true)
assert.equal(
  readFileSync('lib/reading-place.ts', 'utf8').includes('Path=/treatise'),
  true
)
