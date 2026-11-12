'use client'

import { useEffect, useState } from 'react'

type Details = {
  client_name: string
  redirect_uri: string
  scope: string
}

export function CrmOAuthConsent({
  authorizationId
}: {
  authorizationId: string
}) {
  const [details, setDetails] = useState<Details | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(authorizationId))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authorizationId) return
    let cancelled = false
    async function load() {
      const response = await fetch(
        `/api/admin/crm-oauth?authorization_id=${encodeURIComponent(
          authorizationId
        )}`,
        { credentials: 'same-origin' }
      )
      const body = await response.json().catch(() => null)
      if (cancelled) return
      if (response.status === 401) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search
        )
        window.location.assign(`/sign-in?redirectedFrom=${next}`)
        return
      }
      if (!response.ok) {
        setError(body?.error || 'The approval request could not be read')
        setLoading(false)
        return
      }
      if (body?.redirect_url) {
        window.location.assign(body.redirect_url)
        return
      }
      setDetails({
        client_name: body?.client_name || 'Claude',
        redirect_uri: body?.redirect_uri || '',
        scope: body?.scope || ''
      })
      setLoading(false)
    }
    load().catch(() => {
      if (!cancelled) {
        setError('The approval request could not be read')
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [authorizationId])

  async function decide(action: 'approve' | 'deny') {
    setSubmitting(true)
    setError(null)
    const response = await fetch('/api/admin/crm-oauth', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorization_id: authorizationId, action })
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.redirect_url) {
      setError(body?.error || 'The approval could not be finished')
      setSubmitting(false)
      return
    }
    window.location.assign(body.redirect_url)
  }

  if (!authorizationId) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-col gap-3 px-6 py-16">
        <h1 className="text-2xl font-semibold">
          This approval link is incomplete
        </h1>
        <p className="text-muted-foreground">
          It was opened without an approval id, so there is nothing to approve.
          Close this tab and add the connector again from Claude. Opening the
          approval address on its own cannot finish the connection.
        </p>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-lg px-6 py-16">
        <p className="text-muted-foreground">Opening the approval request…</p>
      </section>
    )
  }

  if (error || !details) {
    return (
      <section className="mx-auto flex w-full max-w-lg flex-col gap-3 px-6 py-16">
        <h1 className="text-2xl font-semibold">
          The approval could not be opened
        </h1>
        <p className="text-destructive">
          {error || 'The approval request could not be read'}
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">
          Let {details.client_name} use the CRM
        </h1>
        <p className="text-muted-foreground">
          You are signed in as an aimtheory.org administrator. Approving lets
          this connection read and change CRM records as you.
        </p>
      </div>
      <div className="rounded-lg border bg-background p-4">
        <p className="font-medium">{details.client_name}</p>
        {details.redirect_uri ? (
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {details.redirect_uri}
          </p>
        ) : null}
        <p className="mt-3 text-sm">
          It will be able to read and change contacts, notes, and deals with the
          same permissions as your CRM account.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md border px-4 py-2"
          disabled={submitting}
          onClick={() => decide('deny')}
        >
          Deny
        </button>
        <button
          type="button"
          className="flex-1 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          disabled={submitting}
          onClick={() => decide('approve')}
        >
          Approve
        </button>
      </div>
    </section>
  )
}
