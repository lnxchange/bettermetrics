/**
 * Write the self-contained offline copy of the feature-image tool.
 *   npx tsx scripts/build-feature-image-html.ts
 *
 * The photograph is processed inside that file. It does not call a server.
 */
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'

import { buildSync } from 'esbuild'

const root = path.join(__dirname, '..')
const bundled = buildSync({
  absWorkingDir: root,
  entryPoints: [path.join(root, 'scripts/feature-image-standalone.ts')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2018',
  write: false,
  legalComments: 'none',
  alias: { '@': root }
}).outputFiles[0].text

const script = bundled.replace(/<\/script/gi, '<\\/script')
const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>AIM feature image</title>
<style>html, body { margin: 0; background: #f4f4f5; }</style>
</head>
<body>
<!--
  Offline copy of the AIM feature-image tool.
  Generated from lib/feature-image.ts and lib/feature-image-app.ts.
  Rebuild with: npx tsx scripts/build-feature-image-html.ts
  The photograph is processed in this page. Nothing is uploaded.
-->
<div id="aim-feature-root"></div>
<script>
${script}
</script>
</body>
</html>
`

const dest = path.join(root, 'public/tools/aim-feature-image.html')
mkdirSync(path.dirname(dest), { recursive: true })
writeFileSync(dest, html)
process.stdout.write(
  `${path.relative(root, dest)} ${Buffer.byteLength(html)} bytes\n`
)
