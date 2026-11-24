import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { CrawlerPolicy } from '../lib/crawlers'
import { FeatureImage } from '../lib/feature-image'

function fill(
  width: number,
  height: number,
  pixel: (x: number, y: number) => [number, number, number, number]
) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const [r, g, b, a] = pixel(x, y)
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }
  }
  return data
}

function at(data: Uint8ClampedArray, width: number, x: number, y: number) {
  const i = (y * width + x) * 4
  return [data[i], data[i + 1], data[i + 2], data[i + 3]]
}

function same(a: Uint8ClampedArray, b: Uint8ClampedArray) {
  assert.equal(a.length, b.length)
  for (let i = 0; i < a.length; i++) assert.equal(a[i], b[i], `pixel byte ${i}`)
}

const ids = FeatureImage.order
assert.deepEqual(ids, ['duotone', 'wash', 'signal'])
assert.equal(ids.includes(FeatureImage.locked), true)
assert.equal(FeatureImage.list().length, 3)
assert.equal(FeatureImage.ink.red, '#C62828')
assert.equal(FeatureImage.ink.green, '#2E7D32')
assert.equal(FeatureImage.ink.blue, '#1565C0')
assert.equal(FeatureImage.ink.navy, '#1E3A8A')

const card = FeatureImage.size('card')
const hero = FeatureImage.size('hero')
const square = FeatureImage.size('square')
assert.deepEqual([card.width, card.height], [1200, 630])
assert.deepEqual([hero.width, hero.height], [2400, 1260])
assert.equal(hero.width / hero.height, card.width / card.height)
assert.deepEqual([square.width, square.height], [1080, 1080])
assert.deepEqual(FeatureImage.preview(hero), { width: 1400, height: 735 })

assert.equal(
  FeatureImage.filename('What the Mixing Hides', 'signal', 'hero', 'jpeg'),
  'what-the-mixing-hides-signal-hero.jpg'
)
assert.equal(
  FeatureImage.filename('  ', 'duotone', 'card', 'webp'),
  'aim-feature-duotone-card.webp'
)
assert.equal(FeatureImage.slug('../Etc/Pass'), 'etc-pass')

const wide = FeatureImage.cover(400, 200, 100, 100, 0.5, 0.5)
assert.equal(wide.x, 50)
assert.equal(wide.y, 0)
const left = FeatureImage.cover(400, 200, 100, 100, 0, 0.5)
assert.equal(left.x, 0)
const right = FeatureImage.cover(400, 200, 100, 100, 1, 0.5)
assert.equal(right.x, 100)

const width = 32
const height = 24
const source = fill(width, height, (x, y) => [
  Math.round((x / (width - 1)) * 255),
  Math.round((y / (height - 1)) * 255),
  80,
  255
])

for (const id of ids) {
  const once = source.slice()
  const twice = source.slice()
  const preset = FeatureImage.preset(id)
  FeatureImage.treat(once, width, height, preset, preset.strength)
  FeatureImage.treat(twice, width, height, preset, preset.strength)
  same(once, twice)
  for (let i = 0; i < once.length; i++) {
    assert.equal(Number.isFinite(once[i]), true)
  }
}

const black = fill(4, 4, () => [0, 0, 0, 255])
FeatureImage.treat(black, 4, 4, FeatureImage.preset('duotone'), 1)
const navy = FeatureImage.rgb(FeatureImage.ink.navy)
assert.deepEqual(at(black, 4, 0, 0), [navy.r, navy.g, navy.b, 255])

const white = fill(4, 4, () => [255, 255, 255, 255])
FeatureImage.treat(white, 4, 4, FeatureImage.preset('duotone'), 1)
const [wr, wg, wb] = at(white, 4, 1, 1)
assert.ok(
  wr > wg + 80 && wr > wb + 80,
  `white duotone should go red, got ${wr},${wg},${wb}`
)

const untouched = fill(6, 4, (x, y) => [x * 20, y * 30, 40, 255])
const original = untouched.slice()
FeatureImage.treat(untouched, 6, 4, FeatureImage.preset('signal'), 0)
same(untouched, original)

const mono = fill(40, 8, () => [255, 255, 255, 255])
FeatureImage.treat(mono, 40, 8, FeatureImage.preset('signal'), 1)
const red = FeatureImage.rgb(FeatureImage.ink.red)
assert.deepEqual(at(mono, 40, 0, 0), [red.r, red.g, red.b, 255])
const paper = at(mono, 40, 20, 4)
assert.ok(
  Math.abs(paper[0] - paper[1]) < 8 && Math.abs(paper[1] - paper[2]) < 8,
  'signal highlights stay neutral'
)
const shadow = fill(40, 8, () => [0, 0, 0, 255])
FeatureImage.treat(shadow, 40, 8, FeatureImage.preset('signal'), 1)
const dark = at(shadow, 40, 20, 4)
assert.ok(dark[0] > dark[1] + 40, 'signal shadows take the red accent')

const grainA = fill(12, 12, () => [140, 140, 140, 255])
const grainB = grainA.slice()
FeatureImage.treat(grainA, 12, 12, FeatureImage.preset('wash'), 1)
FeatureImage.treat(grainB, 12, 12, FeatureImage.preset('wash'), 1)
same(grainA, grainB)
assert.equal(
  grainA.every((value, index) => value === grainB[index]),
  true
)
let varied = false
for (let x = 1; x < 12; x++) {
  if (at(grainA, 12, x, 6)[0] !== at(grainA, 12, 0, 6)[0]) varied = true
}
assert.equal(varied, true, 'wash grain is visible and fixed')

const transparent = fill(2, 2, () => [0, 0, 0, 0])
FeatureImage.treat(transparent, 2, 2, FeatureImage.preset('duotone'), 0)
assert.deepEqual(at(transparent, 2, 0, 0), [255, 255, 255, 255])

const duotoneMid = fill(2, 2, () => [128, 128, 128, 255])
const signalMid = duotoneMid.slice()
FeatureImage.treat(duotoneMid, 2, 2, FeatureImage.preset('duotone'), 1)
FeatureImage.treat(signalMid, 2, 2, FeatureImage.preset('signal'), 1)
assert.notEqual(
  at(duotoneMid, 2, 1, 1).slice(0, 3).join(),
  at(signalMid, 2, 1, 1).slice(0, 3).join()
)

assert.equal(
  FeatureImage.grain(3, 9, 0x41494d),
  FeatureImage.grain(3, 9, 0x41494d)
)
assert.ok(Math.abs(FeatureImage.grain(3, 9, 0x41494d)) <= 1)

const page = readFileSync('app/tools/feature-image/page.tsx', 'utf8')
assert.equal(page.includes('index: false'), true)
assert.equal(page.includes('follow: false'), true)
const header = readFileSync('components/header.tsx', 'utf8')
assert.equal(header.includes('/tools/feature-image'), false)
const sitemap = readFileSync('app/sitemap.xml/route.ts', 'utf8')
assert.equal(sitemap.includes('/tools'), false)
const search = readFileSync('scripts/generate-search-index.js', 'utf8')
assert.equal(search.includes("url.startsWith('/tools/')"), true)
assert.equal(CrawlerPolicy.disallow.includes('/tools'), true)

const html = readFileSync('public/tools/aim-feature-image.html', 'utf8')
assert.equal(html.includes('never uploaded'), true)
assert.equal(html.includes(FeatureImage.preset(FeatureImage.locked).name), true)
assert.equal(html.includes('noindex'), true)
assert.equal(html.includes('<script src='), false)
assert.equal(html.includes('fetch('), false)
assert.equal(html.includes('XMLHttpRequest'), false)

const sources = [
  'lib/feature-image.ts',
  'lib/feature-image-app.ts',
  'app/tools/feature-image/page.tsx',
  'components/feature-image-tool.tsx',
  'public/tools/aim-feature-image.html'
]
for (const file of sources) {
  const text = readFileSync(file, 'utf8')
  assert.equal(text.includes('\u2014'), false, `${file} has an em dash`)
  assert.equal(text.includes('\u2013'), false, `${file} has an en dash`)
}

console.log('feature image checks passed')
