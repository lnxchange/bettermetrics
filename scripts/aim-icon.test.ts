import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { AIM_SOURCE_COLORS } from '../lib/aim-colors'
import { AimIcon } from '../lib/aim-icon'
import { AimIconFile } from '../lib/aim-icon-file'
import { AimWordmark } from '../lib/aim-wordmark'

const root = path.join(__dirname, '..')

const letter = AimIcon.letterBounds()
const word = AimIcon.wordmarkBounds()

assert.ok(
  Math.abs(letter.width / letter.height - 698 / 714) < 0.001,
  'A bounds follow the header path'
)
assert.ok(
  word.width / word.height > 2.2,
  'AIM wordmark is much wider than it is tall'
)

// Fitted with one scale, the wordmark at tab size is a few pixels tall.
for (const size of [16, 32]) {
  const fitted = AimIcon.fitted(word, size)
  assert.ok(
    Math.abs(fitted.width / fitted.height - word.width / word.height) < 1e-9
  )
  assert.ok(
    fitted.height < size * 0.4,
    `AIM at ${size}px is ${fitted.height.toFixed(
      1
    )}px tall, not a readable word`
  )
  const mark = AimIcon.fitted(letter, size)
  assert.equal(mark.scale, AimIcon.placement(size).scale)
  assert.ok(mark.height > size * 0.7, `the A at ${size}px keeps its height`)
  assert.ok(
    Math.abs(mark.width / mark.height - letter.width / letter.height) < 1e-9
  )
}

const place = AimIcon.placement(32)
assert.equal(place.x, (32 - AimIcon.fitted(letter, 32).width) / 2)
assert.ok(place.scale > 0)

const svg = AimIcon.svg(32)
assert.equal(svg.includes('scale(') && !svg.includes('scale(1,'), true)
assert.ok(svg.includes(`scale(${place.scale})`))
assert.ok(svg.includes(`fill="${AIM_SOURCE_COLORS.appetites}"`))
assert.ok(svg.includes(AimWordmark.letters.appetites))
assert.equal((svg.match(/scale\(/g) || []).length, 1)

function opaque(pixels: Uint8Array, size: number, x: number, y: number) {
  const i = (y * size + x) * 4
  return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
}

function isWhite(pixel: number[]) {
  return (
    pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255 && pixel[3] === 255
  )
}

function isRed(pixel: number[]) {
  return (
    pixel[0] === 0xc6 &&
    pixel[1] === 0x28 &&
    pixel[2] === 0x28 &&
    pixel[3] === 255
  )
}

/** Any pixel that is not the white ground, including antialiased edges. */
function isInk(pixel: number[]) {
  return pixel[0] < 250 || pixel[1] < 250 || pixel[2] < 250
}

for (const size of [16, 32, 48, 180]) {
  const pixels = AimIcon.pixels(size)
  assert.equal(pixels.length, size * size * 4)
  for (let i = 0; i < size; i++) {
    assert.ok(isWhite(opaque(pixels, size, i, 0)), `top edge of ${size}`)
    assert.ok(
      isWhite(opaque(pixels, size, i, size - 1)),
      `bottom edge of ${size}`
    )
    assert.ok(isWhite(opaque(pixels, size, 0, i)), `left edge of ${size}`)
    assert.ok(
      isWhite(opaque(pixels, size, size - 1, i)),
      `right edge of ${size}`
    )
  }

  let minX = size
  let minY = size
  let maxX = -1
  let maxY = -1
  let red = 0
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixel = opaque(pixels, size, x, y)
      if (isRed(pixel)) red++
      if (!isInk(pixel)) continue
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  assert.ok(red > 0, `a solid sample of #C62828 at ${size}`)
  const width = maxX - minX + 1
  const height = maxY - minY + 1
  // One pixel of rounding. The letter is nearly square; a stretched wordmark is not.
  const expectedWidth = (letter.width / letter.height) * height
  assert.ok(
    Math.abs(width - expectedWidth) <= 1.5,
    `${size}px ink is ${width}x${height}, expected width ${expectedWidth.toFixed(
      1
    )}`
  )
  assert.ok(
    width / height < 1.2,
    `${size}px ink aspect ${width / height} is stretched`
  )

  // The counter is white pixels the letter fully encloses.
  const outside = new Uint8Array(size * size)
  const stack: number[] = []
  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const at = y * size + x
    if (outside[at] || isInk(opaque(pixels, size, x, y))) return
    outside[at] = 1
    stack.push(at)
  }
  for (let i = 0; i < size; i++) {
    push(i, 0)
    push(i, size - 1)
    push(0, i)
    push(size - 1, i)
  }
  while (stack.length) {
    const at = stack.pop() as number
    const x = at % size
    const y = (at - x) / size
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
  let hole = 0
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!outside[y * size + x] && !isInk(opaque(pixels, size, x, y))) hole++
    }
  }
  assert.ok(hole > 0, `the counter of the A is open at ${size}px`)
}

const ico = AimIconFile.ico()
assert.equal(ico.readUInt16LE(0), 0)
assert.equal(ico.readUInt16LE(2), 1)
assert.equal(ico.readUInt16LE(4), 3)
const seen: number[] = []
for (let i = 0; i < 3; i++) {
  const size = ico[6 + i * 16]
  seen.push(size)
  const length = ico.readUInt32LE(6 + i * 16 + 8)
  const offset = ico.readUInt32LE(6 + i * 16 + 12)
  const embedded = ico.subarray(offset, offset + length)
  assert.deepEqual(Buffer.from(embedded), AimIconFile.png(size))
}
assert.deepEqual(seen, [16, 32, 48])

const committed: [string, Buffer][] = [
  ['public/favicon.ico', AimIconFile.ico()],
  ['public/apple-icon.png', AimIconFile.png(180)],
  ['public/icon-16.png', AimIconFile.png(16)],
  ['public/icon-32.png', AimIconFile.png(32)],
  ['public/icon-192.png', AimIconFile.png(192)],
  ['public/icon-512.png', AimIconFile.png(512)]
]
for (const [rel, bytes] of committed) {
  const file = path.join(root, rel)
  assert.equal(existsSync(file), true, rel)
  assert.deepEqual(readFileSync(file), bytes, `${rel} drifted from AimIcon`)
}

for (const stale of [
  'app/icon.png',
  'app/favicon.ico',
  'app/apple-icon.png',
  'public/aim-icon-16.png',
  'public/aim-icon-32.png',
  'public/apple-touch-icon.png'
]) {
  assert.equal(
    existsSync(path.join(root, stale)),
    false,
    `${stale} would override the new icons`
  )
}

const layout = readFileSync(path.join(root, 'app/layout.tsx'), 'utf8')
assert.equal(layout.includes('aim-icon-'), false)
assert.equal(layout.includes('apple-touch-icon'), false)
assert.equal(layout.includes('shortcut:'), false)
assert.ok(layout.includes('/favicon.ico'))
assert.ok(layout.includes('/icon-16.png'))
assert.ok(layout.includes('/icon-32.png'))
assert.ok(layout.includes('/apple-icon.png'))
assert.equal(layout.split("url: '/icon-16.png'").length, 2)
assert.equal(layout.split("url: '/icon-32.png'").length, 2)
assert.equal(layout.split("url: '/favicon.ico'").length, 2)
assert.equal(layout.split("url: '/apple-icon.png'").length, 2)

const manifest = readFileSync(path.join(root, 'app/manifest.ts'), 'utf8')
assert.ok(manifest.includes('/icon-192.png'))
assert.ok(manifest.includes('/icon-512.png'))

const crm = readFileSync(path.join(root, 'crm/index.html'), 'utf8')
assert.equal(crm.includes('aim-icon-'), false)
assert.equal(crm.includes('apple-touch-icon.png'), false)
assert.ok(crm.includes('rel="apple-touch-icon" href="/apple-icon.png"'))
assert.ok(crm.includes('/icon-16.png'))

const mark = readFileSync(path.join(root, 'components/aim-mark.tsx'), 'utf8')
assert.ok(mark.includes('AimWordmark.letters.appetites'))
assert.ok(mark.includes('AimWordmark.letters.intrinsic'))
assert.ok(mark.includes('AimWordmark.letters.mimetic'))

console.log('aim icon tests passed')
