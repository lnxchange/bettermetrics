/** Frontmatter treatise_refs, turned into site links. */
export class TreatiseRefLink {
  static href(ref: string) {
    const value = ref.trim()
    const chapter = value.match(/^chapter\s+(\d+)$/i)
    if (chapter) {
      const number = String(Number(chapter[1]))
      return number === '2' ? '/glossary' : `/treatise/${number}`
    }
    const appendix = value.match(/^appendix\s+([0-9]+[A-Za-z]|[A-Za-z])$/i)
    if (appendix) return `/treatise/appendix-${appendix[1].toLowerCase()}`
    const numbered = value.match(/^(\d+[A-Za-z]?(?:\.\d+)+)$/)
    if (numbered) {
      const head = numbered[1].match(/^(\d+)/)
      if (!head) return null
      return `/treatise/${Number(head[1])}#${numbered[1].toLowerCase()}`
    }
    const lettered = value.match(/^([A-Za-z](?:\.\d+)+)$/)
    if (lettered) return `/treatise/appendix-${lettered[1][0].toLowerCase()}#${lettered[1].toLowerCase()}`
    return null
  }
}
