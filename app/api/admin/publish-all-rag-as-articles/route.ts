import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/db_types'
import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { cleanArticleContent, extractDateFromContent } from '@/lib/article-content-cleaner'

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service unavailable - Supabase not configured' }, { status: 503 })
    }

    const session = await auth({ cookieStore })
    if (!session || !session.user || !session.user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: documents, error: fetchError } = await supabase
      .from('rag_documents')
      .select('id, title, content')
      .not('content', 'is', null)

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch RAG documents' }, { status: 500 })
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ success: true, created: 0, skipped: 0, errors: [] })
    }

    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const doc of documents) {
      if (!doc.content || !doc.title) {
        skipped++
        continue
      }

      try {
        let slug = toSlug(doc.title)

        // Check if an article with this slug already exists
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (existing) {
          skipped++
          continue
        }

        const cleanedContent = cleanArticleContent(doc.content)
        const parsedDate = extractDateFromContent(cleanedContent)
        const publishDate = parsedDate ?? new Date().toISOString()

        const articlePayload = {
          title: doc.title,
          slug,
          content: cleanedContent,
          author: 'Yule Guttenbeil',
          status: 'published' as const,
          published_at: publishDate,
          written_at: parsedDate ?? publishDate,
          user_id: session.user.id,
          meta_title: doc.title,
          tags: [] as string[]
        }

        const { error: insertError } = await supabase
          .from('articles')
          .insert(articlePayload)

        if (insertError) {
          if (insertError.code === '23505') {
            // Slug collision race — retry with timestamp suffix
            slug = `${slug}-${Date.now()}`
            const { error: retryError } = await supabase
              .from('articles')
              .insert({ ...articlePayload, slug })
            if (retryError) throw retryError
          } else {
            throw insertError
          }
        }

        created++
      } catch (err) {
        const msg = `Failed to publish "${doc.title}": ${err instanceof Error ? err.message : 'Unknown error'}`
        console.error(msg)
        errors.push(msg)
      }
    }

    revalidatePath('/articles')

    return NextResponse.json({ success: true, created, skipped, errors })
  } catch (error) {
    console.error('publish-all-rag-as-articles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
