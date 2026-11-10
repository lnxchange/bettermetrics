export type CrmConfig = {
  url: string
  anonKey: string
  serviceRoleKey: string
}

export function crmConfig(): CrmConfig | null {
  const url =
    process.env.CRM_SUPABASE_URL ||
    process.env.CRM_NEXT_PUBLIC_SUPABASE_URL ||
    process.env.CRM_PUBLIC_SUPABASE_URL
  const anonKey =
    process.env.CRM_SUPABASE_ANON_KEY ||
    process.env.CRM_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.CRM_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.CRM_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceRoleKey) return null
  return { url, anonKey, serviceRoleKey }
}

export function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: 'Unknown', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function tagsForInterest(interest?: string | null): string[] {
  if (interest === 'media') return ['press', 'inbound']
  return ['inbound']
}

export function askPolicyForTags(tags: string[]): 'do-not-ask' | 'may-ask-to-validate' {
  return tags.includes('ally') ? 'do-not-ask' : 'may-ask-to-validate'
}

export function noteForContactMessage(row: {
  subject?: string | null
  interest?: string | null
  message?: string | null
  paper_scope?: string | null
  paper_questions?: string | null
}): string {
  return [
    row.subject ? `Subject: ${row.subject}` : '',
    row.interest ? `Interest: ${row.interest}` : '',
    row.message ? row.message : '',
    row.paper_scope ? `Paper scope: ${row.paper_scope}` : '',
    row.paper_questions ? `Paper questions: ${row.paper_questions}` : ''
  ]
    .filter(Boolean)
    .join('\n\n')
}
