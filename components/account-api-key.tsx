'use client'

import { FormEvent, useEffect, useState } from 'react'

import { ByokNotice } from '@/components/byok-notice'
import { BYOK_NOTICE } from '@/lib/chat-notice'
import {
  CHAT_PROVIDERS,
  ChatProvider,
  PROVIDER_INFO,
  detectProvider,
  isChatProvider
} from '@/lib/chat-provider-ids'

type SavedKey = { provider: ChatProvider; hint: string; active: boolean }

const CREATE_LINKS: Record<ChatProvider, { href: string; label: string }> = {
  anthropic: { href: 'https://platform.claude.com/settings/keys', label: 'platform.claude.com → API keys' },
  openai: { href: 'https://platform.openai.com/api-keys', label: 'platform.openai.com → API keys' },
  google: { href: 'https://aistudio.google.com/apikey', label: 'aistudio.google.com → Get API key' },
  openrouter: { href: 'https://openrouter.ai/keys', label: 'openrouter.ai → Keys' }
}

export function AccountApiKey() {
  const [keys, setKeys] = useState<SavedKey[]>([])
  const [usesSiteKey, setUsesSiteKey] = useState(false)
  const [notice, setNotice] = useState(BYOK_NOTICE)
  const [provider, setProvider] = useState<ChatProvider>('anthropic')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = (data: { keys?: SavedKey[] } | null) => {
    const rows = data?.keys
    const next = Array.isArray(rows) ? rows.filter(item => isChatProvider(item.provider)) : []
    setKeys(next)
  }

  useEffect(() => {
    let cancel = false
    fetch('/api/account/api-key')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancel || !data) return
        refresh(data)
        setUsesSiteKey(data.usesSiteKey === true)
        if (typeof data.noticeMarkdown === 'string' && data.noticeMarkdown.trim()) {
          setNotice(data.noticeMarkdown)
        }
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
      body: JSON.stringify({ provider, apiKey })
    })
    const data = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Could not save that key')
      return
    }
    setApiKey('')
    refresh(data)
    setSaved('Key saved. Questions you ask are billed to this key.')
  }

  const activate = async (next: ChatProvider) => {
    setError('')
    const response = await fetch('/api/account/api-key', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: next })
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(data.error || 'Could not choose that provider')
      return
    }
    refresh(data)
  }

  const remove = async (next: ChatProvider) => {
    setError('')
    setSaving(true)
    const response = await fetch('/api/account/api-key', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: next })
    })
    const data = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Could not remove that key')
      return
    }
    refresh(data)
    setSaved('Key removed.')
  }

  return (
    <form id="api-key" className="space-y-4" onSubmit={save}>
      <ByokNotice markdown={notice} />
      {usesSiteKey && (
        <p className="text-sm text-slate-700">
          You&apos;re an admin. Chat uses the site key, so you can ask without saving one here. A key you save replaces the site key for your questions.
        </p>
      )}
      {loading ? <p className="text-sm text-slate-600">Loading keys…</p> : null}
      <ul className="space-y-2 text-sm">
        {CHAT_PROVIDERS.map(id => {
          const savedKey = keys.find(item => item.provider === id)
          return (
            <li key={id} className="rounded-md border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{PROVIDER_INFO[id].label}</span>
                {savedKey ? (
                  <span>{savedKey.active ? 'Active' : 'Saved'} · ending in {savedKey.hint}</span>
                ) : (
                  <span className="text-slate-500">No key</span>
                )}
              </div>
              <a className="text-[#1E3A8A] underline" href={CREATE_LINKS[id].href} target="_blank" rel="noreferrer">
                {CREATE_LINKS[id].label}
              </a>
              {savedKey && (
                <div className="mt-2 flex gap-2">
                  {!savedKey.active && (
                    <button type="button" className="text-sm underline" onClick={() => activate(id)}>
                      Use this key
                    </button>
                  )}
                  <button type="button" className="text-sm underline" onClick={() => remove(id)} disabled={saving}>
                    Remove key
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <label className="block text-sm">
        Provider
        <select
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          value={provider}
          onChange={event => {
            if (isChatProvider(event.target.value)) setProvider(event.target.value)
          }}
        >
          {CHAT_PROVIDERS.map(id => (
            <option key={id} value={id}>
              {PROVIDER_INFO[id].label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        API key
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono"
          type="password"
          name="apiKey"
          autoComplete="off"
          spellCheck={false}
          value={apiKey}
          onChange={event => {
            setApiKey(event.target.value)
            const detected = detectProvider(event.target.value)
            if (detected) setProvider(detected)
          }}
          placeholder={PROVIDER_INFO[provider].placeholder}
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">{saved}</p>}
      <button
        className="rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        type="submit"
        disabled={saving || apiKey.trim().length === 0}
      >
        Save key
      </button>
    </form>
  )
}
