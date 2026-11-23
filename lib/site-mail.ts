/**
 * Every email the site sends through Resend uses this address.
 * Set RESEND_FROM to override it.
 */
export class SiteMail {
  static readonly address = 'AIM Theory <notifications@aimtheory.org>'

  static from(): string {
    const override = process.env.RESEND_FROM?.trim()
    return override || SiteMail.address
  }
}
