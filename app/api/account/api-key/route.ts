import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import {
  anthropicKeyAccepted,
  deleteUserAnthropicKey,
  getUserApiKeyStatus,
  isAnthropicApiKey,
  saveUserAnthropicKey
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
  if (!isAnthropicApiKey(apiKey)) {
    return NextResponse.json(
      { error: 'Enter an Anthropic API key. It starts with sk-ant-.' },
      { status: 400 }
    )
  }

  const accepted = await anthropicKeyAccepted(apiKey)
  if (accepted === 'rejected') {
    return NextResponse.json(
      { error: 'Anthropic rejected that key. Check it and try again.' },
      { status: 400 }
    )
  }
  if (accepted === 'unavailable') {
    return NextResponse.json(
      { error: 'Could not reach Anthropic to check that key. Try again in a moment.' },
      { status: 503 }
    )
  }

  try {
    const saved = await saveUserAnthropicKey(id, apiKey)
    return NextResponse.json({ configured: true, hint: saved.hint })
  } catch (error) {
    console.error('Saving an API key failed')
    const unavailable =
      error instanceof Error && error.message.includes('service role')
    return NextResponse.json(
      {
        error: unavailable
          ? 'API key storage is not configured yet.'
          : 'Could not save that key. Apply the user API key migration, then try again.'
      },
      { status: 503 }
    )
  }
}

export async function DELETE() {
  const id = await userId()
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteUserAnthropicKey(id)
    return NextResponse.json({ configured: false, hint: null })
  } catch {
    console.error('Removing an API key failed')
    return NextResponse.json({ error: 'Could not remove that key.' }, { status: 503 })
  }
}
