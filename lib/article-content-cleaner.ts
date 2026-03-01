/**
 * Article content cleaning utilities.
 *
 * Applied during import and on save to strip artefacts introduced by
 * AI-assisted drafting tools (Perplexity logos, internal source links, etc.).
 */

/**
 * Remove every markdown image whose alt text or URL contains "perplexity"
 * (case-insensitive).
 *
 * Handles both inline and reference-style images:
 *   ![Perplexity Logo](https://...)
 *   ![logo](https://perplexity.ai/logo.png)
 */
function removePerplexityImages(content: string): string {
  // Inline markdown images: ![alt](url)
  let cleaned = content.replace(
    /!\[([^\]]*)\]\(([^)]*)\)/gi,
    (match, alt, url) => {
      if (
        /perplexity/i.test(alt) ||
        /perplexity/i.test(url)
      ) {
        return ''
      }
      return match
    }
  )

  // HTML img tags: <img src="https://r2cdn.perplexity.ai/..." ...>
  cleaned = cleaned.replace(/<img\b[^>]*>/gi, (match) => {
    if (/perplexity/i.test(match)) {
      return ''
    }
    return match
  })

  return cleaned
}

/**
 * Remove private Perplexity direct-file links. These S3 URLs are private and
 * return 403/500 when accessed. Strip the link but keep the link text.
 *
 * Pattern: https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files
 */
const PRIVATE_PERPLEXITY_LINK =
  /^https:\/\/ppl-ai-file-upload\.s3\.amazonaws\.com\/web\/direct-files/i

function removePrivatePerplexityLinks(content: string): string {
  // Markdown: [text](url) -> keep text as plain text when url is private
  let cleaned = content.replace(
    /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/gi,
    (match, text, url) => {
      if (PRIVATE_PERPLEXITY_LINK.test(url.trim())) return text
      return match
    }
  )

  // HTML: <a href="url">text</a> -> keep text when url is private
  cleaned = cleaned.replace(
    /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (match, url, text) => {
      if (PRIVATE_PERPLEXITY_LINK.test(url.trim())) return text
      return match
    }
  )

  return cleaned
}

/**
 * Normalize markdown tables so they render correctly with GFM.
 *
 * - Replace em dash (—) and en dash (–) with hyphen (-) in table separator rows.
 *   AI tools often output unicode dashes which marked/GFM does not recognize.
 * - Fix concatenated rows: "| a | b | |---|---|" -> add newline so parser sees
 *   separate rows.
 */
function normalizeMarkdownTables(content: string): string {
  let cleaned = content

  // Fix concatenated table rows: | ... | | ... | -> | ... |\n| ... |
  cleaned = cleaned.replace(
    /\|\s*\|\s*(?=[\s|\-:])/g,
    '|\n|'
  )

  // Replace em dash (U+2014) and en dash (U+2013) with hyphen in table separator rows only.
  // GFM requires ASCII hyphen. AI tools often output unicode dashes. Separator rows contain
  // only |, -, :, spaces, and unicode dashes—no letters or other punctuation.
  cleaned = cleaned.replace(/^(\|[^\n]*\|)\s*$/gm, (line) => {
    if (/[—–]/.test(line) && !/[a-zA-Z]/.test(line)) {
      return line.replace(/—/g, '-').replace(/–/g, '-')
    }
    return line
  })

  return cleaned
}

/**
 * Remove the Sources / References section if it appears at the end of the
 * article.  Matches headings of any level (# through ######), bold text
 * markers, or plain "Sources"/"References" lines.
 *
 * Everything from the matched heading to the end of the document is removed.
 */
function removeSourcesSection(content: string): string {
  // Match a heading-level sources/references block near end of document
  const headingPattern =
    /\n{1,}\s*#{1,6}\s*(?:sources?|references?)[\s:]*\n[\s\S]*$/i

  // Match a bold sources/references block (e.g. **Sources**)
  const boldPattern =
    /\n{1,}\s*\*{1,2}(?:sources?|references?)\*{1,2}[\s:]*\n[\s\S]*$/i

  // Match plain "Sources" or "References" at start of line near end (e.g. "Sources [1] ...")
  const plainPattern =
    /\n{2,}\s*(?:sources?|references?)[\s:]*(?:\n|\[)[\s\S]*$/i

  let cleaned = content.replace(headingPattern, '')
  cleaned = cleaned.replace(boldPattern, '')
  cleaned = cleaned.replace(plainPattern, '')

  return cleaned
}

/**
 * Run all content cleaning steps.
 * Returns the cleaned markdown string.
 */
export function cleanArticleContent(content: string): string {
  let cleaned = content

  cleaned = normalizeMarkdownTables(cleaned)
  cleaned = removePrivatePerplexityLinks(cleaned)
  cleaned = removePerplexityImages(cleaned)
  cleaned = removeSourcesSection(cleaned)

  // Normalise trailing whitespace
  return cleaned.trimEnd() + '\n'
}
