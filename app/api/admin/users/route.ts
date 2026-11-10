import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient, type User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { upsertSyncedContact } from '@/lib/crm/sync'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 }) }
  }
  const session = await auth({ cookieStore: cookies() })
  if (!session?.user?.user_metadata?.is_admin) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session }
}

function present(user: User & { banned_until?: string | null }) {
  const metadata = user.user_metadata || {}
  const bannedUntil = user.banned_until ? new Date(user.banned_until).getTime() : 0
  return {
    id: user.id,
    email: user.email,
    first_name: typeof metadata.first_name === 'string' ? metadata.first_name : '',
    last_name: typeof metadata.last_name === 'string' ? metadata.last_name : '',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    email_confirmed: Boolean(user.email_confirmed_at),
    is_admin: metadata.is_admin === true,
    disabled: bannedUntil > Date.now()
  }
}

export async function GET(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (gate.error) return gate.error

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || '1')
    const perPage = Number(searchParams.get('perPage') || '200')
    const { data, error } = await serviceClient().auth.admin.listUsers({ page, perPage })
    if (error) {
      return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
    }

    const users = (data?.users || []).map(present)
    return NextResponse.json({
      users,
      page,
      perPage,
      total: data?.total ?? users.length,
      currentUserId: gate.session?.user.id
    })
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (gate.error || !gate.session?.user) return gate.error

    const body = await req.json()
    const id = String(body.id || '')
    if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 })

    const supabase = serviceClient()
    const { data: existing, error: lookupError } = await supabase.auth.admin.getUserById(id)
    if (lookupError || !existing.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const metadata = { ...(existing.user.user_metadata || {}) }
    const patch: { user_metadata?: Record<string, unknown>; ban_duration?: string } = {}

    if (typeof body.firstName === 'string' || typeof body.lastName === 'string') {
      const firstName = String(body.firstName ?? metadata.first_name ?? '').trim()
      const lastName = String(body.lastName ?? metadata.last_name ?? '').trim()
      if (!firstName || !lastName) {
        return NextResponse.json({ error: 'First and last name are required' }, { status: 400 })
      }
      metadata.first_name = firstName
      metadata.last_name = lastName
      metadata.name = `${firstName} ${lastName}`
      patch.user_metadata = metadata
    }

    if (typeof body.isAdmin === 'boolean') {
      if (body.isAdmin === false && id === gate.session.user.id) {
        return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 })
      }
      metadata.is_admin = body.isAdmin
      patch.user_metadata = metadata
    }

    if (typeof body.disabled === 'boolean') {
      if (body.disabled && id === gate.session.user.id) {
        return NextResponse.json({ error: 'You cannot disable your own account' }, { status: 400 })
      }
      patch.ban_duration = body.disabled ? '876000h' : 'none'
    }

    if (!patch.user_metadata && !patch.ban_duration) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.admin.updateUserById(id, patch)
    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Could not update the user' }, { status: 400 })
    }

    if (typeof body.firstName === 'string' || typeof body.lastName === 'string') {
      await upsertSyncedContact({
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
        source: 'website-signup',
        externalId: `site-user:${data.user.id}`,
        tagNames: ['site-user'],
        siteUserId: data.user.id,
        askPolicy: 'may-ask-to-validate',
        companyName: typeof data.user.user_metadata?.organization === 'string'
          ? data.user.user_metadata.organization
          : null
      })
    }

    return NextResponse.json({ user: present(data.user), message: 'User updated.' })
  } catch (error) {
    console.error('Admin users update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (gate.error) return gate.error

    const body = await req.json()
    if (body.action !== 'reset-password') {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    const id = String(body.id || '')
    const supabase = serviceClient()
    const { data: existing, error: lookupError } = await supabase.auth.admin.getUserById(id)
    if (lookupError || !existing.user?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { error } = await supabase.auth.resetPasswordForEmail(existing.user.email, {
      redirectTo: `${req.nextUrl.origin}/update-password`
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: `Password reset sent to ${existing.user.email}.` })
  } catch (error) {
    console.error('Admin password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (gate.error || !gate.session?.user) return gate.error

    const body = await req.json().catch(() => ({}))
    const id = String(body.id || new URL(req.url).searchParams.get('id') || '')
    if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 })
    if (id === gate.session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account here' }, { status: 400 })
    }

    const { error } = await serviceClient().auth.admin.deleteUser(id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Account deleted. The CRM contact was left in place.' })
  } catch (error) {
    console.error('Admin user delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
