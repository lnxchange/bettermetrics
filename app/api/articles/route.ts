import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { optimizeArticleSEO } from '@/lib/seo-optimizer'

// GET - List articles
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ articles: data, total: count }, { status: 200 })
  } catch (error) {
    console.error('GET articles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create new article
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const session = await auth({ cookieStore })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    const body = await req.json()
    const {
      title,
      slug,
      content,
      author,
      category,
      tags,
      featuredImage,
      metaDescription,
      linkedinMessage,
      facebookMessage,
      xMessage,
      status
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Generate meta title if not provided
    const metaTitle = body.metaTitle || title

    const publishDate = status === 'published' ? new Date().toISOString() : null
    let resolvedMetaTitle = metaTitle
    let resolvedMetaDescription = metaDescription
    let resolvedStructuredData = body.structuredData || null
    let seoOptimizedAt: string | null = null

    // Auto-generate SEO when publishing and fields are missing
    if (
      status === 'published' &&
      (!resolvedMetaTitle || !resolvedMetaDescription || !resolvedStructuredData)
    ) {
      try {
        const optimization = await optimizeArticleSEO({
          title,
          content,
          slug,
          author: author || undefined,
          category: category || undefined,
          publishedAt: publishDate || undefined
        })
        resolvedMetaTitle = resolvedMetaTitle || optimization.metaTitle
        resolvedMetaDescription = resolvedMetaDescription || optimization.metaDescription
        resolvedStructuredData = resolvedStructuredData || optimization.structuredData
        seoOptimizedAt = new Date().toISOString()
      } catch (seoError) {
        console.error('Auto SEO on create failed:', seoError)
      }
    }

    // Insert article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content,
        author,
        category,
        tags: tags || [],
        featured_image_url: featuredImage,
        meta_title: resolvedMetaTitle,
        meta_description: resolvedMetaDescription,
        structured_data: resolvedStructuredData,
        seo_optimized_at: seoOptimizedAt,
        status: status || 'draft',
        user_id: session.user.id,
        published_at: publishDate
      })
      .select()
      .single()

    if (articleError) {
      console.error('Article insert error:', articleError)
      if (articleError.code === '23505') {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 400 }
        )
      }
      throw articleError
    }

    // If publishing, create social media posts
    if (status === 'published' && article) {
      const socialPosts = []

      if (linkedinMessage) {
        socialPosts.push({
          article_id: article.id,
          platform: 'linkedin',
          post_text: linkedinMessage,
          status: 'pending'
        })
      }

      if (facebookMessage) {
        socialPosts.push({
          article_id: article.id,
          platform: 'facebook',
          post_text: facebookMessage,
          status: 'pending'
        })
      }

      if (xMessage) {
        socialPosts.push({
          article_id: article.id,
          platform: 'x',
          post_text: xMessage,
          status: 'pending'
        })
      }

      if (socialPosts.length > 0) {
        const { error: socialError } = await supabase
          .from('social_posts')
          .insert(socialPosts)

        if (socialError) {
          console.error('Social posts insert error:', socialError)
          // Don't fail the article creation if social posts fail
        }
      }

      // Revalidate paths
      revalidatePath('/articles')
      revalidatePath(`/articles/${slug}`)
    }

    return NextResponse.json(
      { article, message: 'Article created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST article error:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

