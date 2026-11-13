# Admin Setup Guide

`/admin` is the Atomic CRM. The site serves it only to a signed-in user whose Supabase user metadata contains `"is_admin": true`. Everyone else is sent to sign-in, or back to the home page.

## Initial Admin User Setup

The flag lives on the site's Supabase project (the one in `NEXT_PUBLIC_SUPABASE_URL`), not the separate CRM project.

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Find your user account
4. Click on the user to open user details
5. Scroll to **User Metadata** section
6. Click **Edit** and add:
   ```json
   {
     "is_admin": true
   }
   ```
7. Save changes
8. Sign out of the site and sign back in, so the session picks up the new metadata
9. Open `/admin`. You should see the CRM

### Option 2: Using SQL (local development)

1. Open Supabase Studio at http://localhost:54323
2. Go to **SQL Editor**
3. Run this query (replace YOUR_EMAIL with your actual email):
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'YOUR_EMAIL';
   ```
4. Sign out and sign back in, then open `/admin`

### Granting Admin to Additional Users

Use the Supabase dashboard steps above, or the Users screen inside the CRM. Both set the same `is_admin` flag on the site user.
