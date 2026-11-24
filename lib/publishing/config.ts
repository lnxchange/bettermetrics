import { GateConfig, PublishingFlags } from '@/lib/publishing/types'

export type PublishingEnv = Record<string, string | undefined>

/**
 * Switches. An environment variable wins when it is set, including when it is
 * the string "false". Otherwise the publishing_settings row is used. With
 * neither, publishing stays closed until 11 January 2027 and every optional
 * switch stays off.
 */
export class PublishingConfig {
  static readonly defaultGoLive = '2027-01-11T00:00:00+11:00'

  static flag(value: string | undefined, fallback: boolean) {
    if (value === undefined || value.trim() === '') return fallback
    return value === 'true' || value === '1'
  }

  static instant(value: string | null | undefined, fallback: Date) {
    if (!value || !value.trim()) return fallback
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? fallback : parsed
  }

  static flags(
    env: PublishingEnv,
    stored?: {
      go_live_at?: string | null
      publishing_paused?: boolean | null
      legacy_retirement?: boolean | null
      syndication_enabled?: boolean | null
    } | null
  ): PublishingFlags {
    const fallbackGoLive = PublishingConfig.instant(PublishingConfig.defaultGoLive, new Date(0))
    return {
      goLiveAt: PublishingConfig.instant(
        env.ARTICLE_GO_LIVE_AT,
        PublishingConfig.instant(stored?.go_live_at, fallbackGoLive)
      ),
      publishingPaused: PublishingConfig.flag(
        env.ARTICLE_PUBLISHING_PAUSED,
        Boolean(stored?.publishing_paused)
      ),
      legacyRetirement: PublishingConfig.flag(
        env.ARTICLE_LEGACY_RETIREMENT,
        Boolean(stored?.legacy_retirement)
      ),
      syndicationEnabled: PublishingConfig.flag(
        env.ARTICLE_SYNDICATION_ENABLED,
        Boolean(stored?.syndication_enabled)
      )
    }
  }

  static gate(env: PublishingEnv, now: Date, stored?: Parameters<typeof PublishingConfig.flags>[1]): GateConfig {
    const flags = PublishingConfig.flags(env, stored)
    return { now, ...flags }
  }
}
