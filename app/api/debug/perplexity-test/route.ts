import { NextRequest, NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'

export async function POST(req: NextRequest) {
  try {
    const { testMessage = 'Hello, this is a test message.' } = await req.json()
    
    // Check if Perplexity API key is configured
    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json({ 
        error: 'Perplexity API key not configured',
        hasPerplexityKey: false
      }, { status: 503 })
    }
    
    // Create Perplexity client
    const config = new Configuration({
      apiKey: process.env.PERPLEXITY_API_KEY,
      basePath: 'https://api.perplexity.ai'
    })
    
    const client = new OpenAIApi(config)
    
    console.log('Testing Perplexity API with message:', testMessage)
    
    // Test with a simple request
    const apiResponse = await client.createChatCompletion({
      model: 'pplx-70b-online',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Respond briefly.' },
        { role: 'user', content: testMessage }
      ],
      temperature: 0.1,
      max_tokens: 100,
      stream: false
    })
    
    const completion = apiResponse.data.choices[0]?.message?.content || 'No response'
    
    return NextResponse.json({
      success: true,
      testMessage,
      response: completion,
      model: 'pplx-70b-online',
      timestamp: new Date().toISOString(),
      hasPerplexityKey: true
    })
    
  } catch (error) {
    console.error('Perplexity API test error:', error)
    
    return NextResponse.json({
      error: 'Perplexity API test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Perplexity API test endpoint',
    methods: ['POST'],
    usage: 'Send a POST request with optional testMessage in body'
  })
}
