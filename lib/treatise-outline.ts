import { bodyLabelId, headingSectionId } from '@/lib/treatise-citations'

/** Section ids and menu labels for a rendered treatise chapter. */
export class TreatiseOutline {
  static readonly labelLimit = 140

  /** Section ids claimed by real headings, so a preview paragraph cannot take them. */
  static headingSectionIds(markdown: string): Set<string> {
    const ids = new Set<string>()
    let fenced = false
    for (const line of markdown.split('\n')) {
      if (line.startsWith('```')) {
        fenced = !fenced
        continue
      }
      if (fenced) continue
      const heading = line.match(/^(#{1,6})[ \t]+(.+)$/)
      if (!heading) continue
      const text = heading[2].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
      const id = headingSectionId(text)
      if (id) ids.add(id)
    }
    return ids
  }

  /**
   * The bold lead-in of a body label, through the first full stop.
   * The dots inside the section number are not that stop.
   */
  static leadIn(plain: string): string {
    const text = plain.replace(/\s+/g, ' ').trim()
    const label = bodyLabelId(text)
    const from =
      label && text.toLowerCase().startsWith(label) ? label.length : 0
    const stop = text.slice(from).search(/[.!?](?=\s|$)/)
    if (stop < 0) return text
    return text.slice(0, from + stop + 1).trim()
  }

  /** A cap for the menu, so a long label cannot fill it. */
  static display(text: string): string {
    const flat = text.replace(/\s+/g, ' ').trim()
    if (flat.length <= TreatiseOutline.labelLimit) return flat
    return `${flat.slice(0, TreatiseOutline.labelLimit - 1).trimEnd()}…`
  }
}
