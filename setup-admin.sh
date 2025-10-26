#!/bin/bash

# Admin Setup Script for Use Better Metrics
# This script helps you set up admin access

echo "🔧 Admin Setup for Use Better Metrics"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with the following variables:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "ADMIN_SETUP_SECRET=your_admin_setup_secret_here"
    echo ""
    exit 1
fi

# Generate a random admin setup secret if not set
if ! grep -q "ADMIN_SETUP_SECRET=" .env.local; then
    SECRET=$(openssl rand -hex 32)
    echo "ADMIN_SETUP_SECRET=$SECRET" >> .env.local
    echo "✅ Generated ADMIN_SETUP_SECRET: $SECRET"
fi

# Extract the secret
ADMIN_SECRET=$(grep "ADMIN_SETUP_SECRET=" .env.local | cut -d '=' -f2)

echo "📋 Setup Instructions:"
echo "======================"
echo ""
echo "1. Make sure Supabase is running locally:"
echo "   supabase start"
echo ""
echo "2. Run the database migration:"
echo "   supabase db reset"
echo ""
echo "3. Sign up for an account on your site"
echo ""
echo "4. Set yourself as admin by visiting:"
echo "   http://localhost:3000/api/admin/set-admin?secret=$ADMIN_SECRET"
echo ""
echo "5. Access the admin panel at:"
echo "   http://localhost:3000/admin"
echo ""
echo "6. After setup, remove ADMIN_SETUP_SECRET from .env.local for security"
echo ""
echo "⚠️  Important: Keep your ADMIN_SETUP_SECRET secure and delete it after setup!"
