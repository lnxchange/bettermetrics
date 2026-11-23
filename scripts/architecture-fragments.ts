/**
 * Fragments are not sent to the server, so a redirect from the retired page
 * keeps whatever came after #. Numbered ids and the old list id have no
 * element. Card slugs are real ids and are left for the browser.
 */
export class ArchitectureFragments {
  static readonly premises = '#construction-premises'

  static destination(hash: string): string | null {
    const raw = hash.replace(/^#/, '').trim().toLowerCase()
    if (!raw) return null
    if (
      /^axiom-\d+$/.test(raw) ||
      raw === 'axiom-list' ||
      raw === 'how-they-fit-together'
    ) {
      return ArchitectureFragments.premises
    }
    return null
  }
}
