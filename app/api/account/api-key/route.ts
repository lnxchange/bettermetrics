import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'

import { auth } from '@/auth'
import { isChatProvider, keyMatchesProvider, detectProvider, PROVIDER_INFO, type ChatProvider } from '@/lib/chat-provider-ids'
import { loadChatSettings } from '@/lib/chat-settings'
import { validateProviderKey } from '@/lib/llm/validate'
import {
  activateUserKey,
  consumeKeySave,
  deleteUserChatKey,
  listUserKeys,
  saveUserChatKey
} from '@/lib/user-api-keys'

export const runtime = 'nodejs'

const LINKS: Record<string, string> = {
  anthropic: 'https://platform.claude.com/settings/keys',
  openai: 'https://platform.openai.com/api-keys',
  google: 'https://aistudio.google.com/apikey',
  openrouter: 'https://openrouter.ai/keys'
}

async function userId() {
  const session = await auth({ cookieStore: cookies() })
  return session?.user?.id ?? null
}

function ipHash(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function GET() {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const keys = await listUserKeys(id)
  const settings = await loadChatSettings()
  return NextResponse.json({ keys, links: LINKS, noticeMarkdown: settings.noticeMarkdown })
}

export async function PUT(req: NextRequest) {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await consumeKeySave(id, ipHash(req)))) {
    return NextResponse.json({ error: 'Too many key changes. Try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const apiKey = typeof body?.apiKey === 'string' ? body.apiKey.trim() : ''
  let provider: ChatProvider | null = detectProvider(apiKey)
  if (isChatProvider(body?.provider)) provider = body.provider
  if (!provider) {
    return NextResponse.json(
      { error: 'Choose Anthropic, OpenAI, Google Gemini, or OpenRouter.' },
      { status: 400 }
    )
  }
  if (!apiKey) {
    try {
      await activateUserKey(id, provider)
      return NextResponse.json({ keys: await listUserKeys(id), links: LINKS })
    } catch {
      return NextResponse.json({ error: 'Save a key for that provider first.' }, { status: 400 })
    }
  }
  const detected = detectProvider(apiKey)
  if (detected && detected !== provider) {
    return NextResponse.json(
      { error: `That key is for ${PROVIDER_INFO[detected].label}. Choose that provider.` },
      { status: 400 }
    )
  }
  if (!keyMatchesProvider(provider, apiKey)) {
    return NextResponse.json(
      { error: `Enter a ${PROVIDER_INFO[provider].label} key. It looks like ${PROVIDER_INFO[provider].placeholder}.` },
      { status: 400 }
    )
  }
  const accepted = await validateProviderKey(provider, apiKey)
  if (!accepted.ok) return NextResponse.json({ error: accepted.message }, { status: 400 })
  try {
    await saveUserChatKey(id, provider, apiKey)
    return NextResponse.json({ keys: await listUserKeys(id), links: LINKS })
  } catch (error) {
    console.error('Saving an API key failed')
    const unavailable = error instanceof Error && error.message.includes('service role')
    return NextResponse.json(
      {
        error: unavailable
          ? 'API key storage is not configured yet.'
          : 'Could not save that key. Apply the user API key migrations, then try again.'
      },
      { status: 503 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const provider = isChatProvider(body?.provider) ? body.provider : null
  if (!provider) return NextResponse.json({ error: 'Choose a provider to remove.' }, { status: 400 })
  try {
    await deleteUserChatKey(id, provider)
    return NextResponse.json({ keys: await listUserKeys(id), links: LINKS })
  } catch {
    console.error('Removing an API key failed')
    return NextResponse.json({ error: 'Could not remove that key.' }, { status: 503 })
  }
}
