import { cached } from '@/lib/cached'
import { PublishingConfig } from '@/lib/publishing/config'
import { PublishingDb } from '@/lib/publishing/public'

const loadRow = cached(
  async () => {
    const supabase = PublishingDb.anon()
    if (!supabase) return null
    const { data } = await supabase
      .from('publishing_settings')
      .select('go_live_at, publishing_paused, legacy_retirement, syndication_enabled')
      .eq('id', 1)
      .maybeSingle()
    return data
  },
  ['publishing-settings'],
  { revalidate: 300, tags: ['articles'] }
)

/** Env wins when it is set. Otherwise the publishing_settings row. */
export class PublishingSettings {
  static async gate(now = new Date()) {
    const row = await loadRow()
    return PublishingConfig.gate(process.env, now, row)
  }
}
