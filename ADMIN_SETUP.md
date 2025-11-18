# Admin Setup Guide

This guide explains how to set up admin access for the AIM Framework website.

## What is an Admin?

Admins have full access to:
- ✅ View, edit, and publish all articles (including drafts)
- ✅ Upload and manage featured images
- ✅ Create and manage social media posts
- ✅ Upload and manage RAG documents (chatbot knowledge base)
- ✅ Upload and manage research documents
- ✅ View all users
- ✅ Access all admin panel features

Regular authenticated users can only:
- View published articles
- Use the chatbot
- Manage their own chat history

---

## Step 1: Run RLS Migrations

### Migration 1: Articles RLS Policies

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Fix articles table RLS to give admins full access
-- From: supabase/migrations/20250119000000_fix_articles_rls.sql

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own articles" ON articles;
DROP POLICY IF EXISTS "Users can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete all articles" ON articles;
DROP POLICY IF EXISTS "Public can view published articles" ON articles;

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view all articles"
ON articles FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert articles"
ON articles FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update all articles"
ON articles FOR UPDATE TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete all articles"
ON articles FOR DELETE TO authenticated
USING (is_admin());

-- Public policies
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "Authenticated users can view published articles"
ON articles FOR SELECT TO authenticated
USING (status = 'published' AND NOT is_admin());
```

### Migration 2: Other Admin Tables RLS

```sql
-- Apply admin-only RLS to other tables
-- From: supabase/migrations/20250119000001_admin_rls_all_tables.sql

-- Social Posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can insert social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can update social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can delete social posts" ON social_posts;

CREATE POLICY "Admins can view all social posts"
ON social_posts FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert social posts"
ON social_posts FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admins can update social posts"
ON social_posts FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete social posts"
ON social_posts FOR DELETE TO authenticated USING (is_admin());

-- RAG Documents (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rag_documents') THEN
    ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admins can view all rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can insert rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can update rag documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can delete rag documents" ON rag_documents;
    
    EXECUTE 'CREATE POLICY "Admins can view all rag documents"
    ON rag_documents FOR SELECT TO authenticated USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert rag documents"
    ON rag_documents FOR INSERT TO authenticated WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can update rag documents"
    ON rag_documents FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can delete rag documents"
    ON rag_documents FOR DELETE TO authenticated USING (is_admin())';
  END IF;
END $$;

-- RAG Chunks (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rag_chunks') THEN
    ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admins can view all rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can insert rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can update rag chunks" ON rag_chunks;
    DROP POLICY IF EXISTS "Admins can delete rag chunks" ON rag_chunks;
    
    EXECUTE 'CREATE POLICY "Admins can view all rag chunks"
    ON rag_chunks FOR SELECT TO authenticated USING (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can insert rag chunks"
    ON rag_chunks FOR INSERT TO authenticated WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can update rag chunks"
    ON rag_chunks FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin())';
    
    EXECUTE 'CREATE POLICY "Admins can delete rag chunks"
    ON rag_chunks FOR DELETE TO authenticated USING (is_admin())';
  END IF;
END $$;
```

---

## Step 2: Make Yourself an Admin

### Method 1: Via Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard → Authentication → Users**
2. Find your user account
3. Click on your user to edit
4. Scroll to **User Metadata** section
5. Add or update this in the JSON:

```json
{
  "is_admin": true
}
```

6. Click **Save**
7. **Log out and log back in** to your website for changes to take effect

### Method 2: Via SQL (Alternative)

Run this in **Supabase SQL Editor**:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';
```

Then log out and back in.

---

## Step 3: Verify Admin Access

1. Log into your website: https://usebettermetrics.com
2. Go to: https://usebettermetrics.com/admin
3. You should see the **Articles** card
4. Click **"Manage Articles"**
5. You should now see all 16 draft articles!

---

## Adding More Admins

To give admin access to another user:

### Via Dashboard:
1. Go to **Supabase → Authentication → Users**
2. Find the user
3. Edit their **User Metadata**
4. Add: `{"is_admin": true}`

### Via SQL:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'new-admin@example.com';
```

---

## Removing Admin Access

### Via Dashboard:
1. Edit user metadata
2. Change `"is_admin": true` to `"is_admin": false`
3. Or remove the `"is_admin"` field entirely

### Via SQL:
```sql
-- Option 1: Set to false
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": false}'::jsonb
WHERE email = 'user@example.com';

-- Option 2: Remove the field
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'is_admin'
WHERE email = 'user@example.com';
```

---

## Troubleshooting

### "No articles found" after running migrations

**Solution:** Make sure you:
1. Ran both migrations
2. Set your user metadata to `{"is_admin": true}`
3. **Logged out and back in** (crucial!)
4. Check in Supabase if your user has admin status:

```sql
SELECT email, raw_user_meta_data->>'is_admin' as is_admin
FROM auth.users
WHERE email = 'your-email@example.com';
```

### "Unauthorized" errors in admin panel

**Check:**
1. You're logged in
2. Your user has `"is_admin": true` in metadata
3. You refreshed your browser after setting admin status
4. RLS policies are correctly applied:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'articles';
```

### Can't upload images

**Make sure:**
1. You ran the storage bucket migration from earlier:
   - `supabase/migrations/20250118000000_add_article_images_bucket.sql`
2. The `article-images` bucket exists in Supabase Storage
3. The bucket is set to **public**

---

## Security Notes

### Admin Role Storage

The admin role is stored in `auth.users.raw_user_meta_data`:
- ✅ Secure: Can only be set via Supabase Dashboard or service role
- ✅ Not editable by users via API
- ✅ Checked server-side via RLS policies

### Best Practices

1. **Limit admin accounts:** Only give admin role to trusted users
2. **Use strong passwords:** Admins have full access to content
3. **Monitor activity:** Check Supabase logs regularly
4. **Backup regularly:** Admins can delete content

### Production Recommendations

For production, consider:
- Two-factor authentication for admin accounts
- Audit logging for admin actions
- Separate "editor" role with limited permissions
- IP whitelisting for admin panel

---

## Summary

**To get admin access:**
1. ✅ Run migration 1 (articles RLS)
2. ✅ Run migration 2 (other tables RLS)
3. ✅ Set your user metadata: `{"is_admin": true}`
4. ✅ Log out and log back in
5. ✅ Access https://usebettermetrics.com/admin/articles

**Result:** Full access to all admin features! 🎉

