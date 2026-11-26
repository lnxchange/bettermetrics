'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PublishingEditorProps {
  slug: string
  title: string
  summary: string
  content: string
  date: string
  editorialStatus: string
  previewOnly: boolean
}

/**
 * Title, summary, body and tentative date for one queued article.
 * Save leaves the editorial status alone. Approve and un-approve keep the slot.
 */
export function PublishingEditor(props: PublishingEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(props.title)
  const [summary, setSummary] = useState(props.summary)
  const [content, setContent] = useState(props.content)
  const [date, setDate] = useState(props.date)
  const [editorialStatus, setEditorialStatus] = useState(props.editorialStatus)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(action: 'save' | 'approve' | 'unapprove') {
    setPending(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/publishing/${props.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          title,
          summary,
          content,
          date: props.previewOnly ? '' : date
        })
      })
      const payload = (await response.json()) as {
        error?: string
        message?: string
        editorial_status?: string
        date?: string
      }
      if (!response.ok) {
        setMessage(payload.error || 'The change was not saved.')
        return
      }
      if (payload.editorial_status) setEditorialStatus(payload.editorial_status)
      if (payload.date) setDate(payload.date)
      setMessage(payload.message || 'Saved.')
      router.refresh()
    } catch {
      setMessage('The change was not saved.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      className="mx-auto max-w-4xl space-y-4 px-4 py-8 sm:px-6 lg:px-8"
      onSubmit={event => {
        event.preventDefault()
        void submit('save')
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Edit</h2>
        <p className="text-sm text-gray-500">{editorialStatus === 'approved' ? 'Approved' : 'Draft'}</p>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        Title
        <input
          name="title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900"
          required
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Summary
        <input
          name="summary"
          value={summary}
          maxLength={160}
          onChange={event => setSummary(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900"
          required
        />
        <span className="mt-1 block text-xs text-gray-500">{summary.length}/160 characters. This is the meta description.</span>
      </label>
      {props.previewOnly ? (
        <p className="text-sm text-amber-800">Not reserved. This test does not take a Monday, Wednesday or Friday slot.</p>
      ) : (
        <label className="block text-sm font-medium text-gray-700">
          Tentative date
          <input
            name="date"
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900"
          />
          <span className="mt-1 block text-xs text-gray-500">
            Snapped to 7:00am Melbourne on Monday, Wednesday or Friday, and never before 11 January 2027.
          </span>
        </label>
      )}
      <label className="block text-sm font-medium text-gray-700">
        Body
        <textarea
          name="content"
          value={content}
          rows={14}
          onChange={event => setContent(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900"
          required
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {editorialStatus === 'approved' ? 'Save' : 'Save draft'}
        </button>
        {editorialStatus === 'approved' ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit('unapprove')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
          >
            Return to draft
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit('approve')}
            className="rounded-md border border-primary-600 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-blue-50 disabled:opacity-60"
          >
            Approve
          </button>
        )}
      </div>
      {message && <p className="text-sm text-gray-700">{message}</p>}
      <p className="text-sm text-gray-500">
        Saving does not publish. An approved article still waits for its slot, and for 11 January 2027, before the hourly job can make it public.
      </p>
    </form>
  )
}
