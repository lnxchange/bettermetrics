#!/bin/bash

# Diagnostic Test Script for Better Metrics Chat Application
# This script tests all the diagnostic endpoints to help identify issues

echo "🔍 Better Metrics Diagnostic Test"
echo "================================="
echo ""

# Use production URL by default
BASE_URL="https://usebettermetrics.com"
if [ ! -z "$1" ]; then
    BASE_URL="$1"
fi

echo "Testing against: $BASE_URL"
echo ""

# Test 1: Environment Variables
echo "📋 Testing Environment Variables..."
echo "-----------------------------------"
curl -s "$BASE_URL/api/debug/env" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/debug/env"
echo ""
echo ""

# Test 2: Perplexity API
echo "🤖 Testing Perplexity API..."
echo "----------------------------"
curl -s -X POST "$BASE_URL/api/debug/perplexity-test" \
  -H "Content-Type: application/json" \
  -d '{"testMessage": "Hello from diagnostic script"}' | jq '.' 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/debug/perplexity-test" \
  -H "Content-Type: application/json" \
  -d '{"testMessage": "Hello from diagnostic script"}'
echo ""
echo ""

# Test 3: Supabase Connection
echo "🗄️  Testing Supabase Connection..."
echo "----------------------------------"
curl -s "$BASE_URL/api/debug/supabase-test" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/debug/supabase-test"
echo ""
echo ""

# Test 4: Chat API (should return 401 if not authenticated)
echo "💬 Testing Chat API (expect 401 if not authenticated)..."
echo "------------------------------------------------------"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "test"}], "id": "diagnostic-test"}' \
  -w "HTTP Status: %{http_code}\n" | jq '.' 2>/dev/null || \
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "test"}], "id": "diagnostic-test"}' \
  -w "HTTP Status: %{http_code}\n"
echo ""
echo ""

echo "✅ Diagnostic tests completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Check the results above for any errors"
echo "2. Visit $BASE_URL/debug for the interactive diagnostic page"
echo "3. Check your Vercel logs for detailed error information"
echo "4. Verify your environment variables are set correctly in Vercel dashboard"
echo ""
echo "🔧 Common Issues:"
echo "- 401 errors: Authentication/session issues"
echo "- 500 errors: Server-side errors (check Vercel logs)"
echo "- 503 errors: Missing environment variables in Vercel"
echo "- Perplexity API errors: Check API key and rate limits"
echo ""
echo "🌐 Production Environment:"
echo "- All tests run against live production environment"
echo "- No localhost dependencies"
echo "- Results reflect actual user experience"
