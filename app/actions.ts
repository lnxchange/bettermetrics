'use server'
import 'server-only'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  console.log('getChats called with userId:', userId)

  if (!userId) {
    console.log('getChats: No userId provided, returning empty array')
    return []
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })

    // Debug: Check current auth session
    const { data: sessionData } = await supabase.auth.getSession()
    console.log('getChats: Auth session check:', {
      hasSession: !!sessionData.session,
      sessionUserId: sessionData.session?.user?.id,
      requestedUserId: userId,
      userIdMatch: sessionData.session?.user?.id === userId
    })

    // Fetch all chats for user without database-level ordering
    // We'll sort in-memory to avoid JSON path ordering issues in Supabase
    const { data, error } = await supabase
      .from('chats')
      .select('id, payload')
      .eq('user_id', userId)

    if (error) {
      console.error('getChats database error:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        userId,
        timestamp: new Date().toISOString()
      })
      return []
    }

    if (!data || data.length === 0) {
      console.log('getChats: No chats found for user', userId)
      console.log('getChats: This could mean:')
      console.log('  1. User has no chats yet')
      console.log('  2. RLS policy is blocking the query')
      console.log('  3. Chats table is empty')
      return []
    }

    // Extract and sort chats by createdAt in memory
    // This avoids Supabase JSON path ordering issues
    const chats = data
      .map((row: any) => row?.payload as Chat)
      .filter(chat => chat && chat.id) // Filter out null/malformed chats
      .sort((a: any, b: any) => {
        const aTime = a?.createdAt ?? 0
        const bTime = b?.createdAt ?? 0
        return bTime - aTime // Most recent first
      })

    console.log(`getChats: Successfully retrieved ${chats.length} chats for user ${userId}`)
    console.log('getChats: First chat:', chats[0] ? { id: chats[0].id, title: chats[0].title, createdAt: chats[0].createdAt } : 'none')
    return chats
  } catch (error) {
    console.error('getChats unexpected error:', {
      error,
      userId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    return []
  }
}

export async function getChat(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from('chats').delete().eq('id', id).throwOnError()

    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    return {
      error: 'Unauthorized'
    }
  }
}

export async function clearChats() {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from('chats').delete().throwOnError()
    revalidatePath('/')
    return redirect('/')
  } catch (error) {
    console.log('clear chats error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function getSharedChat(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .not('payload->sharePath', 'is', null)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  await supabase
    .from('chats')
    .update({ payload: payload as any })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}
