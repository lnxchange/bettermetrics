import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const directory = 'scripts'
const files = readdirSync(directory)
  .filter(name => name.endsWith('.test.ts'))
  .sort()

if (files.length === 0) {
  console.error('no test files in scripts/')
  process.exit(1)
}

let failed = 0
for (const name of files) {
  const result = spawnSync(
    process.execPath,
    ['--import', 'tsx', path.join(directory, name)],
    { stdio: 'inherit' }
  )
  if (result.status !== 0) {
    failed += 1
    console.error(`failed: ${name}`)
  }
}

if (failed > 0) {
  console.error(`${failed} test file${failed === 1 ? '' : 's'} failed`)
  process.exit(1)
}

console.log(`${files.length} test files passed`)
