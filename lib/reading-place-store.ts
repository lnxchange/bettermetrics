import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { chatStore } from '@/lib/chat-store'
import { ReadingPlace, ReadingPlaces } from '@/lib/reading-place'

type PlaceRow = {
  slug: string
  heading_id: string
  offset_px: number
  ratio: number
  updated_at: string
}

function fromRow(row: PlaceRow): ReadingPlace | null {
  const at = Date.parse(row.updated_at)
  if (!Number.isFinite(at)) return null
  const place = {
    id: row.heading_id,
    offset: row.offset_px,
    ratio: row.ratio,
    at
  }
  const parsed = ReadingPlaces.parseBody(
    { places: { [row.slug]: place } },
    Math.max(Date.now(), at)
  )
  return parsed ? parsed[row.slug] ?? null : null
}

export class ReadingPlaceStore {
  static async read(
    userId: string,
    slug: string,
    client: SupabaseClient | null = chatStore()
  ): Promise<ReadingPlace | null> {
    if (!client) return null
    const { data, error } = await client
      .from('reading_places')
      .select('slug, heading_id, offset_px, ratio, updated_at')
      .eq('user_id', userId)
      .eq('slug', slug)
      .maybeSingle()
    if (error || !data) return null
    return fromRow(data as PlaceRow)
  }

  /** Keeps a place only when it is newer than the one already stored. */
  static async save(
    userId: string,
    places: Readonly<Record<string, ReadingPlace>>,
    client: SupabaseClient | null = chatStore()
  ): Promise<boolean> {
    if (!client) return false
    const incoming = Object.entries(places)
    if (incoming.length === 0) return true
    const { data, error } = await client
      .from('reading_places')
      .select('slug, updated_at')
      .eq('user_id', userId)
    if (error) return false
    const stored = new Map(
      (data ?? []).map(row => [
        row.slug as string,
        Date.parse(row.updated_at as string)
      ])
    )
    let room = 80 - stored.size
    const fresh = incoming.filter(([slug, place]) => {
      const previous = stored.get(slug)
      if (previous === undefined) {
        if (room <= 0) return false
        room -= 1
        return true
      }
      return place.at > previous
    })
    if (fresh.length === 0) return true
    const rows = fresh.map(([slug, place]) => ({
      user_id: userId,
      slug,
      heading_id: place.id,
      offset_px: place.offset,
      ratio: place.ratio,
      updated_at: new Date(place.at).toISOString()
    }))
    const saved = await client
      .from('reading_places')
      .upsert(rows, { onConflict: 'user_id,slug' })
    return !saved.error
  }
}

export async function chapterReadingPlace(
  slug: string,
  cookieStore: ReturnType<typeof cookies>
): Promise<{ signedIn: boolean; place: ReadingPlace | null }> {
  const local =
    ReadingPlaces.decode(cookieStore.get(ReadingPlaces.cookie)?.value)[slug] ??
    null
  const hasSession = cookieStore
    .getAll()
    .some(cookie => cookie.name.includes('-auth-token'))
  if (!hasSession) return { signedIn: false, place: local }
  const session = await auth({ cookieStore })
  if (!session?.user?.id) return { signedIn: false, place: local }
  const account = await ReadingPlaceStore.read(session.user.id, slug)
  return { signedIn: true, place: ReadingPlaces.choose(local, account) }
}
