'use client'

import Link from 'next/link'
import { MathText } from '@/components/math-text'
import { splitCitations } from '@/lib/treatise-citations'

export function TreatiseCitation({ text }: { text: string }) {
  const parts = splitCitations(text)
  return (
    <>
      {parts.map((part, index) =>
        part.href ? (
          <Link
            key={index}
            href={part.href}
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
          >
            {part.text}
          </Link>
        ) : (
          <MathText key={index} text={part.text} />
        )
      )}
    </>
  )
}
