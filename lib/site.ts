/**
 * Canonical site identity. Every piece of metadata, JSON-LD and the sitemap
 * read from here so the brand and origin are defined once.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aimtheory.org').replace(/\/$/, '')
export const SITE_NAME = 'The AIM Framework'
export const SITE_AUTHOR = 'Yule Guttenbeil'
export const SITE_LOGO_PATH = '/aim-logo.png'
export const SITE_OG_IMAGE_PATH = '/aim-og.png'

/**
 * Default Open Graph image. Next merges `openGraph` shallowly, so a page that
 * sets its own `openGraph` loses the root image unless it includes this.
 */
export const SITE_OG_IMAGE = {
  url: SITE_OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: 'The AIM Framework: Appetites, Intrinsic Motivation, Mimetic Desire'
}

/** Keep meta descriptions inside the 70-160 character window search engines show. */
export function metaDescription(text: string, max = 158, pad = ' Part of the AIM Framework, a general theory of human motivation.') {
  let clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length < 70) clean = `${clean}${clean.endsWith('.') ? '' : '.'}${pad}`
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const boundary = cut.lastIndexOf(' ')
  return `${cut.slice(0, boundary > 40 ? boundary : cut.length).replace(/[,;:\s]+$/, '')}…`
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
