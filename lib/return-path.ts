// Only send the browser back to a path on this site.
export function returnPath(value: string | null | undefined): string {
  if (!value) return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  if (value.includes('\\') || value.includes('://')) return '/'
  return value
}
