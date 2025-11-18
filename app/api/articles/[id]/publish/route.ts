import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const body = await req.json()
    const { linkedinMessage, facebookMessage, xMessage } = body

    // 1. Update article status to published
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 })
    }

    // 2. Create social_posts records for each platform
    const socialPosts: any[] = []

    if (linkedinMessage?.trim()) {
      socialPosts.push({
        article_id: params.id,
        platform: 'linkedin',
        post_text: linkedinMessage.trim(),
        status: 'pending'
      })
    }

    if (facebookMessage?.trim()) {
      socialPosts.push({
        article_id: params.id,
        platform: 'facebook',
        post_text: facebookMessage.trim(),
        status: 'pending'
      })
    }

    if (xMessage?.trim()) {
      socialPosts.push({
        article_id: params.id,
        platform: 'x',
        post_text: xMessage.trim(),
        status: 'pending'
      })
    }

    let socialResults: any[] = []

    if (socialPosts.length > 0) {
      // Insert social posts
      const { error: postsError } = await supabase
        .from('social_posts')
        .insert(socialPosts)

      if (postsError) {
        console.error('Error creating social posts:', postsError)
      }

      // 3. Try to call Edge Function to post to social media
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && serviceRoleKey) {
          const edgeResponse = await fetch(
            `${supabaseUrl}/functions/v1/publish-social`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceRoleKey}`
              },
              body: JSON.stringify({ articleId: params.id })
            }
          )

          if (edgeResponse.ok) {
            const edgeResult = await edgeResponse.json()
            socialResults = edgeResult.results || []
          } else {
            console.error('Edge function error:', await edgeResponse.text())
            // Mark as "not yet posted" - API credentials may not be configured
            socialResults = socialPosts.map(p => ({
              platform: p.platform,
              success: false,
              error: 'Social media APIs not yet configured. Posts saved for manual sharing.'
            }))
          }
        } else {
          // No Supabase configuration for Edge Function
          socialResults = socialPosts.map(p => ({
            platform: p.platform,
            success: false,
            error: 'Social media posting will be available once API credentials are configured.'
          }))
        }
      } catch (socialError) {
        console.error('Social media posting error:', socialError)
        // Article still published successfully, social media just failed
        socialResults = socialPosts.map(p => ({
          platform: p.platform,
          success: false,
          error: 'Social media posting failed. You can manually share the article.'
        }))
      }
    }

    return NextResponse.json({
      article,
      socialResults,
      message: 'Article published successfully!',
      warning: socialResults.some(r => !r.success) 
        ? 'Social media posting is not yet configured. Posts saved for manual sharing.'
        : undefined
    })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 }
    )
  }
}

