import { TreatiseHeading } from '@/lib/treatise-citations'

function tagIndex(html: string, id: string) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`<h[2-4]\\b[^>]*\\sid="${escaped}"`, 'i').exec(html)
  return match ? match.index : -1
}

/** The heading and its body, through the next heading of equal or higher level. */
export function extractTreatiseSection(
  html: string,
  headings: TreatiseHeading[],
  sectionId: string
): { heading: string; html: string } | null {
  const id = sectionId.toLowerCase()
  const index = headings.findIndex(heading => heading.id === id)
  if (index < 0) return null
  const current = headings[index]
  const next = headings.slice(index + 1).find(heading => heading.level <= current.level)
  const start = tagIndex(html, current.id)
  if (start < 0) return null
  const end = next ? tagIndex(html, next.id) : -1
  return {
    heading: current.text,
    html: html.slice(start, end < 0 ? html.length : end)
  }
}

export interface AdjacentSection {
  section: string
  heading: string
}

/**
 * The previous and next section at the same level or higher.
 * A child heading already sits inside its parent's slice, so it is not a separate stop.
 */
export function adjacentSections(
  headings: TreatiseHeading[],
  sectionId: string
): { previous: AdjacentSection | null; next: AdjacentSection | null } {
  const index = headings.findIndex(heading => heading.id === sectionId.toLowerCase())
  if (index < 0) return { previous: null, next: null }
  const level = headings[index].level
  let previous: TreatiseHeading | null = null
  for (let i = index - 1; i >= 0; i--) {
    if (headings[i].level <= level) {
      previous = headings[i]
      break
    }
  }
  const next = headings.slice(index + 1).find(heading => heading.level <= level) ?? null
  return {
    previous: previous ? { section: previous.id, heading: previous.text } : null,
    next: next ? { section: next.id, heading: next.text } : null
  }
}
