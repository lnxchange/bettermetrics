/**
 * Build the draft treatise ebook and upload it when the current draft is
 * missing or at least seven days old.
 *
 *   TREATISE_EPUB=1 npx tsx scripts/publish-treatise-ebook.ts
 *
 * The chapter sync stays on its own schedule. This step is the weekly one.
 */
import { execFileSync } from 'child_process'
import { config } from 'dotenv'
import { mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: path.join(process.cwd(), '.env.local') })

const BUCKET = 'treatise-ebooks'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DEFAULT_DIR =
  '/Users/yuleguttenbeil/Library/CloudStorage/GoogleDrive-yule@mode.law/My Drive/AIM Corpus/aim-treatise/CORPUS/TREATISE'
const BUILDER =
  process.env.EPUB_BUILDER ??
  '/Users/yuleguttenbeil/Documents/Cursor/aim-treatise/build/build_epub.py'

interface CurrentDraft {
  builtAt?: string
  filename?: string
}

interface BuiltEbook {
  path: string
  sourceDate: string
  filename: string
}

function isCurrent(draft: CurrentDraft | null) {
  if (!draft?.builtAt) return false
  const built = Date.parse(draft.builtAt)
  if (Number.isNaN(built)) return false
  return Date.now() - built < WEEK_MS
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase service credentials')
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  if (process.env.TREATISE_EPUB !== '1') {
    const { data, error } = await supabase.storage.from(BUCKET).download('current.json')
    if (!error && data) {
      const existing = JSON.parse(await data.text()) as CurrentDraft
      if (isCurrent(existing)) {
        console.log(`ebook draft is current (${existing.filename ?? 'unnamed'}), skipping`)
        return
      }
    }
  }

  const mmdc = process.env.MMDC ?? path.join(process.cwd(), 'node_modules/.bin/mmdc')
  const out = mkdtempSync(path.join(tmpdir(), 'aim-epub-'))
  try {
    execFileSync(
      'python3',
      [
        BUILDER,
        '--treatise-dir',
        process.env.TREATISE_DIR ?? DEFAULT_DIR,
        '--mmdc',
        mmdc,
        '--out',
        out
      ],
      { stdio: 'inherit' }
    )
    const built = JSON.parse(readFileSync(path.join(out, 'ebook.json'), 'utf8')) as BuiltEbook
    const bytes = readFileSync(built.path)
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(built.filename, bytes, {
      contentType: 'application/epub+zip',
      upsert: true,
      cacheControl: '60'
    })
    if (uploadError) throw new Error(`ebook upload: ${uploadError.message}`)

    const { data: publicFile } = supabase.storage.from(BUCKET).getPublicUrl(built.filename)
    const builtAt = new Date().toISOString()
    const current = {
      sourceDate: built.sourceDate,
      filename: built.filename,
      url: `${publicFile.publicUrl}?v=${encodeURIComponent(builtAt)}`,
      builtAt
    }
    const { error: pointerError } = await supabase.storage.from(BUCKET).upload(
      'current.json',
      Buffer.from(JSON.stringify(current)),
      { contentType: 'application/json', upsert: true, cacheControl: '60' }
    )
    if (pointerError) throw new Error(`ebook pointer: ${pointerError.message}`)
    console.log(`ebook uploaded ${built.filename}`)
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
