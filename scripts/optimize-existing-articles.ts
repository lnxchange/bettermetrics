/**
 * Retroactive SEO Optimization Script
 * 
 * Run this script to optimize SEO for all existing published articles
 * that haven't been optimized yet.
 * 
 * Usage:
 *   npx ts-node scripts/optimize-existing-articles.ts
 * 
 * Or add to package.json scripts:
 *   "optimize-seo": "ts-node scripts/optimize-existing-articles.ts"
 */

import { createClient } from '@supabase/supabase-js'
import { optimizeArticleSEO } from '../lib/seo-optimizer'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

if (!process.env.PERPLEXITY_API_KEY) {
  console.error('ERROR: Missing PERPLEXITY_API_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Article {
  id: string
  title: string
  slug: string
  content: string
  author: string | null
  category: string | null
}

async function optimizeAllArticles() {
  console.log('🔍 Fetching articles without SEO optimization...\n')

  try {
    // Fetch all published articles without SEO optimization
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, content, author, category')
      .eq('status', 'published')
      .is('seo_optimized_at', null)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('❌ Error fetching articles:', error.message)
      throw error
    }

    if (!articles || articles.length === 0) {
      console.log('✅ No articles found that need SEO optimization')
      console.log('   All published articles are already optimized!')
      return
    }

    console.log(`📊 Found ${articles.length} articles to optimize\n`)
    console.log('═'.repeat(60))

    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      const progress = `[${i + 1}/${articles.length}]`

      console.log(`\n${progress} Optimizing: "${article.title}"`)
      console.log(`   Slug: ${article.slug}`)

      try {
        // Optimize SEO
        const optimization = await optimizeArticleSEO({
          title: article.title,
          content: article.content,
          slug: article.slug,
          author: article.author || undefined,
          category: article.category || undefined
        })

        // Update article with SEO data
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            meta_title: optimization.metaTitle,
            meta_description: optimization.metaDescription,
            structured_data: optimization.structuredData,
            seo_optimized_at: new Date().toISOString()
          })
          .eq('id', article.id)

        if (updateError) {
          throw updateError
        }

        console.log(`   ✅ Successfully optimized`)
        console.log(`   Meta Title: ${optimization.metaTitle.substring(0, 60)}...`)
        console.log(`   Meta Desc: ${optimization.metaDescription.substring(0, 60)}...`)
        successCount++

        // Rate limiting delay (2 seconds between requests to avoid API rate limits)
        if (i < articles.length - 1) {
          console.log('   ⏳ Waiting 2 seconds (rate limiting)...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

      } catch (error) {
        console.error(`   ❌ Failed to optimize:`, error instanceof Error ? error.message : 'Unknown error')
        failureCount++

        // Continue with next article even if one fails
        if (i < articles.length - 1) {
          console.log('   ⏳ Waiting 2 seconds before continuing...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('\n📈 Optimization Summary:')
    console.log(`   Total articles processed: ${articles.length}`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${failureCount}`)
    console.log(`   Success rate: ${((successCount / articles.length) * 100).toFixed(1)}%`)
    console.log('\n✨ Optimization complete!')

  } catch (error) {
    console.error('\n❌ Fatal error during optimization:', error)
    process.exit(1)
  }
}

// Run the script
console.log('🚀 Starting retroactive SEO optimization...\n')
optimizeAllArticles()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

