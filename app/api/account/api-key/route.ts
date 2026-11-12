import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import {
  PROVIDER_INFO,
  detectProvider,
  isChatProvider,
  isModelId,
  keyMatchesProvider,
  type ChatProvider
} from '@/lib/chat-provider-ids'
import { providerKeyAccepted } from '@/lib/chat-providers'
import {
  deleteUserChatKey,
  getUserApiKeyStatus,
  saveUserChatKey
} from '@/lib/user-api-keys'

export const runtime = 'nodejs'

async function userId() {
  const session = await auth({ cookieStore: cookies() })
  return session?.user?.id ?? null
}

export async function GET() {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getUserApiKeyStatus(id))
}

export async function PUT(req: NextRequest) {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  const detected = detectProvider(apiKey)
  if (detected && detected !== provider) {
    return NextResponse.json(
      {
        error: `That key is for ${PROVIDER_INFO[detected].label}. Choose that provider, or paste a ${PROVIDER_INFO[provider].label} key.`
      },
      { status: 400 }
    )
  }
  if (!keyMatchesProvider(provider, apiKey)) {
    return NextResponse.json(
      {
        error: `Enter a ${PROVIDER_INFO[provider].label} key. It looks like ${PROVIDER_INFO[provider].placeholder}.`
      },
      { status: 400 }
    )
  }

  const modelText = typeof body?.model === 'string' ? body.model.trim() : ''
  if (modelText && !isModelId(modelText)) {
    return NextResponse.json(
      { error: 'The model id can use letters, numbers, and . _ : / -' },
      { status: 400 }
    )
  }

  const accepted = await providerKeyAccepted(provider, apiKey)
  if (accepted === 'rejected') {
    return NextResponse.json(
      { error: `${PROVIDER_INFO[provider].label} rejected that key. Check it and try again.` },
      { status: 400 }
    )
  }
  if (accepted === 'unavailable') {
    return NextResponse.json(
      { error: `Could not reach ${PROVIDER_INFO[provider].label} to check that key. Try again in a moment.` },
      { status: 503 }
    )
  }

  try {
    const saved = await saveUserChatKey(id, provider, apiKey, modelText || null)
    return NextResponse.json({ configured: true, ...saved })
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

export async function DELETE() {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteUserChatKey(id)
    return NextResponse.json({ configured: false, hint: null, provider: null, model: null })
  } catch {
    console.error('Removing an API key failed')
    return NextResponse.json({ error: 'Could not remove that key.' }, { status: 503 })
  }
}
