import { GlossaryProse } from '../lib/glossary-prose'
import { GlossaryPopover } from '../lib/glossary-popover'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const definition = [
  'Critical Coupling Strength ($\\kappa_c$) is the threshold where',
  '\\[ \\kappa_c = G_{crit}^{total}. \\]',
  'A plain comparison is G < 1, and G_crit stays written with underscores.',
  '',
  '- first check',
  '- second check'
].join('\n')

const explanation =
  'Below the threshold a group can still disagree. **The Object need not lie outside the Individual.** Seeing it can make you want to *develop a capacity*.'

const html = GlossaryProse.html(definition)
const explained = GlossaryProse.html(explanation)
const attack = GlossaryProse.html(
  'Before <script>alert(1)</script> after <img src=x onerror="alert(1)">.'
)
const linked = GlossaryProse.html(
  'See [Appendix A](https://aimtheory.org/treatise/appendix-a) and [bad](javascript:alert(1)).'
)

assert(html.includes('<math'), 'inline and display TeX become MathML')
assert(html.includes('κ'), 'kappa is typeset')
assert(
  !html.includes('\\[') && !html.includes('$\\kappa'),
  'TeX delimiters are not left as text'
)
assert(html.includes('G &lt; 1'), 'a comparison sign stays text')
assert(
  html.includes('G_crit'),
  'an undelimited G_crit is not turned into emphasis'
)
assert(
  !html.includes('<em>crit</em>'),
  'underscores in G_crit are not emphasis'
)
assert(
  !attack.includes('<script') && !attack.includes('alert(1)'),
  'script is removed with its contents'
)
assert(
  !attack.includes('<img') && !attack.includes('onerror'),
  'event-handler markup is removed'
)
assert(
  linked.includes('href="https://aimtheory.org/treatise/appendix-a"'),
  'an https link is kept'
)
assert(!/href="javascript:/i.test(linked), 'a javascript link is not kept')
assert(
  html.includes('<ul>') && html.includes('<li>'),
  'a markdown list becomes a list'
)
assert(
  explained.includes('<strong>') &&
    explained.includes('The Object need not lie outside the Individual.'),
  'explanation bold is kept'
)
assert(
  explained.includes('<em>develop a capacity</em>'),
  'explanation italics are kept'
)

const box = GlossaryPopover.reference({ x: 12, y: 640, width: 80, height: 18 })
const rect = box.getBoundingClientRect()
assert(
  rect.top === 640 &&
    rect.bottom === 658 &&
    rect.left === 12 &&
    rect.right === 92,
  'the anchor box is the term rectangle'
)

console.log('glossary prose tests passed')
