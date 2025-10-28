import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        error: 'Supabase not configured',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }, { status: 503 })
    }

    const cookieStore = cookies()
    
    // Create Supabase client
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    // Test 1: Get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    // Test 2: Test database connection (simple query)
    const { data: dbData, error: dbError } = await supabase
      .from('chats')
      .select('count')
      .limit(1)

    // Test 3: Check if tables exist
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        session: {
          hasSession: !!sessionData.session,
          userId: sessionData.session?.user?.id,
          error: sessionError?.message
        },
        database: {
          connected: !dbError,
          error: dbError?.message,
          hasData: !!dbData
        },
        tables: {
          accessible: !tablesError,
          error: tablesError?.message,
          tableCount: tablesData?.length || 0
        }
      },
      config: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    
    return NextResponse.json({
      error: 'Supabase test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
