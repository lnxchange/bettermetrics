# Your Report Title Here

This is a template for your AIM Framework reports. You can write in plain markdown and the import script will automatically extract all metadata!

## Introduction

Write your content here. The script will automatically:
- Extract the title from the first H1 heading (or use filename)
- Generate a URL-friendly slug
- Detect the category based on keywords
- Extract relevant tags
- Create a meta description from your first paragraph

## Main Content

### Appetites

Discuss biological drives and survival needs...

### Intrinsic Motivation

Explore autonomy, competence, and mastery...

### Mimetic Desire

Examine social modeling and imitation...

## Conclusion

Summarize your findings...

---

**Optional: Manual Frontmatter Override**

If you want to manually specify metadata, you can add frontmatter at the top:

```yaml
---
title: Custom Title Here
category: Economics
tags: custom, tags, here
meta_description: Custom description that will be used instead of auto-generated one
status: published
featured_image: https://example.com/image.jpg
---
```

Then your content starts after the second `---`

But this is completely optional! The script works great without any frontmatter.

