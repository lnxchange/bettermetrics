/**
 * Rebuild the favicon files from the header wordmark.
 *   npx tsx scripts/build-aim-icons.ts
 */
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'

import { AimIcon } from '../lib/aim-icon'
import { AimIconFile } from '../lib/aim-icon-file'

const root = path.join(__dirname, '..')

const files: [string, Buffer][] = [
  ['public/favicon.ico', AimIconFile.ico()],
  ['public/apple-icon.png', AimIconFile.png(180)],
  ['public/icon-16.png', AimIconFile.png(16)],
  ['public/icon-32.png', AimIconFile.png(32)],
  ['public/icon-192.png', AimIconFile.png(192)],
  ['public/icon-512.png', AimIconFile.png(512)]
]

for (const [rel, bytes] of files) {
  const dest = path.join(root, rel)
  mkdirSync(path.dirname(dest), { recursive: true })
  writeFileSync(dest, bytes)
  process.stdout.write(`${rel} ${bytes.length} bytes\n`)
}

const word = AimIcon.fitted(AimIcon.wordmarkBounds(), 16)
const letter = AimIcon.fitted(AimIcon.letterBounds(), 16)
process.stdout.write(
  `16px wordmark would be ${word.width.toFixed(1)}×${word.height.toFixed(
    1
  )}; the A is ${letter.width.toFixed(1)}×${letter.height.toFixed(1)}\n`
)
