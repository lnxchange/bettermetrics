/**
 * Formal definitions on the architecture page.
 *
 * Each one is the function-only specification of that component's section in
 * the published Chapter 4. The paragraph is taken whole, including its label
 * and any TeX, so the page cannot drift onto a shortened paraphrase.
 */

const LABEL = '**Function-only specification.**'

export class ArchitectureSpecifications {
  static of(markdown: string, sectionId: string) {
    const paragraph = ArchitectureSpecifications.paragraphs(
      ArchitectureSpecifications.sectionBody(markdown, sectionId)
    ).find(item => item.startsWith(LABEL))
    if (
      !paragraph ||
      paragraph === LABEL ||
      !paragraph.startsWith(`${LABEL} `)
    ) {
      throw new Error(
        `Chapter 4, Section ${sectionId} has no function-only specification.`
      )
    }
    return paragraph
  }

  private static sectionBody(markdown: string, sectionId: string) {
    const source = markdown.replace(/\r\n/g, '\n')
    const heading = /^(#{2,6})[ \t]+(\d+(?:\.\d+)*)\b[^\n]*$/gm
    const headings: { id: string; start: number; end: number }[] = []
    for (const match of Array.from(source.matchAll(heading))) {
      if (match.index == null) continue
      headings.push({
        id: match[2],
        start: match.index,
        end: match.index + match[0].length
      })
    }
    const found = headings.find(item => item.id === sectionId)
    if (!found) throw new Error(`Chapter 4 has no section ${sectionId}.`)
    const next = headings.find(item => item.start > found.start)
    return source.slice(found.end, next ? next.start : source.length)
  }

  private static paragraphs(body: string) {
    return body
      .split(/\n{2,}/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }
}
