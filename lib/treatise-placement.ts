import { TreatiseAddress } from '@/lib/treatise-address'
import { CorpusIndex } from '@/lib/treatise-citations'

/**
 * Public chapter numbers after 261123, matched by title.
 * Until the publish writes the new files, Money is still stored as 12,
 * Bayesian Belief Dynamics as 13, and Quantum Epistemology as 14.
 * Reading the public number straight through would put Quantum Epistemology
 * at /treatise/chapter-14, and the redirect from /treatise/12 would follow it.
 * Once each title sits at its new number, this class changes nothing.
 */

interface Titled {
  slug: string
  title: string
}

interface Presented {
  slug: string
  title: string
  label: string
  part: 'I' | 'II' | 'appendix'
  position: number
  href: string
}

export class TreatisePlacement {
  static readonly money =
    'Money, Debt and the Architecture of Mimetic Extraction'
  static readonly bayesian = 'Bayesian Belief Dynamics'
  static readonly quantum = 'Quantum Epistemology'

  /** Public chapter number for a stored title, or null when the title is another work. */
  static work(title: string): '12' | '13' | '14' | null {
    if (title.startsWith(TreatisePlacement.money)) return '14'
    if (title.startsWith(TreatisePlacement.bayesian)) return '12'
    if (title.startsWith(TreatisePlacement.quantum)) return '13'
    return null
  }

  /** Stored slug to read for a public chapter number. */
  static storedSlug(publicNumber: string, rows: readonly Titled[]): string {
    if (
      publicNumber !== '12' &&
      publicNumber !== '13' &&
      publicNumber !== '14'
    ) {
      return publicNumber
    }
    const direct = rows.find(row => row.slug === publicNumber)
    if (direct && TreatisePlacement.work(direct.title) === publicNumber)
      return publicNumber
    const held = rows.find(
      row => TreatisePlacement.work(row.title) === publicNumber
    )
    return held?.slug ?? publicNumber
  }

  /** Label, order and address of a stored row, using the public number when the row has not moved. */
  static present<T extends Presented>(row: T): T {
    const number = TreatisePlacement.work(row.title)
    if (!number || row.slug === number) return row
    const value = Number(number)
    return {
      ...row,
      label: `Chapter ${number}`,
      position: value,
      part: value <= 14 ? 'I' : 'II',
      href: TreatiseAddress.publicPath(number)
    }
  }

  /**
   * Citation targets follow the public number. Section 12.2 stored under
   * the Money row links to /treatise/chapter-14 while that row is still
   * slug 12, and to /treatise/chapter-12 once the publish has moved it.
   */
  static apply(index: CorpusIndex, rows: readonly Titled[]): CorpusIndex {
    const remap = new Map<string, string>()
    for (const row of rows) {
      const number = TreatisePlacement.work(row.title)
      if (number && number !== row.slug) remap.set(row.slug, number)
    }
    if (remap.size === 0) return index
    const slugOf = (slug: string) => remap.get(slug) ?? slug
    const sections: CorpusIndex['sections'] = {}
    for (const [id, section] of Object.entries(index.sections)) {
      sections[id] = { slug: slugOf(section.slug), text: section.text }
    }
    const owners: CorpusIndex['owners'] = {}
    for (const [key, slug] of Object.entries(index.owners)) {
      owners[key] = slugOf(slug)
    }
    return { sections, owners, chapters: index.chapters.map(slugOf) }
  }
}
