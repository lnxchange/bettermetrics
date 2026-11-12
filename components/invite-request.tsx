'use client'

import { FormEvent, useState } from 'react'

export function InviteRequest() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/invite/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        institution: form.get('institution'),
        interest: form.get('interest')
      })
    })
    const data = await response.json().catch(() => ({}))
    setSending(false)
    if (!response.ok) {
      setError(data.error || 'Could not send the request.')
      return
    }
    setMessage(data.message)
  }

  if (message) return <p className="mt-4 text-sm text-emerald-700">{message}</p>

  return (
    <form className="mt-4 space-y-3" onSubmit={submit}>
      <h3 className="text-sm font-medium">Request an invitation</h3>
      <input className="w-full rounded-md border px-3 py-2 text-sm" name="name" placeholder="Name" required />
      <input className="w-full rounded-md border px-3 py-2 text-sm" name="email" type="email" placeholder="Email" required />
      <input className="w-full rounded-md border px-3 py-2 text-sm" name="institution" placeholder="Institution" required />
      <input className="w-full rounded-md border px-3 py-2 text-sm" name="interest" placeholder="One line on your interest" required />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={sending}>
        Request an invitation
      </button>
    </form>
  )
}
