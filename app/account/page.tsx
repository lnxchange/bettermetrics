'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AccountApiKey } from '@/components/account-api-key'
import { Switch } from '@/components/ui/switch'

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [updates, setUpdates] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
        setDisplayName(data.displayName || '')
        setUpdates(data.updatesOptIn === true)
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
      body: JSON.stringify({ displayName, email, password })
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

  const setUpdatesChoice = async (next: boolean) => {
    setUpdates(next)
    setError('')
    const response = await fetch('/api/account/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatesOptIn: next })
    })
    if (!response.ok) {
      setUpdates(!next)
      const data = await response.json().catch(() => ({}))
      setError(data.error || 'Could not update that choice.')
    }
  }

  const deleteAccount = async () => {
    setDeleting(true)
    setError('')
    const response = await fetch('/api/account/delete', { method: 'POST' })
    setDeleting(false)
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setError(data.error || 'Could not delete your account.')
      return
    }
    router.replace('/')
    router.refresh()
  }

  if (loading) return <p className="mx-auto max-w-md px-4 py-16 text-sm text-slate-600">Loading your profile…</p>

  return (
    <div className="mx-auto max-w-md space-y-12 px-4 py-16">
    <form className="space-y-4" onSubmit={save}>
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <p className="text-sm text-slate-600">Your email is how we reach you. A new email needs a confirmation from your inbox before it replaces the current one.</p>
      <label className="block text-sm">
        Display name
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={displayName} onChange={event => setDisplayName(event.target.value)} required />
        <span className="mt-1 block text-xs text-slate-500">Doesn&apos;t need to be your real name.</span>
      </label>
      <label className="block text-sm">
        Email
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="email" value={email} onChange={event => setEmail(event.target.value)} required />
      </label>
      <label className="block text-sm">
        New password
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" />
      </label>
      <label className="block text-sm">
        Confirm new password
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" />
      </label>
      <button className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50" type="submit" disabled={saving}>
        Save profile
      </button>
    </form>
    {error && <p className="text-sm text-red-700">{error}</p>}
    {saved && <p className="text-sm text-emerald-700">{saved}</p>}
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3">
      <div>
        <p className="font-medium text-slate-900">AIM Framework updates</p>
        <p className="text-xs text-slate-500">Email me about new chapters, papers and events.</p>
      </div>
      <Switch checked={updates} onCheckedChange={setUpdatesChoice} aria-label="AIM Framework updates" />
    </div>
    <AccountApiKey />
    <section className="space-y-3 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">Delete my account</h2>
      <p className="text-sm text-slate-600">
        This deletes your account, your saved key and your conversations. Your email address is kept only so you are not emailed again.
      </p>
      {confirmDelete ? (
        <div className="flex gap-3">
          <button className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" type="button" onClick={deleteAccount} disabled={deleting}>
            Delete my account
          </button>
          <button className="text-sm underline" type="button" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="text-sm font-medium text-red-700 underline" type="button" onClick={() => setConfirmDelete(true)}>
          Delete my account
        </button>
      )}
    </section>
    </div>
  )
}
