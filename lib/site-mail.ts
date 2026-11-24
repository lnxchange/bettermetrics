/**
 * Every email the site sends through Resend uses this address.
 * Set RESEND_FROM to override the sender. The contact inbox is fixed in code.
 */
export class SiteMail {
  static readonly address = 'AIM Theory <notifications@aimtheory.org>'
  static readonly inbox = 'info@aimtheory.org'

  static from(): string {
    const override = process.env.RESEND_FROM?.trim()
    return override || SiteMail.address
  }
}
