import { readFileSync } from 'fs'
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
  explained.includes('<h3>The Object need not lie outside the Individual.</h3>'),
  'an explanation label is its own sub-heading'
)
assert(
  explained.includes('<em>develop a capacity</em>'),
  'explanation italics are kept'
)

const critical = GlossaryProse.html(
  '**Critical Loop Gain ($G_{crit}$).** The Critical Loop Gain $G_{crit}$ is the threshold value of the internal loop gain $G = \\kappa_S \\cdot \\beta \\cdot \\gamma \\cdot \\sigma\'(V^{*})$.'
)
assert(
  critical.includes('<h3>') && critical.includes('Critical Loop Gain'),
  'the pop-up and the term page give the label its own sub-heading'
)
assert(
  critical.includes('<math') && critical.includes('G_{crit}'),
  'the term page typesets G_crit as MathML'
)
assert(!critical.includes('**') && !critical.includes('$G_'), 'rendered prose has no raw markers')

const admiration =
  'Admiration is what you feel when you watch a master. **Diagnostic.** Does observing the Model make you want to *develop a capacity*? **Why hatred cannot ground Admiration.** Hatred-grounded fascination produces M-escalation.'
const admirationHtml = GlossaryProse.html(admiration)
assert(
  admirationHtml.includes('<h3>Diagnostic.</h3>') &&
    admirationHtml.includes('<h3>Why hatred cannot ground Admiration.</h3>'),
  'joined sub-section labels become headings'
)
assert(
  admirationHtml.includes('<em>develop a capacity</em>?'),
  'italics inside a sub-section stay, and the sentence keeps its question mark'
)
assert(
  admirationHtml.includes('watch a master.'),
  'the sentence before a sub-section keeps its full stop'
)
assert(
  admirationHtml.indexOf('<h3>Diagnostic.</h3>') <
    admirationHtml.indexOf('<h3>Why hatred cannot ground Admiration.</h3>'),
  'sub-sections stay in chapter order'
)
const whole = GlossaryProse.html(
  '**Admiration is the Positive Mimesis response, and it transmits *wanting-to-develop* rather than *wanting-what-the-Model-has*.**'
)
assert(whole.includes('<strong>'), 'a fully bold definition stays bold')
assert(!whole.includes('<h3>'), 'a fully bold definition is not split into a heading')

const termPage = readFileSync('app/glossary/[slug]/page.tsx', 'utf8')
const popup = readFileSync('components/glossary-lookup.tsx', 'utf8')
assert(
  termPage.includes('<GlossaryProseView') &&
    termPage.includes('text={entry.definition}'),
  'the term page renders the stored definition with GlossaryProse'
)
assert(
  popup.includes('<GlossaryProseView') &&
    popup.includes('text={entry.definition}'),
  'the pop-up renders the stored definition with GlossaryProse'
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
