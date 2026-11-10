/**
 * Create the aim-crm Supabase project and store its keys on the Vercel project.
 *
 * Uses the team's existing Supabase marketplace installation when VERCEL_TOKEN
 * is set. Uses the Supabase management API when SUPABASE_ACCESS_TOKEN is set.
 * Values are written to Vercel env and are not printed.
 *
 *   VERCEL_TOKEN=... node scripts/provision-aim-crm.mjs
 *   SUPABASE_ACCESS_TOKEN=... node scripts/provision-aim-crm.mjs
 */
import { randomBytes } from 'crypto'

const TEAM_ID = 'team_T6k1ldIUXFXt6J1HsBksNBzy'
const PROJECT_ID = 'prj_xIOsq7oNKYobDGdBEG5L3Q7vsC0A'
const INSTALLATION_ID = 'icfg_xQQjG32VEML4tShjokFq9GC1'
const REGION = 'ap-southeast-2'
const VERCEL_REGION = 'syd1'

const vercelToken = process.env.VERCEL_TOKEN
const supabaseToken = process.env.SUPABASE_ACCESS_TOKEN

if (!vercelToken && !supabaseToken) {
  console.error(
    'Set VERCEL_TOKEN (marketplace) or SUPABASE_ACCESS_TOKEN (management API). Neither is available in this environment.'
  )
  process.exit(1)
}

async function vercel(path, options = {}) {
  const url = new URL(`https://api.vercel.com${path}`)
  if (!url.searchParams.has('teamId')) url.searchParams.set('teamId', TEAM_ID)
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) {
    const message = body?.error?.message || response.statusText
    throw new Error(`Vercel ${path} failed: ${message}`)
  }
  return body
}

async function upsertEnv(key, value) {
  const existing = await vercel(
    `/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`
  )
  const found = (existing.envs || []).find(entry => entry.key === key)
  if (found) {
    await vercel(`/v9/projects/${PROJECT_ID}/env/${found.id}?teamId=${TEAM_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({ value, type: 'sensitive' })
    })
    return
  }
  await vercel(`/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`, {
    method: 'POST',
    body: JSON.stringify({
      key,
      value,
      type: 'sensitive',
      target: ['production', 'preview', 'development']
    })
  })
}

async function provisionWithSupabase() {
  const orgs = await fetch('https://api.supabase.com/v1/organizations', {
    headers: { Authorization: `Bearer ${supabaseToken}` }
  }).then(async response => {
    if (!response.ok) throw new Error(`Supabase orgs failed: ${response.status}`)
    return response.json()
  })
  const org = orgs[0]
  if (!org?.id) throw new Error('No Supabase organization on this token')

  const dbPass = randomBytes(24).toString('base64url')
  const created = await fetch('https://api.supabase.com/v1/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'aim-crm',
      organization_id: org.id,
      region: REGION,
      db_pass: dbPass,
      plan: 'free'
    })
  }).then(async response => {
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(body.message || `Supabase create failed: ${response.status}`)
    }
    return body
  })

  const ref = created.id
  process.stdout.write(`Created Supabase project ${ref} in ${REGION}\n`)

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const status = await fetch(`https://api.supabase.com/v1/projects/${ref}`, {
      headers: { Authorization: `Bearer ${supabaseToken}` }
    }).then(response => response.json())
    if (status.status === 'ACTIVE_HEALTHY') break
    await new Promise(resolve => setTimeout(resolve, 10000))
  }

  const keys = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys`, {
    headers: { Authorization: `Bearer ${supabaseToken}` }
  }).then(response => response.json())
  const anon = keys.find(key => key.name === 'anon')?.api_key
  const service = keys.find(key => key.name === 'service_role')?.api_key
  if (!anon || !service) throw new Error('Supabase did not return API keys')

  if (vercelToken) {
    const url = `https://${ref}.supabase.co`
    await upsertEnv('CRM_SUPABASE_URL', url)
    await upsertEnv('CRM_SUPABASE_ANON_KEY', anon)
    await upsertEnv('CRM_SUPABASE_SERVICE_ROLE_KEY', service)
    await upsertEnv('CRM_DB_PASSWORD', dbPass)
    process.stdout.write('Stored CRM_SUPABASE_URL, CRM_SUPABASE_ANON_KEY, CRM_SUPABASE_SERVICE_ROLE_KEY, CRM_DB_PASSWORD on Vercel\n')
  } else {
    process.stdout.write('Vercel token missing, so the keys were not stored. Set VERCEL_TOKEN and rerun.\n')
  }

  await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${supabaseToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ disable_signup: true })
  })
  process.stdout.write('Public signup on the CRM project is disabled\n')
  process.stdout.write(`Project ref: ${ref}\n`)
}

async function provisionWithVercel() {
  const store = await vercel('/v1/storage/stores/integration/direct', {
    method: 'POST',
    body: JSON.stringify({
      name: 'aim-crm',
      integrationConfigurationId: INSTALLATION_ID,
      integrationProductIdOrSlug: 'supabase',
      metadata: {
        region: VERCEL_REGION,
        publicEnvVarPrefix: 'NEXT_PUBLIC_'
      },
      source: 'cli'
    })
  })
  const resourceId = store.store?.id || store.id
  process.stdout.write(`Created marketplace store ${resourceId || 'aim-crm'} in ${VERCEL_REGION}\n`)
  if (!resourceId) {
    process.stdout.write('Connect it in Vercel with env prefix CRM_ before using the keys.\n')
    return
  }
  await vercel(
    `/v1/integrations/installations/${INSTALLATION_ID}/resources/${resourceId}/connections`,
    {
      method: 'POST',
      body: JSON.stringify({
        projectId: PROJECT_ID,
        envVarPrefix: 'CRM_',
        environments: ['production', 'preview', 'development']
      })
    }
  )
  process.stdout.write('Connected aim-crm to bettermetrics with the CRM_ env prefix\n')
}

if (supabaseToken) {
  await provisionWithSupabase()
} else {
  await provisionWithVercel()
}
