import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'

// GET - List all contact messages
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all' // all, unread, read

    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter === 'unread') {
      query = query.eq('is_read', false)
    } else if (filter === 'read') {
      query = query.eq('is_read', true)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    return NextResponse.json({ 
      messages: messages || [], 
      unreadCount: unreadCount || 0 
    })
  } catch (error) {
    console.error('Admin inbox API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update message (mark as read/unread)
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, is_read } = body

    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating message:', error)
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin inbox PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a message
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting message:', error)
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin inbox DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

