'use client'

import { FormEvent, useEffect, useState } from 'react'

export function AccountApiKey() {
  const [hint, setHint] = useState<string | null>(null)
  const [configured, setConfigured] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancel = false
    fetch('/api/account/api-key')
      .then(async response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancel || !data) return
        setConfigured(Boolean(data.configured))
        setHint(typeof data.hint === 'string' ? data.hint : null)
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaved('')
    setSaving(true)
    const response = await fetch('/api/account/api-key', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    })
    const data = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Could not save that key')
      return
    }
    setApiKey('')
    setConfigured(true)
    setHint(typeof data.hint === 'string' ? data.hint : null)
    setSaved('Key saved. Questions you ask are billed to this key.')
  }

  const remove = async () => {
    setError('')
    setSaved('')
    setSaving(true)
    const response = await fetch('/api/account/api-key', { method: 'DELETE' })
    setSaving(false)
    if (!response.ok) {
      setError('Could not remove that key')
      return
    }
    setConfigured(false)
    setHint(null)
    setSaved('Key removed. Chat stays off until you add another.')
  }

  return (
    <form id="api-key" className="space-y-4" onSubmit={save}>
      <h2 className="text-xl font-semibold text-slate-900">Your Anthropic API key</h2>
      <p className="text-sm text-slate-600">
        Ask the AI runs on your own key, so the questions you send are billed to your Anthropic
        account. The key is stored encrypted and is not shown again. Create one in the Anthropic
        console, under API keys.
      </p>
      {loading ? (
        <p className="text-sm text-slate-600">Loading key status…</p>
      ) : configured ? (
        <p className="text-sm text-slate-700">A key is saved, ending in {hint}.</p>
      ) : (
        <p className="text-sm text-slate-700">No key saved yet. Chat stays off until you add one.</p>
      )}
      <label className="block text-sm">
        Anthropic API key
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono"
          type="password"
          name="apiKey"
          autoComplete="off"
          spellCheck={false}
          value={apiKey}
          onChange={event => setApiKey(event.target.value)}
          placeholder="sk-ant-..."
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">{saved}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          type="submit"
          disabled={saving || apiKey.trim().length === 0}
        >
          Save key
        </button>
        {configured && (
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
            type="button"
            onClick={remove}
            disabled={saving}
          >
            Remove key
          </button>
        )}
      </div>
    </form>
  )
}
