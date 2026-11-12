'use client'

import { useState } from 'react'

export function InviteRedeem({ token, masked }: { token: string; masked: string }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    setSending(true)
    setError('')
    const response = await fetch('/api/invite/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    const data = await response.json().catch(() => ({}))
    setSending(false)
    if (!response.ok) {
      setError(data.error || 'Could not send the sign-in link.')
      return
    }
    setMessage(data.message || `We've sent a sign-in link to ${masked}. Open it to start using Ask the AI.`)
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Your invitation to Ask the AI</h1>
      <p className="mt-3 text-sm text-slate-600">
        The sign-in link goes to {masked}. A forwarded page still only signs in that person.
      </p>
      {message ? <p className="mt-6 text-sm text-emerald-700">{message}</p> : (
        <button
          className="mt-6 rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="button"
          disabled={sending}
          onClick={send}
        >
          Email me the sign-in link
        </button>
      )}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </main>
  )
}
