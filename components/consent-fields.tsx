import Link from 'next/link'

export function ConsentFields({
  accepted,
  updates,
  onAccepted,
  onUpdates
}: {
  accepted: boolean
  updates: boolean
  onAccepted: (value: boolean) => void
  onUpdates: (value: boolean) => void
}) {
  return (
    <div className="space-y-3 text-sm text-slate-700">
      <label className="flex items-start gap-2">
        <input
          className="mt-1"
          type="checkbox"
          name="accepted"
          checked={accepted}
          onChange={event => onAccepted(event.target.checked)}
        />
        <span>
          I am 18 or over and I agree to the <Link href="/terms" className="underline">Terms of Use</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </span>
      </label>
      <label className="flex items-start gap-2">
        <input
          className="mt-1"
          type="checkbox"
          name="updates"
          checked={updates}
          onChange={event => onUpdates(event.target.checked)}
        />
        <span>Email me updates about the development of the AIM Framework.</span>
      </label>
    </div>
  )
}
