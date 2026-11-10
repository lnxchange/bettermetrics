'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/profile')
      .then(async response => {
        if (response.status === 401) {
          router.replace('/sign-in?redirectedFrom=/account')
          return null
        }
        return response.json()
      })
      .then(data => {
        if (!data) return
        setEmail(data.email || '')
        setFirstName(data.firstName || '')
        setLastName(data.lastName || '')
      })
      .finally(() => setLoading(false))
  }, [router])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaved(false)
    const response = await fetch('/api/account/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName })
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Could not save your profile')
      return
    }
    setSaved(true)
  }

  if (loading) return <p className="mx-auto max-w-md px-4 py-16 text-sm text-slate-600">Loading your profile…</p>

  return (
    <form className="mx-auto max-w-md space-y-4 px-4 py-16" onSubmit={save}>
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <p className="text-sm text-slate-600">Your name and email are how we reach you.</p>
      <label className="block text-sm">
        First name
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={firstName} onChange={event => setFirstName(event.target.value)} required />
      </label>
      <label className="block text-sm">
        Last name
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={lastName} onChange={event => setLastName(event.target.value)} required />
      </label>
      <label className="block text-sm">
        Email
        <input className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2" value={email} readOnly />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">Profile saved.</p>}
      <button className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white" type="submit">
        Save profile
      </button>
    </form>
  )
}
