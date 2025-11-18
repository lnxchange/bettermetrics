# Article Publishing Workflow

## Overview

This document describes the complete article publishing workflow, from importing markdown reports to publishing with featured images and social media distribution.

## Workflow Steps

### 1. Import Reports as Drafts

Reports are imported from markdown files in `content/reports/` and automatically saved as **drafts**:

```bash
npm run import-reports
```

**What happens:**
- Markdown files are parsed
- Metadata is automatically extracted (title, category, tags, description)
- Articles are saved to database with `status = 'draft'`
- RAG documents are created for chatbot context
- No publishing occurs at this stage

### 2. Edit Articles in Admin Panel

Navigate to: `/admin/articles`

**For each draft article:**

1. Click **"Edit"** button
2. Review and refine the content
3. **Upload Featured Image** (required for publishing)
   - Max 5MB
   - Formats: JPEG, PNG, GIF, WebP
   - Images stored in Supabase Storage bucket: `article-images`
4. Write **Social Media Messages**:
   - **LinkedIn**: Professional tone, ~300 chars recommended
   - **Facebook**: Engaging tone, up to 500 chars
   - **X/Twitter**: Concise, max 280 chars
5. Review metadata (title, slug, meta description)
6. Click **"Save Draft"** to save changes without publishing

### 3. Publish Article

When ready to go live:

1. Ensure featured image is uploaded
2. Review all social media messages
3. Click **"🚀 Publish & Share"** button

**What happens:**
- Article status changes to `'published'`
- `published_at` timestamp set
- Social media posts created in database
- Edge Function called to post to LinkedIn, Facebook, X
- Results displayed for each platform

**If Social APIs Not Configured:**
- Article still publishes successfully
- Social posts marked as "pending" 
- Manual sharing instructions provided

### 4. View Published Article

After publishing:
- Article live at: `/articles/[slug]`
- Visible in search results
- Available to RAG chatbot
- PDF download enabled

## API Endpoints

### Article Management

#### `GET /api/articles/[id]`
Fetch article by ID for editing

#### `PUT /api/articles/[id]`
Update article (saves draft or changes)

**Body:**
```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "content": "Markdown content...",
  "author": "Yule Guttenbeil",
  "category": "Research",
  "tags": "tag1, tag2, tag3",
  "featured_image_url": "https://...",
  "meta_title": "SEO Title",
  "meta_description": "SEO description",
  "linkedin_message": "LinkedIn post text",
  "facebook_message": "Facebook post text",
  "x_message": "Twitter post text"
}
```

#### `DELETE /api/articles/[id]`
Delete article (and all associated social posts)

#### `POST /api/articles/[id]/publish`
Publish article and trigger social media distribution

**Body:**
```json
{
  "linkedinMessage": "Professional post...",
  "facebookMessage": "Engaging post...",
  "xMessage": "Concise tweet..."
}
```

**Response:**
```json
{
  "article": { /* updated article */ },
  "socialResults": [
    {
      "platform": "linkedin",
      "success": true,
      "id": "post-id"
    },
    {
      "platform": "facebook",
      "success": false,
      "error": "API not configured"
    }
  ],
  "message": "Article published successfully!",
  "warning": "Social media posting not configured..."
}
```

### Image Upload

#### `POST /api/upload/image`
Upload featured image to Supabase Storage

**Form Data:**
- `file`: Image file (max 5MB, JPEG/PNG/GIF/WebP)

**Response:**
```json
{
  "url": "https://...supabase.co/storage/v1/object/public/article-images/...",
  "fileName": "article-123456-abc123.jpg",
  "message": "Image uploaded successfully"
}
```

## Database Schema

### Articles Table

```sql
articles (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  tags TEXT[],
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  structured_data JSONB,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Note:** `structured_data.social_messages` stores LinkedIn, Facebook, and X messages.

### Social Posts Table

```sql
social_posts (
  id UUID PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('linkedin', 'facebook', 'x')),
  post_text TEXT,
  status TEXT CHECK (status IN ('pending', 'posted', 'failed')),
  external_post_id TEXT,
  posted_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INT DEFAULT 0
)
```

## Supabase Storage

### Bucket: `article-images`

**Policies:**
- **Public Read**: Anyone can view images
- **Authenticated Upload**: Logged-in users can upload
- **Authenticated Update/Delete**: Users can manage their uploads

**File Naming:**
- Format: `article-{timestamp}-{random}.{ext}`
- Example: `article-1705571234000-a3f8k9l2.jpg`

## Social Media Integration (Phase 2)

### Edge Function: `publish-social`

Located: `supabase/functions/publish-social/index.ts`

**Triggered by:** Publish API endpoint

**Process:**
1. Fetch article and pending social posts
2. For each platform:
   - Call platform API (LinkedIn UGC, Facebook Graph, X API v2)
   - Update post status (`posted` or `failed`)
   - Store external post ID
   - Log errors for retry

**Required Environment Variables:**
```
LINKEDIN_ACCESS_TOKEN
LINKEDIN_PERSON_URN
FACEBOOK_PAGE_ID
FACEBOOK_PAGE_ACCESS_TOKEN
X_ACCESS_TOKEN
X_API_KEY
```

**Current Status:** 
- Code ready
- Awaiting API credentials
- Returns graceful error until configured

## Admin Interface

### Articles List (`/admin/articles`)

**Features:**
- Filter by status (All / Drafts / Published)
- View article metadata
- Quick actions:
  - **Edit**: Opens edit page
  - **View Live**: Opens published article (if published)
  - **Optimize SEO**: Triggers Perplexity SEO optimization
  - **Delete**: Removes article

### Article Editor (`/admin/articles/[id]/edit`)

**Sections:**
1. **Basic Info**: Title, slug, category, tags
2. **Featured Image**: Upload or URL input with preview
3. **Content**: Markdown editor (20 rows)
4. **SEO**: Meta description with character count
5. **Social Media**: LinkedIn, Facebook, X message fields with char limits
6. **Actions**: 
   - Cancel (returns to list)
   - Save Draft (saves without publishing)
   - 🚀 Publish & Share (publishes + social media)

**Validation:**
- Featured image required for publishing
- Title and content required
- X/Twitter limited to 280 characters
- Confirmation if social messages empty

## Testing Workflow

### 1. Import Test Report

```bash
# Create test report
cat > content/reports/test-article.md << 'EOF'
# Test Article Title

This is a test article for the publishing workflow.

## Section 1

Content here...

## Section 2

More content...
EOF

# Import
npm run import-reports
```

### 2. Edit in Admin

1. Go to: http://localhost:3000/admin/articles
2. Find "Test Article Title" in drafts
3. Click **Edit**
4. Upload an image
5. Add social messages
6. Click **Save Draft**
7. Verify changes persist

### 3. Test Publishing

1. Click **🚀 Publish & Share**
2. Verify success message
3. Check article at `/articles/test-article-title`
4. Verify social posts in database:
   ```sql
   SELECT * FROM social_posts WHERE article_id = '[article-id]';
   ```

### 4. Verify Social Posts

Until APIs configured, should see:
```
✅ Article published successfully!
⚠️  linkedin: Social media APIs not yet configured
⚠️  facebook: Social media APIs not yet configured
⚠️  x: Social media APIs not yet configured
```

## Migration Instructions

### Apply Database Migration

Run in Supabase SQL Editor:

```sql
-- From: supabase/migrations/20250118000000_add_article_images_bucket.sql

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies...
-- (see full migration file)
```

### Configure Social Media APIs (Phase 2)

1. **LinkedIn:**
   - Create app: https://www.linkedin.com/developers/
   - Get access token and person URN
   - Add to Supabase Edge Function secrets

2. **Facebook:**
   - Create app: https://developers.facebook.com/
   - Get page access token
   - Add to Supabase Edge Function secrets

3. **X/Twitter:**
   - Apply for developer account: https://developer.twitter.com/
   - Create app and get API keys
   - Add to Supabase Edge Function secrets

4. **Deploy Edge Function:**
   ```bash
   supabase functions deploy publish-social
   ```

## Troubleshooting

### Image Upload Fails

**Error:** "Failed to upload image"
**Solution:** 
1. Check Supabase Storage bucket exists
2. Verify policies are correctly set
3. Ensure user is authenticated
4. Check file size (<5MB) and type

### Publishing Shows Social Media Errors

**Expected during Phase 1:** Social APIs not configured yet
**Article still publishes successfully**
**You can manually share using the generated messages**

### Article Not Appearing After Import

**Check:**
1. Import script completed without errors
2. Database connection successful
3. Article status is 'draft'
4. View in `/admin/articles` with "Drafts" filter

### Featured Image Not Loading

**Check:**
1. Image URL is publicly accessible
2. Supabase Storage bucket is public
3. CORS configured for your domain
4. Image file format supported

## Future Enhancements

- [ ] Bulk image upload
- [ ] Image editing/cropping
- [ ] Scheduled publishing
- [ ] Social media preview cards
- [ ] Analytics integration
- [ ] A/B testing for social messages
- [ ] Automatic image optimization
- [ ] Multi-language support
- [ ] Collaborative editing
- [ ] Version history

## Support

For issues or questions:
- Check this documentation
- Review browser console for errors
- Check Supabase logs
- Contact: Use Better Metrics team

