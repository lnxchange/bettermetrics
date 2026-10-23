import { prepareTreatiseMarkdown } from '../lib/treatise-render'
import { extractTreatiseSection } from '../lib/treatise-section'
import {
  buildCorpusIndex,
  composeRedirects,
  diffChapterSections,
  indexChapter,
  linkifyTreatiseMarkdown
} from '../lib/treatise-citations'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const chapter = `
## 14.1 - The Order Effect

A sentence about 4.5 million people.

**12.2.1 Title of the bold label**

More prose.

A.11.1 Definition. The body label opens the paragraph.

## Appendix 8F: Anticipated Critiques

The critiques live in this chapter.
`

const sections = indexChapter('8', chapter)
const ids = sections.map(section => section.id)
assert(ids.includes('14.1'), 'a dashed heading is a section')
assert(ids.includes('12.2.1'), 'a bold label is a section')
assert(ids.includes('a.11.1'), 'a body label is a section')
assert(!ids.includes('4.5'), '4.5 million is not a section')
assert(ids.includes('8f'), 'an appendix heading inside a chapter is a section')

const index = buildCorpusIndex([{ slug: '8', markdown: chapter }])
assert(index.owners['8f'] === '8', 'appendix 8F belongs to chapter 8')
assert(index.sections['a.11.1'].slug === '8', 'the body label is owned by the chapter')

const linked = linkifyTreatiseMarkdown('See Section 14.1 and Appendix 8F and Appendix 9Z.', { index })
assert(linked.includes('](/treatise/8#14.1)'), 'a live section is linked')
assert(linked.includes('](/treatise/8#8f)'), 'an in-chapter appendix is linked to its chapter')
assert(!linked.includes('9z') && !linked.includes('9Z]'), 'a missing appendix stays text')
assert(linked.includes('Appendix 9Z'), 'the missing appendix words remain')

const moved = linkifyTreatiseMarkdown('See Section 13.10.1.', {
  index,
  history: { '13.10.1': { slug: '13', section: '13.9.1' } }
})
assert(moved.includes('See Section 13.10.1'), 'the original words stay')
assert(!moved.includes('#13.9.1'), 'a move is not followed when the destination is not in this book')

const book = buildCorpusIndex([
  { slug: '8', markdown: chapter },
  { slug: '13', markdown: '## 13.9.1 The stability condition\n\nText.\n' }
])
const followed = linkifyTreatiseMarkdown('See Section 13.10.1.', {
  index: book,
  history: { '13.10.1': { slug: '13', section: '13.9.1' } }
})
assert(followed.includes('](/treatise/13#13.9.1)'), 'a moved section opens where it is now')
assert(followed.includes('Section 13.10.1'), 'the citation keeps the words it was given')

const removed = linkifyTreatiseMarkdown('See Section 13.10.1.', {
  index: book,
  history: { '13.10.1': { slug: '13', section: null } }
})
assert(removed.includes('The treatise has been updated since this chat.'), 'a removed section says the book changed')
assert(removed.includes('](/treatise/13)'), 'the note links to the chapter')
assert(!removed.includes('#13.10.1'), 'a removed section is not an anchor')

const renumbered = diffChapterSections(
  '13',
  '## 13.10.1 The stability condition\n\nThe same body.\n',
  '## 13.9.1 The stability condition\n\nThe same body.\n'
)
assert(renumbered.moves.length === 1, 'a renamed heading with the same title is a move')
assert(renumbered.moves[0].fromSection === '13.10.1' && renumbered.moves[0].toSection === '13.9.1', 'the move records both numbers')
assert(renumbered.deletions.length === 0, 'a move is not also a deletion')

const deleted = diffChapterSections('13', '## 13.10.1 The stability condition\n\nGone.\n', '## 13.9.2 Something else\n\nNew.\n')
assert(deleted.deletions.some(change => change.fromSection === '13.10.1'), 'an unmatched section is a removal')

const prepared = prepareTreatiseMarkdown(chapter, index)
assert(prepared.html.includes('id="14.1"'), 'the heading is anchored')
assert(prepared.html.includes('id="12.2.1"'), 'the bold label is anchored')
assert(prepared.html.includes('id="a.11.1"'), 'the body label is anchored')
assert(prepared.html.includes('id="8f"'), 'the in-chapter appendix is anchored')
const slice = extractTreatiseSection(prepared.html, prepared.headings, 'a.11.1')
assert(Boolean(slice?.html.includes('A.11.1')), 'the panel can slice a body label')
assert(Boolean(slice && !slice.html.includes('Appendix 8F')), 'the slice stops at the next section')

const redirects = composeRedirects(
  [
    { from_section: '13.10.1', from_slug: '13', to_section: '13.9.1', to_slug: '13' },
    { from_section: '13.9.1', from_slug: '13', to_section: '20.2.1', to_slug: '20' }
  ],
  buildCorpusIndex([{ slug: '20', markdown: '## 20.2.1 The stability condition\n\nText.\n' }])
)
assert(redirects['13.10.1']?.section === '20.2.1', 'two publishes chain to the current section')
assert(redirects['13.10.1']?.slug === '20', 'the chain keeps the chapter that holds it now')

console.log('treatise section tests passed')
