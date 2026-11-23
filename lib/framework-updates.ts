import { SITE_URL } from '@/lib/site'
import { SiteMail } from '@/lib/site-mail'
import { UnsubscribeToken } from '@/lib/unsubscribe-token'

export class FrameworkUpdates {
  static message(input: { to: string; userId: string; subject: string; text: string }) {
    const unsubscribe = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(
      UnsubscribeToken.sign(input.userId, input.to)
    )}`
    const intro = 'Yule Guttenbeil, aimtheory.org'
    const text = `${intro}\n\n${input.text.trim()}\n\nUnsubscribe: ${unsubscribe}\n`
    const html = `<p>${intro}</p><p>${input.text.trim().replace(/\n/g, '<br>')}</p><p><a href="${unsubscribe}">Unsubscribe</a></p>`
    return {
      from: SiteMail.from(),
      to: [input.to],
      subject: input.subject,
      text,
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribe}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    }
  }
}
