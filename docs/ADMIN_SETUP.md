# Admin Setup Guide

## Initial Admin User Setup

Since you're the first user, follow these steps to grant yourself admin access:

### Option 1: Using Supabase Dashboard (Recommended for Production)

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
8. Refresh your browser on the site - you should now have admin access

### Option 2: Using SQL (For Local Development)

1. Open Supabase Studio at http://localhost:54323
2. Go to **SQL Editor**
3. Run this query (replace YOUR_EMAIL with your actual email):
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'YOUR_EMAIL';
   ```
4. Refresh your browser - you should now have admin access

### Verifying Admin Access

1. Navigate to `/admin` on your site
2. You should see the admin dashboard instead of being redirected
3. You should be able to upload and manage documents

### Granting Admin to Additional Users

Once you have admin access, you can use the Supabase dashboard to grant admin rights to other users following Option 1 above.
