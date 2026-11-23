import { GlossaryProse } from '@/lib/glossary-prose'

const prose =
  '[&_p+p]:mt-3 [&_strong]:font-semibold [&_em]:italic [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li+li]:mt-1 [&_a]:text-primary-700 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:border-gray-300 [&_span.katex]:max-w-full [&_span.katex:has(math[display=block])]:my-3 [&_span.katex:has(math[display=block])]:block [&_span.katex:has(math[display=block])]:overflow-x-auto'

export function GlossaryProseView({
  text,
  className
}: {
  text: string
  className?: string
}) {
  const html = GlossaryProse.html(text)
  if (!html) return null
  return (
    <div
      className={`${prose} ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
