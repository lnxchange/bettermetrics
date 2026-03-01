'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface ContactMessage {
  id: string
  name: string
  email: string
  affiliation: string | null
  interest: string
  subject: string | null
  message: string | null
  paper_scope: string | null
  paper_questions: string | null
  is_read: boolean
  created_at: string
  updated_at: string
}

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/inbox?filter=${filter}`)
      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await res.json()
      setMessages(data.messages)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, is_read: boolean) => {
    try {
      const res = await fetch('/api/admin/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read })
      })
      if (res.ok) {
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read })
        }
      }
    } catch (err) {
      console.error('Error updating message:', err)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const res = await fetch(`/api/admin/inbox?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      markAsRead(message.id, true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getInterestLabel = (interest: string) => {
    const labels: Record<string, string> = {
      'research-paper': 'Research Paper Request',
      'research': 'Research Collaboration',
      'testing': 'Testing & Validation',
      'consulting': 'Organizational Consulting',
      'speaking': 'Speaking Engagement',
      'media': 'Media Inquiry',
      'general': 'General Inquiry'
    }
    return labels[interest] || interest
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
            <p className="mt-1 text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No unread messages'}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin">← Back to Dashboard</Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-600">
              Make sure the contact_messages table exists in Supabase. 
              <a href="#setup" className="underline ml-1">See setup instructions below.</a>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Message List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                    {messages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => openMessage(message)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                          selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                        } ${!message.is_read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {!message.is_read && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                              )}
                              <span className={`truncate text-sm ${!message.is_read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                                {message.name}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {message.subject || getInterestLabel(message.interest)}
                            </p>
                            <p className="mt-1 truncate text-xs text-blue-600">
                              {message.email}
                            </p>
                          </div>
                          <span className="ml-2 text-xs text-gray-400 flex-shrink-0">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedMessage.subject || getInterestLabel(selectedMessage.interest)}</CardTitle>
                      <CardDescription>
                        <span className="font-medium text-gray-700">{selectedMessage.name}</span>
                        {' • '}
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                        {selectedMessage.affiliation && (
                          <span className="ml-2 text-gray-500">• {selectedMessage.affiliation}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(selectedMessage.id, !selectedMessage.is_read)}
                      >
                        {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                        {getInterestLabel(selectedMessage.interest)}
                      </span>
                      <span className="text-gray-500">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </span>
                    </div>

                    {selectedMessage.interest === 'research-paper' ? (
                      <>
                        <div className="rounded-lg bg-gray-50 p-4">
                          <h4 className="mb-2 font-semibold text-gray-700">Research Paper Scope</h4>
                          <p className="whitespace-pre-wrap text-gray-600">{selectedMessage.paper_scope}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4">
                          <h4 className="mb-2 font-semibold text-gray-700">Specific Questions to Address</h4>
                          <p className="whitespace-pre-wrap text-gray-600">{selectedMessage.paper_questions}</p>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold text-gray-700">Message</h4>
                        <p className="whitespace-pre-wrap text-gray-600">{selectedMessage.message}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button asChild>
                        <a href={`mailto:${selectedMessage.email}?subject=Re: AIM Framework - ${getInterestLabel(selectedMessage.interest)}`}>
                          Reply via Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex h-[400px] items-center justify-center">
                  <p className="text-gray-500">Select a message to view</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div id="setup" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>
                Run this SQL in your Supabase SQL editor to create the contact_messages table
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  affiliation TEXT,
  interest TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  paper_scope TEXT,
  paper_questions TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read 
ON contact_messages(is_read);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access" ON contact_messages
  FOR ALL USING (true) WITH CHECK (true);`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

