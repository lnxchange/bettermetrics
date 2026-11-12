import { marked } from 'marked'

export function ByokNotice({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false }) as string
  return (
    <div
      className="rounded-lg border bg-background p-6 text-sm leading-relaxed text-slate-700 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-base [&_strong]:text-slate-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
