import { TreatiseAddress } from '@/lib/treatise-address'

/** Frontmatter treatise_refs, turned into the current treatise addresses. */
export class TreatiseRefLink {
  static href(ref: string) {
    const value = ref.trim()
    const chapter = value.match(/^chapter\s+(\d+)$/i)
    if (chapter) return TreatiseAddress.publicPath(String(Number(chapter[1])))
    const appendix = value.match(/^appendix\s+([0-9]+[A-Za-z]|[A-Za-z])$/i)
    if (appendix) return TreatiseAddress.publicPath(`appendix-${appendix[1].toLowerCase()}`)
    const numbered = value.match(/^(\d+[A-Za-z]?(?:\.\d+)+)$/)
    if (numbered) {
      const head = numbered[1].match(/^(\d+)/)
      if (!head) return null
      const path = TreatiseAddress.publicPath(String(Number(head[1])))
      if (path === '/glossary') return path
      return `${path}#${numbered[1].toLowerCase()}`
    }
    const lettered = value.match(/^([A-Za-z](?:\.\d+)+)$/)
    if (lettered) {
      const path = TreatiseAddress.publicPath(`appendix-${lettered[1][0].toLowerCase()}`)
      return `${path}#${lettered[1].toLowerCase()}`
    }
    return null
  }
}
