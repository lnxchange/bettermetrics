'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    setResults([])
    const newResults: DiagnosticResult[] = []

    // Get the current domain for API calls
    const baseUrl = window.location.origin

    try {
      // Test 1: Environment Variables
      try {
        const envResponse = await fetch(`${baseUrl}/api/debug/env`)
        const envData = await envResponse.json()
        
        if (envResponse.ok) {
          newResults.push({
            test: 'Environment Variables',
            status: 'success',
            message: 'Environment check completed',
            details: envData
          })
        } else {
          newResults.push({
            test: 'Environment Variables',
            status: 'error',
            message: 'Failed to check environment variables',
            details: envData
          })
        }
      } catch (error) {
        newResults.push({
          test: 'Environment Variables',
          status: 'error',
          message: 'Environment check failed',
          details: error
        })
      }

      // Test 2: Perplexity API
      try {
        const perplexityResponse = await fetch(`${baseUrl}/api/debug/perplexity-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testMessage: 'Diagnostic test message' })
        })
        const perplexityData = await perplexityResponse.json()
        
        if (perplexityResponse.ok && perplexityData.success) {
          newResults.push({
            test: 'Perplexity API',
            status: 'success',
            message: 'Perplexity API is working',
            details: perplexityData
          })
        } else {
          newResults.push({
            test: 'Perplexity API',
            status: 'error',
            message: 'Perplexity API test failed',
            details: perplexityData
          })
        }
      } catch (error) {
        newResults.push({
          test: 'Perplexity API',
          status: 'error',
          message: 'Perplexity API test failed',
          details: error
        })
      }

      // Test 3: Authentication Status
      try {
        const authResponse = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: [{ role: 'user', content: 'test' }],
            id: 'diagnostic-test'
          })
        })
        
        if (authResponse.status === 401) {
          newResults.push({
            test: 'Authentication',
            status: 'warning',
            message: 'Authentication required (expected for unauthenticated requests)',
            details: { status: authResponse.status, statusText: authResponse.statusText }
          })
        } else if (authResponse.ok) {
          newResults.push({
            test: 'Authentication',
            status: 'success',
            message: 'Authentication is working',
            details: { status: authResponse.status }
          })
        } else {
          newResults.push({
            test: 'Authentication',
            status: 'error',
            message: 'Authentication test failed',
            details: { status: authResponse.status, statusText: authResponse.statusText }
          })
        }
      } catch (error) {
        newResults.push({
          test: 'Authentication',
          status: 'error',
          message: 'Authentication test failed',
          details: error
        })
      }

      // Test 4: Supabase Connection (if authenticated)
      try {
        const supabaseResponse = await fetch(`${baseUrl}/api/debug/supabase-test`)
        const supabaseData = await supabaseResponse.json()
        
        if (supabaseResponse.ok) {
          newResults.push({
            test: 'Supabase Connection',
            status: 'success',
            message: 'Supabase connection is working',
            details: supabaseData
          })
        } else {
          newResults.push({
            test: 'Supabase Connection',
            status: 'warning',
            message: 'Supabase test not available or failed',
            details: supabaseData
          })
        }
      } catch (error) {
        newResults.push({
          test: 'Supabase Connection',
          status: 'warning',
          message: 'Supabase test not available',
          details: error
        })
      }

    } catch (error) {
      newResults.push({
        test: 'General',
        status: 'error',
        message: 'Diagnostic failed',
        details: error
      })
    }

    setResults(newResults)
    setIsRunning(false)
    toast.success('Diagnostic completed')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">System Diagnostic</h1>
        <p className="text-gray-600">
          Run comprehensive tests to identify issues with authentication, API connections, and configuration.
        </p>
      </div>

      <div className="mb-6">
        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostic'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${getStatusColor(result.status)}`}>
                  <span className={`w-3 h-3 rounded-full ${
                    result.status === 'success' ? 'bg-green-500' :
                    result.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  {result.test}
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              {result.details && (
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to Use This Diagnostic:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Run Full Diagnostic" to test all components</li>
          <li>Check the results for any errors or warnings</li>
          <li>Look at the details section for specific error information</li>
          <li>Use the environment variables endpoint at <code>/api/debug/env</code> to check configuration</li>
          <li>Test Perplexity API directly at <code>/api/debug/perplexity-test</code></li>
        </ol>
        
        <h3 className="font-semibold mb-2 mt-4">Production Environment Notes:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>All tests run against the live production environment</li>
          <li>No localhost dependencies - everything uses your actual domain</li>
          <li>Results reflect the actual user experience</li>
          <li>Check Vercel logs for detailed server-side error information</li>
          <li>Environment variables are managed in the Vercel dashboard</li>
        </ul>
      </div>
    </div>
  )
}
