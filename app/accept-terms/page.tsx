'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ConsentFields } from '@/components/consent-fields'

function safeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export default function AcceptTermsPage() {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [updates, setUpdates] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!accepted) {
      setError('Tick the box to agree to the Terms of Use and Privacy Policy.')
      return
    }
    setSaving(true)
    setError('')
    const response = await fetch('/api/account/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepted: true, updatesOptIn: updates })
    })
    const data = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Could not save your acceptance.')
      return
    }
    const next = safeNext(new URLSearchParams(window.location.search).get('redirectedFrom'))
    router.push(next)
    router.refresh()
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-theme(spacing.16))] max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Terms and privacy</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        The Terms of Use and Privacy Policy have been updated. Please read them and accept them before you continue.
        Updates stay off unless you tick the second box.
      </p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <ConsentFields accepted={accepted} updates={updates} onAccepted={setAccepted} onUpdates={setUpdates} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={saving || !accepted}
        >
          Continue
        </button>
      </form>
    </div>
  )
}
