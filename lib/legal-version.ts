/**
 * The version of the Terms of Use and the Privacy Policy.
 *
 * Set `publicationDate` to the go-live date before these pages are published,
 * in the form "23 November 2026". Acceptance records store this string.
 * Leave it empty until that date is chosen. Do not put the date anywhere else.
 */
export class LegalVersion {
  static readonly publicationDate = ''

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
