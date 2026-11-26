import { readFile } from 'fs/promises'
import path from 'path'
import { ImageResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { ArticleGate } from '@/lib/publishing/gate'
import { PublishingConfig } from '@/lib/publishing/config'
import { ArticleRecord, PublishingDb } from '@/lib/publishing/public'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function brandImage() {
  const bytes = await readFile(path.join(process.cwd(), 'public/aim-og.png'))
  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}

async function imageSource(value: string) {
  if (value.startsWith('/')) {
    const bytes = await readFile(path.join(process.cwd(), 'public', value.replace(/^\/+/, '')))
    const type = value.endsWith('.jpg') || value.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'
    return `data:${type};base64,${bytes.toString('base64')}`
  }
  const response = await fetch(value)
  if (!response.ok) throw new Error('image')
  const bytes = Buffer.from(await response.arrayBuffer())
  const type = response.headers.get('content-type') || 'image/jpeg'
  return `data:${type};base64,${bytes.toString('base64')}`
}

/** 1200 by 630 card. Drafts and tests get the plain site image, with no title. */
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = PublishingDb.anon()
  if (!supabase) return brandImage()
  const { data } = await supabase
    .from('articles')
    .select('title, featured_image_url, image_alt, status, pipeline, editorial_status, scheduled_publish_at, preview_only')
    .eq('slug', params.slug)
    .maybeSingle()
  const row = data as ArticleRecord | null
  const config = PublishingConfig.gate(process.env, new Date())
  if (!row || !ArticleGate.isPublic(ArticleGate.fromRow(row), config) || !row.featured_image_url) {
    return brandImage()
  }

  try {
    const src = row.featured_image_url.startsWith('http')
      ? await imageSource(row.featured_image_url)
      : row.featured_image_url.startsWith('/')
        ? await imageSource(row.featured_image_url)
        : `${SITE_URL}${row.featured_image_url}`
    const title = row.title.length > 120 ? `${row.title.slice(0, 119).trimEnd()}…` : row.title
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            position: 'relative',
            background: '#1E3A8A'
          }}
        >
          <img src={src} width={1200} height={630} style={{ objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '280px',
              display: 'flex',
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0))'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '56px',
              right: '56px',
              bottom: '48px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ color: '#dbeafe', fontSize: '28px', marginBottom: '12px' }}>The AIM Framework</div>
            <div style={{ color: 'white', fontSize: '54px', lineHeight: 1.15, fontWeight: 700 }}>{title}</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return brandImage()
  }
}
