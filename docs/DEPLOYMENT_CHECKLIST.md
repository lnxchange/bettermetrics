# Production Deployment Checklist

## Prerequisites

- [ ] Supabase project created
- [ ] Vercel project created and linked to GitHub
- [ ] OpenAI API key obtained

## Supabase Configuration

### 1. Environment Variables

Set these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `OPENAI_API_KEY` - Your OpenAI API key

### 2. Run Migrations

1. Install Supabase CLI: `npm install -g supabase`
2. Link to project: `supabase link --project-ref YOUR_PROJECT_REF`
3. Push migrations: `supabase db push`

Or manually run migration files in Supabase Dashboard > SQL Editor

### 3. Configure Storage Buckets

The migrations should create buckets automatically, but verify in Supabase Dashboard > Storage:
- `research-documents` bucket exists and is public
- `rag-documents` bucket exists and is public

### 4. Enable pgvector Extension

In Supabase Dashboard > Database > Extensions:
- Enable `vector` extension

### 5. Create First Admin User

1. Sign up for account on your deployed site
2. Follow [ADMIN_SETUP.md](./ADMIN_SETUP.md) to grant admin access
3. Navigate to `/admin` to verify access

## Testing Checklist

- [ ] User can sign up
- [ ] User receives confirmation email
- [ ] User can sign in
- [ ] User can reset password
- [ ] User can access chat after login
- [ ] Chat retrieves RAG context from uploaded documents
- [ ] Admin can upload research documents
- [ ] Admin can upload RAG documents
- [ ] RAG documents are automatically processed and embedded
- [ ] Authenticated user can download research documents
- [ ] Download is tracked in `download_tracking` table
- [ ] User is marked as researcher after first download
- [ ] Admin can view download tracking data

## Post-Deployment

- [ ] Upload initial RAG documents with AIM Framework content
- [ ] Upload research documents for download
- [ ] Test chat with various queries to verify RAG is working
- [ ] Monitor Supabase logs for any errors
- [ ] Monitor Vercel logs for any errors
