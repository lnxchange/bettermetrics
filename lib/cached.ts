import { unstable_cache } from 'next/cache'

type AnyAsync = (...args: any[]) => Promise<any>

/**
 * Lazily-bound `unstable_cache`. Next 13.4 asserts that the incremental cache
 * exists when `unstable_cache()` is *called*, which would throw if a module
 * defined its cached readers at import time outside a request (scripts, tests).
 * Binding on first invocation keeps the readers safe to import anywhere, and
 * falls back to the uncached function when no cache is available.
 */
export function cached<F extends AnyAsync>(
  fn: F,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] }
): F {
  let bound: F | null = null
  return (async (...args: Parameters<F>) => {
    if (!bound) {
      try {
        bound = unstable_cache(fn, keyParts, options) as F
      } catch {
        bound = fn
      }
    }
    return bound(...args)
  }) as F
}
