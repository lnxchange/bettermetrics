/**
 * Where a Money-chapter section went in the 261124 rework.
 * The first key is the number the site has shown (Chapter 12). The same
 * tail with 14 in front is the number the 261123 renumber would have
 * published, which never became the live text. A live heading always wins,
 * so 14.1 stays the new introduction and 12.17 is not sent to 14.17.
 * 12.6 has no successor: the paragraph that stood there was replaced.
 * The new chapter has its own section 14.6, so a live heading of that id stays.
 */

const FROM_SITE: readonly (readonly [string, string | null])[] = [
  ['12.1', '14.2.1'],
  ['12.2', '14.2.2'],
  ['12.3', '14.2.5'],
  ['12.3.1', '14.2.3'],
  ['12.4', '14.2.6'],
  ['12.5', '14.2.7'],
  ['12.6', null],
  ['12.7', '14.3.1'],
  ['12.8', '14.3.2'],
  ['12.9', '14.3.4'],
  ['12.10', '14.3.3'],
  ['12.11', '14.3.5'],
  ['12.12', '14.4.1'],
  ['12.13', '14.4.2'],
  ['12.13.1', '14.4.3'],
  ['12.14', '14.4.4'],
  ['12.14.1', '14.9.1'],
  ['12.15', '14.4.5'],
  ['12.16', '14.4.6'],
  ['12.17', '14.5.1'],
  ['12.17.1', '14.5.2'],
  ['12.17.2', '14.5.3'],
  ['12.18', '14.6.3'],
  ['12.19', '14.6.4'],
  ['12.20', '14.6.5'],
  ['12.20.1', '14.6.1'],
  ['12.21', '14.6.6'],
  ['12.22', '14.6.7'],
  ['12.22.1', '14.6.8'],
  ['12.22.2', '14.7.1'],
  ['12.23', '14.7.1'],
  ['12.23.1', '14.7.2'],
  ['12.24', '14.7.3'],
  ['12.25', '14.7.4'],
  ['12.26', '14.7.5'],
  ['12.27', '14.9.2'],
  ['12.28', '14.8.1'],
  ['12.29', '14.8.2'],
  ['12.29.1', '14.8.3'],
  ['12.30', '14.8.4'],
  ['12.31', '14.8.5'],
  ['12.31.1', '14.8.6'],
  ['12.32', '14.8.7'],
  ['12.33', '14.9.3'],
  ['12.34', '14.10.1'],
  ['12.35', '14.10.2'],
  ['12.36', '14.10.3'],
  ['12.36.1', '14.10.3'],
  ['12.36.2', '14.10.6'],
  ['12.36.3', '14.10.4'],
  ['12.37', '14.10.5'],
  ['12.38', '14.10.7'],
  ['12.39', '14.10.8']
]

const successors = new Map<string, string | null>()
for (const [from, to] of FROM_SITE) {
  successors.set(from, to)
  successors.set(from.replace(/^12/, '14'), to)
}

export type MoneyArrival =
  | { kind: 'keep' }
  | { kind: 'move'; id: string }
  | { kind: 'top' }
  | { kind: 'ignore' }

export interface MoneySectionMove {
  from_section: string
  from_slug: string
  to_section: string | null
  to_slug: string
}

/** The reworked chapter is the page that carries section 14.2.1. */
const REWORKED = '14.2.1'

export class MoneySections {
  static successor(sectionId: string): string | null | undefined {
    return successors.get(MoneySections.normalise(sectionId))
  }

  /**
   * What to do with a fragment on the page that has these heading ids.
   * A heading that exists is left alone. A known old fragment moves only
   * when its new heading is on this page, so another chapter is not pulled
   * across. 12.6 opens the reworked chapter at the top. 14.6 does the same
   * only when the page has no heading of that id.
   */
  static arrival(
    fragment: string,
    headingIds: ReadonlySet<string>
  ): MoneyArrival {
    const id = MoneySections.normalise(fragment)
    if (!id) return { kind: 'ignore' }
    if (headingIds.has(id)) return { kind: 'keep' }
    if (!successors.has(id)) return { kind: 'ignore' }
    const next = successors.get(id) ?? null
    if (next === null) {
      return headingIds.has(REWORKED) ? { kind: 'top' } : { kind: 'ignore' }
    }
    if (headingIds.has(next)) return { kind: 'move', id: next }
    return { kind: 'ignore' }
  }

  /**
   * Hops for saved chats. A section that still exists is left to that
   * heading, because Bayesian Belief Dynamics now uses many 12.x numbers.
   * Append these after the publish's own moves so a deletion recorded
   * against the old chapter does not win.
   */
  static storedMoves(): MoneySectionMove[] {
    const moves: MoneySectionMove[] = []
    for (const [from, to] of Array.from(successors.entries())) {
      moves.push({
        from_section: from,
        from_slug: '14',
        to_section: to,
        to_slug: '14'
      })
    }
    return moves
  }

  private static normalise(fragment: string) {
    return fragment.trim().replace(/^#/, '').toLowerCase()
  }
}
