import { renderMathInText } from '@/lib/render-math'

export function MathText({
  text,
  className
}: {
  text: string
  className?: string
}) {
  if (!text) return null
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMathInText(text) }}
    />
  )
}
