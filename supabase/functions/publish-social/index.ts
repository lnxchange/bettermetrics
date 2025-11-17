/**
 * Social Media Distribution Edge Function
 * 
 * STATUS: PHASE 2 - AWAITING API CREDENTIALS
 * 
 * This function will post articles to LinkedIn, Facebook, and X (Twitter)
 * when enabled in Phase 2 after obtaining API credentials.
 * 
 * Required Environment Variables (to be added in Supabase Dashboard):
 * - LINKEDIN_CLIENT_ID
 * - LINKEDIN_CLIENT_SECRET
 * - LINKEDIN_ACCESS_TOKEN
 * - LINKEDIN_PERSON_URN
 * - FACEBOOK_APP_ID
 * - FACEBOOK_APP_SECRET
 * - FACEBOOK_PAGE_ID
 * - FACEBOOK_PAGE_ACCESS_TOKEN
 * - X_API_KEY
 * - X_API_SECRET
 * - X_ACCESS_TOKEN
 * - X_ACCESS_TOKEN_SECRET
 * - X_BEARER_TOKEN
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - SITE_URL
 */

// Deno-compatible imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface SocialPost {
  id: string
  article_id: string
  platform: 'linkedin' | 'facebook' | 'x'
  post_text: string
  status: string
  retry_count: number
}

serve(async (req) => {
  try {
    const { articleId } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Fetch article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single()
      
    if (articleError || !article) {
      throw new Error('Article not found')
    }
    
    const siteUrl = Deno.env.get('SITE_URL') || 'https://usebettermetrics.com'
    const articleUrl = `${siteUrl}/articles/${article.slug}`
    
    // Fetch pending social posts
    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'pending')
      
    if (postsError) {
      throw new Error('Failed to fetch social posts')
    }
    
    const results = []
    
    for (const post of (posts || [])) {
      try {
        let result
        
        switch (post.platform) {
          case 'linkedin':
            result = await postToLinkedIn(post.post_text, articleUrl)
            break
          case 'facebook':
            result = await postToFacebook(post.post_text, articleUrl)
            break
          case 'x':
            result = await postToX(post.post_text, articleUrl)
            break
          default:
            throw new Error(`Unknown platform: ${post.platform}`)
        }
        
        // Update status
        await supabase
          .from('social_posts')
          .update({ 
            status: 'posted', 
            external_post_id: result.id,
            posted_at: new Date().toISOString()
          })
          .eq('id', post.id)
          
        results.push({ platform: post.platform, success: true })
        
      } catch (error) {
        // Log error and mark for retry
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        await supabase
          .from('social_posts')
          .update({ 
            status: 'failed',
            error_message: errorMessage,
            retry_count: post.retry_count + 1
          })
          .eq('id', post.id)
          
        results.push({ platform: post.platform, success: false, error: errorMessage })
      }
    }
    
    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Post to LinkedIn using UGC Posts API
 * Requires LinkedIn OAuth credentials
 */
async function postToLinkedIn(text: string, url: string) {
  // PHASE 2 IMPLEMENTATION
  // This will be implemented once LinkedIn API credentials are obtained
  throw new Error('LinkedIn posting not yet implemented - awaiting API credentials')
  
  /* TEMPLATE FOR PHASE 2:
  const accessToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
  const personUrn = Deno.env.get('LINKEDIN_PERSON_URN')
  
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'ARTICLE',
          media: [{
            status: 'READY',
            originalUrl: url
          }]
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    })
  })
  
  return await response.json()
  */
}

/**
 * Post to Facebook Page using Graph API
 * Requires Facebook Page access token
 */
async function postToFacebook(text: string, url: string) {
  // PHASE 2 IMPLEMENTATION
  // This will be implemented once Facebook API credentials are obtained
  throw new Error('Facebook posting not yet implemented - awaiting API credentials')
  
  /* TEMPLATE FOR PHASE 2:
  const pageId = Deno.env.get('FACEBOOK_PAGE_ID')
  const accessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN')
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        link: url,
        access_token: accessToken
      })
    }
  )
  
  return await response.json()
  */
}

/**
 * Post to X (Twitter) using API v2
 * Requires X API credentials
 */
async function postToX(text: string, url: string) {
  // PHASE 2 IMPLEMENTATION
  // This will be implemented once X API credentials are obtained
  throw new Error('X posting not yet implemented - awaiting API credentials')
  
  /* TEMPLATE FOR PHASE 2:
  const accessToken = Deno.env.get('X_ACCESS_TOKEN')
  const tweet = `${text}\n\n${url}`
  
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: tweet })
  })
  
  return await response.json()
  */
}

