# 📚 AIM Framework Reports System

This system allows you to write markdown reports and automatically import them as articles to your website with **zero manual metadata entry required**.

## 🚀 Quick Start

### 1. Add Your Reports

Simply drop your markdown (`.md`) files into the `content/reports/` folder:

```bash
content/reports/
├── economic-implications.md
├── sdt-integration.md
├── consumer-behavior.md
└── ... (your 13 reports)
```

### 2. Write in Plain Markdown

No frontmatter needed! Just write your report:

```markdown
# Economic Implications of the AIM Framework

The traditional economic view treats preferences as monolithic...

## Appetites in Economic Decisions

Biological drives influence consumer behavior...

## Mimetic Desire in Markets

Social modeling shapes purchasing patterns...
```

### 3. Run the Import Script

```bash
npm run import-reports
```

That's it! The script automatically:
- ✅ Extracts title from your H1 heading
- ✅ Generates a URL-friendly slug
- ✅ Detects the category (Economics, Psychology, Neuroscience, etc.)
- ✅ Extracts relevant tags
- ✅ Creates an SEO-optimized meta description
- ✅ Uploads to your database

---

## 🧠 How Metadata Extraction Works

### Title Extraction
- **From H1**: Uses your first `# Heading` as the title
- **Fallback**: Converts filename to title (e.g., `economic-behavior.md` → "Economic Behavior")

### Category Detection (Automatic)
The script analyzes your content for keywords:

| Category | Keywords Detected |
|----------|------------------|
| **Economics** | economic, market, consumer, pricing, supply, demand, financial |
| **Psychology** | psychology, behavior, SDT, self-determination, cognitive |
| **Neuroscience** | neuroscience, neural, brain, neurological, dopamine |
| **Organizational Behavior** | organization, workplace, leadership, management, team |
| **Education** | education, learning, teaching, student, classroom |
| **Health** | health, medical, clinical, patient, healthcare |
| **Default** | Research (if no strong category match) |

### Tag Extraction (Automatic)
Always includes:
- "AIM Framework" (mandatory)
- Detected terms: "Appetites", "Intrinsic Motivation", "Mimetic Desire"
- Relevant keywords from your content
- **Limit**: 5-7 tags per article

### Meta Description (Automatic)
- Uses your first 2-3 sentences
- Optimized to 150-160 characters for SEO
- Removes markdown formatting
- Ends with proper punctuation

---

## ⚙️ Manual Override (Optional)

Want to manually specify metadata? Add frontmatter at the top:

```markdown
---
title: Custom Title Override
category: Economics
tags: custom, tags, here, aim framework
meta_description: Your custom description for SEO purposes.
status: published
author: Yule Guttenbeil
featured_image: https://example.com/image.jpg
---

# Your Article Content Starts Here

The frontmatter is completely optional...
```

**Frontmatter fields:**
- `title` - Override auto-extracted title
- `slug` - Custom URL slug
- `category` - Force specific category
- `tags` - Comma-separated tags
- `meta_description` - Custom SEO description
- `status` - `draft` or `published` (default: draft)
- `author` - Default: "Yule Guttenbeil"
- `featured_image` - Image URL
- `linkedin_message` - Custom LinkedIn post text (Phase 2)
- `facebook_message` - Custom Facebook post text (Phase 2)
- `x_message` - Custom X/Twitter post text (Phase 2)

---

## 📋 Import Script Output

When you run `npm run import-reports`, you'll see:

```
📚 AIM Framework Report Importer
==================================================

Found 13 markdown file(s)

📝 Processing: economic-implications.md
  ✓ Title: "Economic Implications of the AIM Framework"
  ✓ Slug: economic-implications-of-the-aim-framework
  ✓ Category: Economics
  ✓ Tags: AIM Framework, Appetites, Mimetic Desire, Economics, Consumer
  ✓ Meta description: The traditional economic view treats preferences...
  ✓ Processed successfully

📝 Processing: sdt-integration.md
  ✓ Title: "Self-Determination Theory and AIM Framework"
  ...

==================================================

📊 Import Summary:
   Total files: 13
   ✅ Successful: 13
   ❌ Failed: 0

📁 Categories:
   - Economics: 5 article(s)
   - Psychology: 4 article(s)
   - Neuroscience: 3 article(s)
   - Research: 1 article(s)
```

---

## 🔧 Configuration

### Customize Category Keywords

Edit `scripts/import-reports.js` and modify the `CATEGORY_KEYWORDS` object:

```javascript
const CATEGORY_KEYWORDS = {
  'Your Custom Category': ['keyword1', 'keyword2', 'keyword3'],
  // ... add more
};
```

### Change Reports Directory

By default, reports are in `content/reports/`. To change:

```javascript
// In scripts/import-reports.js
const REPORTS_DIR = path.join(__dirname, '..', 'your', 'custom', 'path');
```

---

## 🔐 Authentication for Upload

The import script needs authentication to upload articles to your database.

### Current Status
The upload functionality is **commented out** by default for safety. Articles are parsed and validated but not uploaded.

### To Enable Upload:

1. **Option A: Local Development**
   - Make sure you're logged into the site locally
   - Uncomment line in `scripts/import-reports.js`:
   ```javascript
   // Find this line (around line 264):
   // await uploadArticle(articleData);
   
   // Uncomment it:
   await uploadArticle(articleData);
   ```

2. **Option B: Direct Database Upload**
   - Use Supabase service role key
   - Modify script to use `@supabase/supabase-js` directly
   - Bypass auth requirements

3. **Option C: Manual Upload via UI**
   - Keep script for metadata extraction only
   - Copy generated metadata and paste into admin UI
   - Useful for review before publishing

---

## 📁 File Organization Tips

### Naming Convention
Use descriptive, lowercase filenames with hyphens:
```
✅ economic-implications-aim-framework.md
✅ sdt-integration-study.md
❌ Report1.md
❌ My Report File.md
```

### Folder Structure (Optional)
You can organize by category:
```
content/reports/
├── economics/
│   ├── consumer-behavior.md
│   └── market-dynamics.md
├── psychology/
│   ├── sdt-integration.md
│   └── motivation-theory.md
└── neuroscience/
    └── neural-basis.md
```

Just update the script's `REPORTS_DIR` to scan subdirectories.

---

## 🐛 Troubleshooting

### "No markdown files found"
- Check file extension is `.md` (not `.txt` or `.markdown`)
- Verify files are in `content/reports/` directory
- Make sure filenames don't start with `.` (hidden files)

### "Failed to extract title"
- Add a proper H1 heading: `# Your Title`
- Or add frontmatter with `title: Your Title`
- Script will fallback to filename if needed

### Category is always "Research"
- Add more category-specific keywords to your content
- Or manually specify category in frontmatter
- Update `CATEGORY_KEYWORDS` in the script

### Meta description too short/weird
- Make sure your first paragraph is well-written
- Use proper sentences with punctuation
- Or add manual `meta_description` in frontmatter

### Upload fails
- Check you're authenticated to the site
- Verify `NEXT_PUBLIC_SITE_URL` in `.env.local`
- Ensure API endpoint is accessible

---

## 🎯 Best Practices

1. **Write clear H1 headings** - They become your article titles
2. **Start with a strong intro** - First sentences become meta descriptions
3. **Use AIM Framework terminology** - Helps with tag extraction
4. **Write 1500+ words** - Better for category detection
5. **Include subsections** - Use H2/H3 headings for structure
6. **Proofread first paragraph** - It's your SEO description
7. **Use consistent terminology** - Helps algorithm detect patterns

---

## 🔮 Future Enhancements

Planned features:
- [ ] AI-enhanced meta descriptions using Perplexity API
- [ ] Watch mode for automatic import on file changes
- [ ] Bulk status updates (draft → published)
- [ ] Image extraction from markdown
- [ ] Automatic internal linking suggestions
- [ ] Reading time calculation
- [ ] SEO score analysis

---

## 📞 Need Help?

- **Script issues**: Check the console output for detailed errors
- **Category not detecting**: Add frontmatter or update keywords
- **Upload problems**: Verify authentication and API access
- **Questions**: Ask the AI assistant for help!

---

**Happy writing! 🎉**

Your markdown reports will be live on your site in seconds with zero manual data entry.

