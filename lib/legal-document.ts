import { readFileSync } from 'fs'
import path from 'path'
import { marked } from 'marked'

import { LegalVersion } from '@/lib/legal-version'

export class LegalDocument {
  static slug(heading: string): string {
    return heading
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, ' and ')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  static markdown(name: 'terms' | 'privacy'): string {
    const file = path.join(process.cwd(), 'content', 'legal', `${name}.md`)
    const date = LegalVersion.publicationDate || '\u200b'
    return readFileSync(file, 'utf8').replaceAll('{{PUBLICATION_DATE}}', date)
  }

  static html(name: 'terms' | 'privacy'): string {
    const renderer = new marked.Renderer()
    renderer.heading = ({ text, depth }) => {
      const id = LegalDocument.slug(text)
      return `<h${depth} id="${id}">${text}</h${depth}>\n`
    }
    return marked.parse(LegalDocument.markdown(name), {
      async: false,
      renderer,
      gfm: true
    }) as string
  }
}
