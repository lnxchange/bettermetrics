import { CrmOAuthConsent } from './consent'

export const dynamic = 'force-dynamic'

export default function Page({
  searchParams
}: {
  searchParams: { authorization_id?: string }
}) {
  return (
    <CrmOAuthConsent authorizationId={searchParams.authorization_id || ''} />
  )
}
