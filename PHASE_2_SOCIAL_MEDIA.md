# Phase 2: Social Media Distribution System
**Status**: Awaiting API Credentials  
**Priority**: Medium  
**Estimated Time**: 2-3 days (after credentials obtained)

---

## Overview

Complete the social media distribution system to automatically post articles to LinkedIn, Facebook, and X (Twitter) when published. The infrastructure is already built and ready—only API credentials and final implementation are needed.

## What's Already Built ✅

### Database Schema
- `social_posts` table tracks posts for each platform
- Status tracking: pending → posted/failed
- Retry count and error logging
- Foreign key relationship to articles

### Edge Function Template
- **File**: `supabase/functions/publish-social/index.ts`
- Complete function structure
- Platform-specific posting functions (templates ready)
- Error handling and retry logic
- Status update workflow

### Article Publishing Integration
- Social post records created when article published
- Custom messages per platform (LinkedIn, Facebook, X)
- Automatic queuing in `social_posts` table

### Admin Dashboard
- Social post status monitoring (placeholder ready)
- View which platforms posts succeeded/failed
- Retry capability (to be implemented)

---

## Implementation Checklist

### Step 1: Obtain API Credentials

#### 1.1 LinkedIn API Access
**Apply at**: https://www.linkedin.com/developers/

**Requirements**:
- Create LinkedIn App
- Request "Share on LinkedIn" and "Sign In with LinkedIn" products
- Obtain OAuth 2.0 credentials
- Generate User Access Token (for posting as you)

**Credentials Needed**:
```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_PERSON_URN=urn:li:person:YOUR_PERSON_ID
```

**Documentation**:
- API Overview: https://learn.microsoft.com/en-us/linkedin/compliance/integrations/shares/ugc-post-api
- OAuth Guide: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication

**Testing**:
- Use LinkedIn's API test console before implementing
- Verify posting permissions

---

#### 1.2 Facebook Page API Access
**Apply at**: https://developers.facebook.com/

**Requirements**:
- Create Facebook App
- Add "Pages" product to your app
- Generate Page Access Token (long-lived)
- Add app to your Facebook Page

**Credentials Needed**:
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
```

**Documentation**:
- Pages API: https://developers.facebook.com/docs/pages-api
- Access Tokens: https://developers.facebook.com/docs/facebook-login/guides/access-tokens

**Important Notes**:
- Use **Page Access Token**, not User Access Token
- Set token to never expire (or implement refresh logic)
- Test with Graph API Explorer first

---

#### 1.3 X (Twitter) API Access
**Apply at**: https://developer.twitter.com/

**Requirements**:
- Apply for Elevated or Premium access (Free tier may not allow posting)
- Create Twitter App in Developer Portal
- Enable OAuth 1.0a or OAuth 2.0
- Generate Access Tokens

**Credentials Needed**:
```
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
X_BEARER_TOKEN=your_bearer_token (for API v2)
```

**Documentation**:
- API v2 Tweet Creation: https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
- Authentication: https://developer.twitter.com/en/docs/authentication/oauth-2-0

**Character Limit**: 280 characters (plan social messages accordingly)

---

### Step 2: Configure Supabase Environment

#### 2.1 Add Environment Variables

**In Supabase Dashboard**:
1. Go to: Project Settings → Edge Functions → Environment Variables
2. Add all credentials obtained in Step 1
3. Add these additional variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SITE_URL=https://usebettermetrics.com
   ```

#### 2.2 Deploy Edge Function

```bash
# From project root
cd /Users/yuleguttenbeil/Better\ Metrics\ Codebase/bettermetrics

# Deploy the function
supabase functions deploy publish-social

# Test the function
supabase functions invoke publish-social \
  --body '{"articleId": "test-article-id"}'
```

---

### Step 3: Uncomment Implementation Code

**File**: `supabase/functions/publish-social/index.ts`

#### 3.1 LinkedIn Implementation
Find the `postToLinkedIn` function and uncomment:

```typescript
async function postToLinkedIn(text: string, url: string) {
  const accessToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
  const personUrn = Deno.env.get('LINKEDIN_PERSON_URN')
  
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'ARTICLE',
          media: [{
            status: 'READY',
            originalUrl: url
          }]
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn API error: ${error}`)
  }
  
  return await response.json()
}
```

#### 3.2 Facebook Implementation
Find the `postToFacebook` function and uncomment:

```typescript
async function postToFacebook(text: string, url: string) {
  const pageId = Deno.env.get('FACEBOOK_PAGE_ID')
  const accessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN')
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        link: url,
        access_token: accessToken
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${error}`)
  }
  
  return await response.json()
}
```

#### 3.3 X (Twitter) Implementation
Find the `postToX` function and uncomment:

```typescript
async function postToX(text: string, url: string) {
  const bearerToken = Deno.env.get('X_BEARER_TOKEN')
  const tweet = `${text}\n\n${url}`
  
  // Check character limit
  if (tweet.length > 280) {
    throw new Error(`Tweet too long: ${tweet.length} characters (max 280)`)
  }
  
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: tweet })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`X API error: ${error}`)
  }
  
  return await response.json()
}
```

---

### Step 4: Set Up Automatic Posting

#### 4.1 Trigger on Article Publish

The article publishing API (`app/api/articles/route.ts`) already creates social post records. The Edge Function needs to be triggered.

**Option A: Manual Trigger** (Current)
- Admin clicks "Post to Social" button in dashboard
- Calls Edge Function for specific article

**Option B: Automatic Trigger** (Recommended)
Add to `app/api/articles/route.ts` after creating social posts:

```typescript
// After inserting social posts
if (socialPosts.length > 0) {
  // Trigger Edge Function
  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/publish-social`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ articleId: article.id })
  })
}
```

#### 4.2 Set Up Cron for Retry Logic

**In Supabase Dashboard** → Database → Extensions → pg_cron

```sql
-- Retry failed social posts every 30 minutes (max 3 retries)
SELECT cron.schedule(
  'retry-failed-social-posts',
  '*/30 * * * *',  -- Every 30 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/publish-social',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body := jsonb_build_object(
      'articleId', social_posts.article_id,
      'retry', true
    )
  )
  FROM social_posts 
  WHERE status = 'failed' 
  AND retry_count < 3
  GROUP BY article_id
  $$
);
```

---

### Step 5: Update Admin Dashboard

#### 5.1 Add Social Post Monitoring

In `app/admin/articles/page.tsx`, add social post status display:

```typescript
// Fetch social posts for each article
const { data: socialPosts } = await supabase
  .from('social_posts')
  .select('*')
  .eq('article_id', article.id)

// Display badges for each platform
<div className="flex gap-2">
  {socialPosts?.map(post => (
    <Badge 
      key={post.platform}
      variant={post.status === 'posted' ? 'default' : 'destructive'}
    >
      {post.platform}: {post.status}
    </Badge>
  ))}
</div>
```

#### 5.2 Add Manual Post Button

```typescript
const handlePostToSocial = async (articleId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/publish-social`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ articleId })
    }
  )
  
  if (response.ok) {
    toast.success('Posted to social media!')
  } else {
    toast.error('Failed to post')
  }
}
```

---

## Testing Strategy

### 1. Test Each Platform Individually

```bash
# Test LinkedIn
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/publish-social \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"articleId": "test-id", "platform": "linkedin"}'

# Test Facebook
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/publish-social \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"articleId": "test-id", "platform": "facebook"}'

# Test X
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/publish-social \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"articleId": "test-id", "platform": "x"}'
```

### 2. Create Test Article

1. Go to `/admin/new-article`
2. Create a test article with title: "Test Post - Please Ignore"
3. Add custom social messages for each platform
4. Publish article
5. Check social_posts table for records
6. Verify posts appear on each platform

### 3. Test Retry Logic

1. Temporarily break one API credential
2. Publish article
3. Check social_posts table shows "failed" status
4. Fix credential
5. Wait for cron job or manually trigger retry
6. Verify post succeeds on retry

---

## Common Issues & Solutions

### LinkedIn Issues

**Problem**: "Invalid access token"
- **Solution**: Tokens expire. Generate new access token from LinkedIn Developer Console

**Problem**: "Permission denied"
- **Solution**: Ensure app has "w_member_social" scope

### Facebook Issues

**Problem**: "Invalid OAuth access token"
- **Solution**: Page Access Token may have expired. Generate new long-lived token

**Problem**: "Permissions error"
- **Solution**: Ensure app is added to Page and has "pages_manage_posts" permission

### X (Twitter) Issues

**Problem**: "Rate limit exceeded"
- **Solution**: X has strict rate limits. Implement exponential backoff

**Problem**: "Tweet too long"
- **Solution**: Enforce 280 character limit in UI when entering X message

### General Issues

**Problem**: Posts succeed but don't update status
- **Solution**: Check Edge Function has correct Supabase credentials

**Problem**: Cron not running
- **Solution**: Verify pg_cron extension is enabled in Supabase

---

## Security Best Practices

### 1. Token Storage
- ✅ Store all tokens in Supabase Environment Variables
- ✅ Never commit tokens to git
- ✅ Use service role key only in Edge Functions
- ✅ Rotate tokens regularly

### 2. Rate Limiting
- Implement rate limiting in Edge Function
- Track API calls per platform
- Implement exponential backoff for retries

### 3. Error Logging
- Log all API errors to database
- Don't expose tokens in error messages
- Monitor failed posts daily

### 4. Access Control
- Only authenticated users can trigger posting
- Verify user owns article before posting
- Implement admin-only manual retry

---

## Monitoring & Analytics

### Dashboard Metrics to Add

1. **Post Success Rate**
   - Posts succeeded / total posts by platform
   - Chart showing trends over time

2. **Platform Health**
   - Green/yellow/red status for each platform
   - Last successful post timestamp

3. **Error Tracking**
   - Most common error messages
   - Which platform has most failures

### SQL Queries for Monitoring

```sql
-- Success rate by platform
SELECT 
  platform,
  COUNT(*) FILTER (WHERE status = 'posted') AS succeeded,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'posted') / COUNT(*), 2) AS success_rate
FROM social_posts
GROUP BY platform;

-- Recent failures
SELECT 
  articles.title,
  social_posts.platform,
  social_posts.error_message,
  social_posts.updated_at
FROM social_posts
JOIN articles ON articles.id = social_posts.article_id
WHERE social_posts.status = 'failed'
ORDER BY social_posts.updated_at DESC
LIMIT 10;
```

---

## Estimated Timeline

| Task | Time Estimate | Priority |
|------|--------------|----------|
| Apply for API access | 1-7 days | Required |
| Configure credentials | 30 minutes | Required |
| Uncomment implementation | 1 hour | Required |
| Deploy Edge Function | 15 minutes | Required |
| Test each platform | 2 hours | Required |
| Set up cron jobs | 30 minutes | Medium |
| Update admin dashboard | 2 hours | Medium |
| Add monitoring | 3 hours | Low |

**Total Active Development Time**: 1-2 days  
**Total Calendar Time**: 1-7 days (waiting for API approvals)

---

## Success Criteria

- [ ] All three platforms posting successfully
- [ ] Social posts created automatically when article published
- [ ] Failed posts retry automatically (max 3 attempts)
- [ ] Admin dashboard shows post status per platform
- [ ] Custom messages per platform working
- [ ] Error logging functional
- [ ] No API rate limit issues
- [ ] Posts include correct article URLs
- [ ] Success rate > 95% for each platform

---

## Support Resources

### Official Documentation
- **LinkedIn**: https://learn.microsoft.com/en-us/linkedin/
- **Facebook**: https://developers.facebook.com/docs/
- **X (Twitter)**: https://developer.twitter.com/en/docs

### Supabase Resources
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Cron Jobs**: https://supabase.com/docs/guides/functions/schedule-functions

### Helpful Tools
- **LinkedIn API Test Console**: In LinkedIn Developer Portal
- **Facebook Graph API Explorer**: https://developers.facebook.com/tools/explorer/
- **Postman**: For testing API calls

---

## Next Steps After Implementation

1. **Analytics Integration**
   - Track post engagement (likes, shares, comments)
   - Compare performance across platforms
   - Optimize posting times

2. **Advanced Features**
   - Schedule posts for optimal times
   - A/B test different message formats
   - Auto-generate social messages with AI
   - Cross-post to additional platforms (Instagram, Threads)

3. **Automation Improvements**
   - Auto-suggest best posting times
   - Hashtag recommendations
   - Image optimization per platform

---

**Document Version**: 1.0  
**Last Updated**: November 17, 2025  
**Status**: Ready for implementation when API credentials obtained  
**Owner**: Yule Guttenbeil

