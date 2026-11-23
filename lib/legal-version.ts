/**
 * The version of the Terms of Use and the Privacy Policy.
 *
 * `publicationDate` is the go-live date. Acceptance records store this string.
 * Do not put the date anywhere else.
 */
export class LegalVersion {
  static readonly publicationDate = '23 November 2026'

  static matches(
    row: {
      accepted_at?: string | null
      terms_version?: string | null
      privacy_version?: string | null
    } | null
    | undefined
  ): boolean {
    if (!row?.accepted_at) return false
    return (
      row.terms_version === LegalVersion.publicationDate &&
      row.privacy_version === LegalVersion.publicationDate
    )
  }
}
