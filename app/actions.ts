'use server'
import 'server-only'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
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
        userId,
        timestamp: new Date().toISOString()
      })
      return []
    }

    if (!data || data.length === 0) {
      console.log('getChats: No chats found for user', userId)
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

    console.log(`getChats: Retrieved ${chats.length} chats for user ${userId}`)
    return chats
  } catch (error) {
    console.error('getChats unexpected error:', {
      error,
      userId,
      message: error instanceof Error ? error.message : String(error),
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
