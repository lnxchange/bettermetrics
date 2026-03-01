/**
 * Retroactive article content cleaning script.
 *
 * Removes Perplexity logo images and Sources sections from every article
 * currently stored in the database.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/clean-all-articles.ts
 *
 * Or add to package.json:
 *   "clean-articles": "ts-node scripts/clean-all-articles.ts"
 */

import { createClient } from '@supabase/supabase-js'
import { cleanArticleContent } from '../lib/article-content-cleaner'

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function cleanAllArticles() {
  console.log('Fetching all articles...\n')

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, content')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching articles:', error.message)
    process.exit(1)
  }

  if (!articles || articles.length === 0) {
    console.log('No articles found.')
    return
  }

  console.log(`Found ${articles.length} articles to process.\n`)

  let updated = 0
  let unchanged = 0

  for (const article of articles) {
    const cleaned = cleanArticleContent(article.content ?? '')

    if (cleaned === (article.content ?? '').trimEnd() + '\n') {
      unchanged++
      continue
    }

    const { error: updateError } = await supabase
      .from('articles')
      .update({ content: cleaned, updated_at: new Date().toISOString() })
      .eq('id', article.id)

    if (updateError) {
      console.error(`  FAILED "${article.title}": ${updateError.message}`)
    } else {
      console.log(`  Cleaned: "${article.title}" (${article.slug})`)
      updated++
    }
  }

  console.log(`\nDone. ${updated} articles updated, ${unchanged} already clean.`)
}

cleanAllArticles().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
