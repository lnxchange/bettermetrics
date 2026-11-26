import { marked } from 'marked'
import { GlossaryTermRef } from '@/lib/glossary-terms'
import { renderMathInHtml } from '@/lib/render-math'
import { CorpusIndex } from '@/lib/treatise-citations'
import { prepareTreatiseMarkdown } from '@/lib/treatise-render'

const PRIVATE_LINK = /^https:\/\/ppl-ai-file-upload\.s3\.amazonaws\.com\/web\/direct-files/i

/**
 * Corpus articles use the treatise renderer, so KaTeX and glossary terms
 * behave as they do in a chapter. Legacy articles keep the renderer they
 * already have.
 */
export class ArticleHtml {
  static render(
    markdown: string,
    options: { corpus: boolean; siteUrl: string; terms?: GlossaryTermRef[]; index?: CorpusIndex }
  ) {
    if (!options.corpus) return ArticleHtml.legacy(markdown, options.siteUrl)
    const prepared = prepareTreatiseMarkdown(markdown, options.index, options.terms)
    return ArticleHtml.externalLinks(prepared.html, options.siteUrl)
  }

  private static legacy(markdown: string, siteUrl: string) {
    let html = marked.parse(markdown ?? '', { async: false }) as string
    html = html.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
    html = ArticleHtml.externalLinks(html, siteUrl)
    html = html.replace(/<table>/g, '<div class="overflow-x-auto my-6"><table>').replace(/<\/table>/g, '</table></div>')
    return renderMathInHtml(html)
  }

  static externalLinks(html: string, siteUrl: string) {
    return html.replace(/<a\s+([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, href, text) => {
      if (PRIVATE_LINK.test(String(href).trim())) return text
      if (/^https?:\/\//i.test(href) && !String(href).startsWith(siteUrl)) {
        return `<a ${attrs} target="_blank" rel="noopener noreferrer">${String(text).trim()}<span class="inline-block ml-1 opacity-70" aria-hidden="true">↗</span></a>`
      }
      return match
    })
  }
}
