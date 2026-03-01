import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { cleanArticleContent } from '@/lib/article-content-cleaner'

// GET - Fetch article by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ article: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const body = await req.json()
    const {
      title,
      slug,
      content,
      author,
      category,
      tags,
      featured_image_url,
      meta_title,
      meta_description,
      written_at,
      linkedin_message,
      facebook_message,
      x_message,
      status
    } = body

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = cleanArticleContent(content)
    if (author !== undefined) updateData.author = author
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (featured_image_url !== undefined) updateData.featured_image_url = featured_image_url
    if (meta_title !== undefined) updateData.meta_title = meta_title || title
    if (meta_description !== undefined) updateData.meta_description = meta_description

    if (written_at !== undefined) {
      updateData.written_at = written_at || null
    }

    if (status !== undefined && ['draft', 'scheduled', 'published'].includes(status)) {
      updateData.status = status
      if (status === 'draft') {
        updateData.published_at = null
      } else if (status === 'published') {
        updateData.published_at = new Date().toISOString()
      }
    }

    if (linkedin_message !== undefined || facebook_message !== undefined || x_message !== undefined) {
      updateData.structured_data = {
        social_messages: {
          linkedin: linkedin_message,
          facebook: facebook_message,
          x: x_message
        }
      }
    }

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article: data, message: 'Article updated successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

