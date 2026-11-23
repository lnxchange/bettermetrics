import { LegalDocument } from '@/lib/legal-document'

export function LegalProse({ name }: { name: 'terms' | 'privacy' }) {
  const html = LegalDocument.html(name)
  return (
    <article
      className="prose prose-slate mx-auto max-w-2xl px-4 py-16 prose-headings:scroll-mt-24 prose-h1:text-3xl prose-a:text-primary-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
