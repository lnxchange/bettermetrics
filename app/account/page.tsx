'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AccountApiKey } from '@/components/account-api-key'

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        setOrganization(data.organization || '')
      })
      .finally(() => setLoading(false))
  }, [router])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaved('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSaving(true)
    const response = await fetch('/api/account/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, organization, password })
    })
    const data = await response.json()
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Could not save your profile')
      return
    }
    setPassword('')
    setConfirmPassword('')
    setSaved(data.message || 'Profile saved.')
  }

  if (loading) return <p className="mx-auto max-w-md px-4 py-16 text-sm text-slate-600">Loading your profile…</p>

  return (
    <div className="mx-auto max-w-md space-y-12 px-4 py-16">
    <form className="space-y-4" onSubmit={save}>
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <p className="text-sm text-slate-600">Your name and email are how we reach you. A new email needs a confirmation from your inbox before it replaces the current one.</p>
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
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="email" value={email} onChange={event => setEmail(event.target.value)} required />
      </label>
      <label className="block text-sm">
        Organization
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={organization} onChange={event => setOrganization(event.target.value)} />
      </label>
      <label className="block text-sm">
        New password
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" />
      </label>
      <label className="block text-sm">
        Confirm new password
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">{saved}</p>}
      <button className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50" type="submit" disabled={saving}>
        Save profile
      </button>
    </form>
    <AccountApiKey />
    </div>
  )
}
