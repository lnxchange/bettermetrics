import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/db_types'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('=== DATABASE DIAGNOSTICS ===')
    console.log('Requested by user:', session.user.id)

    // Query all chats in the database
    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select('id, user_id, payload')
      .order('id', { ascending: false })
      .limit(100)

    if (chatsError) {
      console.error('Chats query error:', chatsError)
    }

    console.log('Total chats in database:', chatsData?.length || 0)

    // Get unique user IDs from chats
    const userIds = Array.from(new Set(chatsData?.map(chat => chat.user_id).filter(Boolean) || []))
    console.log('Unique user IDs with chats:', userIds)

    // Get current user's chats
    const userChats = chatsData?.filter(chat => chat.user_id === session.user.id) || []
    console.log('Current user chats:', userChats.length)

    // Try to get user list from auth (requires service role key)
    let authUsers = []
    try {
      // Note: This will only work with admin privileges
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()

      if (usersError) {
        console.log('Cannot list auth users (need service role key):', usersError.message)
      } else {
        authUsers = usersData.users.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at
        }))
        console.log('Auth users found:', authUsers.length)
      }
    } catch (adminError) {
      console.log('Admin API not available (expected with anon key)')
    }

    console.log('============================')

    return NextResponse.json({
      diagnostics: {
        totalChats: chatsData?.length || 0,
        uniqueUserIdsWithChats: userIds,
        currentUserId: session.user.id,
        currentUserEmail: session.user.email,
        currentUserChatsCount: userChats.length,
        currentUserChats: userChats.map(chat => ({
          id: chat.id,
          title: (chat.payload as any)?.title || 'Untitled',
          createdAt: (chat.payload as any)?.createdAt,
          messageCount: (chat.payload as any)?.messages?.length || 0
        })),
        authUsers: authUsers.length > 0 ? authUsers : 'Not available (requires service role key)',
        databaseInfo: {
          chatsTableExists: !chatsError,
          chatsError: chatsError ? {
            message: chatsError.message,
            details: chatsError.details,
            hint: chatsError.hint
          } : null
        }
      },
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json({
      error: 'Diagnostics failed',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
