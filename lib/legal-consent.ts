import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { chatStore } from '@/lib/chat-store'
import { crmConfig } from '@/lib/crm/config'
import { MailingList } from '@/lib/crm/mailing'
import { LegalVersion } from '@/lib/legal-version'

export type ConsentRow = {
  user_id: string
  accepted_at: string | null
  terms_version: string | null
  privacy_version: string | null
  updates_opt_in: boolean
  updates_opt_in_at: string | null
}

export class LegalConsent {
  static async read(userId: string, client: SupabaseClient | null = chatStore()): Promise<ConsentRow | null> {
    if (!client) return null
    const { data, error } = await client
      .from('user_legal_consents')
      .select('user_id, accepted_at, terms_version, privacy_version, updates_opt_in, updates_opt_in_at')
      .eq('user_id', userId)
      .maybeSingle()
    if (error || !data) return null
    return data as ConsentRow
  }

  static async allows(userId: string, client?: SupabaseClient | null): Promise<boolean> {
    return LegalVersion.matches(await LegalConsent.read(userId, client))
  }

  static async record(
    input: {
      userId: string
      email: string
      displayName: string
      updatesOptIn: boolean
      acceptedAt?: string
    },
    client: SupabaseClient | null = chatStore()
  ): Promise<boolean> {
    if (!client) return false
    const now = input.acceptedAt || new Date().toISOString()
    const { error } = await client.from('user_legal_consents').upsert(
      {
        user_id: input.userId,
        accepted_at: now,
        terms_version: LegalVersion.publicationDate,
        privacy_version: LegalVersion.publicationDate,
        updates_opt_in: input.updatesOptIn,
        updates_opt_in_at: now
      },
      { onConflict: 'user_id' }
    )
    if (error) return false
    return LegalConsent.syncMailing(input)
  }

  private static async syncMailing(input: {
    userId: string
    email: string
    displayName: string
    updatesOptIn: boolean
  }): Promise<boolean> {
    const mailed = input.updatesOptIn
      ? await MailingList.optIn({ email: input.email, displayName: input.displayName, userId: input.userId })
      : await MailingList.optOut(input.email, input.userId)
    return mailed || !crmConfig()
  }

  static async setUpdates(
    input: { userId: string; email: string; displayName: string; updatesOptIn: boolean },
    client: SupabaseClient | null = chatStore()
  ): Promise<boolean> {
    if (!client) return false
    const now = new Date().toISOString()
    const { error } = await client
      .from('user_legal_consents')
      .update({ updates_opt_in: input.updatesOptIn, updates_opt_in_at: now })
      .eq('user_id', input.userId)
    if (error) return false
    return LegalConsent.syncMailing(input)
  }

  /** Copy acceptance stored on the auth user at sign-up, once a session exists. */
  static async persistFromMetadata(
    user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
    client?: SupabaseClient | null
  ): Promise<void> {
    const metadata = user.user_metadata || {}
    if (typeof metadata.legal_accepted_at !== 'string' || !user.email) return
    const existing = await LegalConsent.read(user.id, client)
    if (existing?.accepted_at) return
    await LegalConsent.record(
      {
        userId: user.id,
        email: user.email,
        displayName: typeof metadata.display_name === 'string' ? metadata.display_name : user.email,
        updatesOptIn: metadata.legal_updates_opt_in === true,
        acceptedAt: metadata.legal_accepted_at
      },
      client
    )
  }
}
