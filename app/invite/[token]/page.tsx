import { findInviteByToken, inviteBlockReason, maskEmail } from '@/lib/chat-invites'
import { InviteRedeem } from '@/components/invite-redeem'

export const metadata = { robots: { index: false, follow: false } }

export default async function InvitePage({ params }: { params: { token: string } }) {
  const row = await findInviteByToken(params.token)
  if (!row) {
    return <InviteMessage title="This invitation is not valid." />
  }
  const blocked = inviteBlockReason(row)
  if (blocked) return <InviteMessage title={blocked} />
  return <InviteRedeem token={params.token} masked={maskEmail(row.email)} />
}

function InviteMessage({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    </main>
  )
}
