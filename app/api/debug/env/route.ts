import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    // Supabase Configuration
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    
    // API Keys
    hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    
    // Analytics
    hasGAId: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    gaIdPreview: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?
      `${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.substring(0, 6)}...` : 'Missing',
    
    // Perplexity API Key Info (first 10 chars for debugging)
    perplexityKeyPreview: process.env.PERPLEXITY_API_KEY ? 
      `${process.env.PERPLEXITY_API_KEY.substring(0, 10)}...` : 'Missing',
    
    // Environment Info
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
    
    // Runtime Info
    runtime: process.env.NEXT_RUNTIME || 'unknown'
  }
  
  return NextResponse.json(envCheck, { 
    headers: { 
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
