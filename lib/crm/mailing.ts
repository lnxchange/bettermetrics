import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { crmConfig } from '@/lib/crm/config'
import { upsertSyncedContact, type SyncedContact } from '@/lib/crm/sync'

export type MailingReason = 'opt-out' | 'account-deleted'

export type MailingPort = {
  upsert: (contact: SyncedContact) => Promise<boolean>
  suppress: (email: string, userId: string, reason: MailingReason) => Promise<boolean>
  clearOptOut: (email: string) => Promise<boolean>
  subscribe?: (email: string) => Promise<boolean>
}

function crm(): SupabaseClient | null {
  const config = crmConfig()
  if (!config) return null
  return createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

function livePort(): MailingPort {
  return {
    async upsert(contact) {
      return upsertSyncedContact(contact)
    },
    async suppress(email, userId, reason) {
      const client = crm()
      if (!client) return false
      const { error } = await client.rpc('remove_mailing_contact', {
        p_email: email,
        p_site_user_id: userId,
        p_reason: reason
      })
      if (error) {
        console.error('CRM suppression failed')
        return false
      }
      return true
    },
    async clearOptOut(email) {
      const client = crm()
      if (!client) return false
      const { error } = await client
        .from('email_suppressions')
        .delete()
        .eq('email', email.trim().toLowerCase())
        .eq('reason', 'opt-out')
      if (error) {
        console.error('CRM opt-out could not be cleared')
        return false
      }
      return true
    },
    async subscribe(email) {
      const client = crm()
      if (!client) return false
      const { error } = await client
        .from('contacts')
        .update({ has_newsletter: true })
        .contains('email_jsonb', MailingList.newsletterContains(email))
      if (error) {
        console.error('CRM newsletter flag could not be set')
        return false
      }
      return true
    }
  }
}

export class MailingList {
  /**
   * PostgREST `cs` for a jsonb column. A JavaScript array is encoded as a
   * Postgres array (`cs.{[object Object]}`) and the API rejects it with 400.
   */
  static newsletterContains(email: string): string {
    return JSON.stringify([{ email: email.trim().toLowerCase() }])
  }

  static contact(input: {
    email: string
    displayName: string
    userId: string
  }): SyncedContact {
    return {
      email: input.email,
      fullName: input.displayName,
      source: 'website-signup',
      externalId: `site-user:${input.userId}`,
      tagNames: ['site-user'],
      siteUserId: input.userId,
      askPolicy: 'may-ask-to-validate'
    }
  }

  static async optIn(
    input: { email: string; displayName: string; userId: string },
    port: MailingPort = livePort()
  ): Promise<boolean> {
    const cleared = await port.clearOptOut(input.email)
    if (!cleared) return false
    const saved = await port.upsert(MailingList.contact(input))
    if (!saved || !port.subscribe) return saved
    return port.subscribe(input.email)
  }

  static async optOut(email: string, userId: string, port: MailingPort = livePort()): Promise<boolean> {
    return port.suppress(email, userId, 'opt-out')
  }

  static async deleted(email: string, userId: string, port: MailingPort = livePort()): Promise<boolean> {
    return port.suppress(email, userId, 'account-deleted')
  }
}
