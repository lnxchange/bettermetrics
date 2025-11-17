import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { optimizeArticleSEO } from '@/lib/seo-optimizer'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const session = await auth({ cookieStore })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    // Fetch the article
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !article) {
      return NextResponse.json(
        { error: 'Article not found or unauthorized' },
        { status: 404 }
      )
    }

    // Optimize SEO
    const optimization = await optimizeArticleSEO({
      title: article.title,
      content: article.content,
      slug: article.slug,
      author: article.author || undefined,
      category: article.category || undefined
    })

    // Update article with optimized SEO data
    const { data: updatedArticle, error: updateError } = await supabase
      .from('articles')
      .update({
        meta_title: optimization.metaTitle,
        meta_description: optimization.metaDescription,
        structured_data: optimization.structuredData,
        seo_optimized_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      article: updatedArticle,
      optimization,
      message: 'SEO optimization completed successfully'
    })
  } catch (error) {
    console.error('SEO optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize SEO', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

