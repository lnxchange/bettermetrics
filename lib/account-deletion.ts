import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { chatStore } from '@/lib/chat-store'
import { MailingList } from '@/lib/crm/mailing'

export class AccountDeletion {
  static async delete(userId: string, email: string, client: SupabaseClient | null = chatStore()): Promise<boolean> {
    if (!client) return false
    const chats = await client.from('chats').delete().eq('user_id', userId)
    if (chats.error) return false
    const keys = await client.from('user_api_keys').delete().eq('user_id', userId)
    if (keys.error) return false
    await client.from('api_key_save_attempts').delete().eq('bucket', `user:${userId}`)
    const suppressed = await MailingList.deleted(email, userId)
    if (!suppressed) return false
    const removed = await client.auth.admin.deleteUser(userId)
    return !removed.error
  }
}
