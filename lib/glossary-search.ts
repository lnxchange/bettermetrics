import { GlossaryAliases } from '@/lib/glossary-aliases'

/**
 * Ranking for a search over glossary entries.
 *
 * A defined term comes first: the query is that headword, or it names the
 * headword. Otherwise an entry comes next only when it is concentrated on the
 * query, because that entry's derivation line is the direct link to the
 * section. A passing mention, including a citation of the author, does not.
 */

export interface GlossarySearchDocument {
  term: string
  definition: string
  explanation?: string
  derivation?: string | null
}

export interface GlossarySearchHit<T> {
  document: T
  /** 0 the query is the headword, 1 the query names it, 2 the entry is concentrated on the query. */
  tier: 0 | 1 | 2
  score: number
  /** Words in the phrase that made a tier-2 match. A phrase outranks a single word. */
  words: number
}

const STOP = new Set([
  'about', 'after', 'aim', 'also', 'and', 'are', 'because', 'before', 'between',
  'but', 'can', 'could', 'did', 'does', 'done', 'explain', 'for', 'framework',
  'from', 'had', 'has', 'have', 'how', 'into', 'its', 'just', 'not', 'only',
  'over', 'should', 'such', 'than', 'that', 'the', 'their', 'them', 'there',
  'these', 'they', 'this', 'those', 'through', 'under', 'using', 'was', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'why', 'with', 'within',
  'without', 'would', 'you', 'your'
])

export class GlossarySearch {
  /**
   * Named entries, then entries concentrated on a phrase in the query.
   * `namedLimit` caps headword matches (site search). Chat keeps them all
   * and adds only a few concentrated entries.
   */
  static matches<T extends GlossarySearchDocument>(
    documents: T[],
    query: string,
    options?: { namedLimit?: number; focusLimit?: number }
  ): GlossarySearchHit<T>[] {
    const hits = GlossarySearch.rank(documents, query)
    const namedLimit = options?.namedLimit ?? Number.POSITIVE_INFINITY
    const focusLimit = options?.focusLimit ?? 3
    const named = hits.filter(hit => hit.tier < 2).slice(0, namedLimit)
    const focus = hits.filter(hit => hit.tier === 2)
    // "Veblen goods" inside a longer question must not lose its slot to a
    // one-word overlap such as "Easterlin" in a neighbouring entry.
    const concentrated = [
      ...focus.filter(hit => hit.words > 1),
      ...focus.filter(hit => hit.words <= 1)
    ].slice(0, focusLimit)
    return [...named, ...concentrated]
  }

  static rank<T extends GlossarySearchDocument>(documents: T[], query: string): GlossarySearchHit<T>[] {
    const folded = normalize(query)
    if (folded.length < 2) return []
    const phrases = candidatePhrases(folded)
    const hits: GlossarySearchHit<T>[] = []

    for (const document of documents) {
      const named = namedMatch(document.term, folded)
      if (named) {
        hits.push({ document, tier: named.tier, score: named.score, words: named.words })
        continue
      }
      const text = reading(document)
      const focus = focusMatch(text, phrases)
      if (focus) hits.push({ document, tier: 2, score: focus.score, words: focus.words })
    }

    hits.sort((a, b) => a.tier - b.tier || b.score - a.score || a.document.term.localeCompare(b.document.term))
    return hits
  }

  /** What the search row shows: the definition, or the sentence that uses the query, then the derivation line. */
  static preview<T extends GlossarySearchDocument>(document: T, query: string, tier: 0 | 1 | 2): string {
    const definition = plain(document.definition)
    const body =
      tier < 2 ? clip(definition, 180) : clip(windowAround(reading(document), normalize(query)), 180)
    const derivation = (document.derivation ?? '').replace(/\s+/g, ' ').trim()
    if (!derivation) return body
    return `${body} Derivation: ${derivation}`
  }
}

function namedMatch(term: string, query: string): { tier: 0 | 1; score: number; words: number } | null {
  let tier: 0 | 1 | null = null
  let score = 0
  let words = 0
  for (const form of GlossaryAliases.forms(term)) {
    const folded = normalize(form)
    if (!folded) continue
    if (STOP.has(folded) && folded !== query) continue
    const count = folded.split(' ').length
    if (samePhrase(folded, query)) {
      tier = 0
      if (folded.length >= score) {
        score = folded.length
        words = count
      }
      continue
    }
    if (folded.length < 3) continue
    if (phraseIn(query, folded)) {
      if (tier !== 0) tier = 1
      if (tier === 1 && folded.length >= score) {
        score = folded.length
        words = count
      }
      continue
    }
    if (tier === 0) continue
    if (query.length >= 4 && !STOP.has(query) && folded.startsWith(`${query} `)) {
      tier = 1
      if (folded.length >= score) {
        score = folded.length
        words = count
      }
    }
  }
  if (tier === null) return null
  return { tier, score, words }
}

function focusMatch(
  text: string,
  phrases: { phrase: string; words: number }[]
): { score: number; words: number } | null {
  if (!text) return null
  let best = 0
  let words = 0
  for (const candidate of phrases) {
    const raw = concentration(text, candidate.phrase)
    if (raw === null) continue
    const weighted = candidate.words === 1 ? raw.score * 0.5 : raw.score
    const enough = candidate.words === 1 ? raw.score >= 0.08 && raw.early : raw.score >= 0.1
    if (enough && (weighted > best || (weighted === best && candidate.words > words))) {
      best = weighted
      words = candidate.words
    }
  }
  return best > 0 ? { score: best, words } : null
}

/** Phrases the query might be asking about. Function words never start one. */
function candidatePhrases(query: string): { phrase: string; words: number }[] {
  const words = query.split(' ').filter(Boolean)
  const found: { phrase: string; words: number }[] = []
  const seen = new Set<string>()
  const add = (phrase: string, count: number) => {
    if (!phrase || seen.has(phrase) || STOP.has(phrase)) return
    seen.add(phrase)
    found.push({ phrase, words: count })
  }
  if (words.length >= 1 && words.length <= 6 && words.some(word => !STOP.has(word) && word.length >= 3)) {
    add(words.join(' '), words.length)
  }
  for (let size = 3; size >= 2; size -= 1) {
    for (let index = 0; index + size <= words.length; index += 1) {
      const slice = words.slice(index, index + size)
      if (slice.some(word => STOP.has(word) || word.length < 3)) continue
      if (!slice.some(word => word.length >= 5)) continue
      add(slice.join(' '), size)
    }
  }
  for (const word of words) {
    if (STOP.has(word) || word.length < 6) continue
    add(word, 1)
  }
  return found
}

function concentration(
  text: string,
  phrase: string
): { score: number; early: boolean } | null {
  const indexes = contentIndexes(text, phrase)
  if (indexes.length === 0) return null
  const parts = sentences(text)
  let best = 0
  let early = false
  for (const index of indexes) {
    const sentence = parts.find(part => index >= part.start && index < part.start + part.text.length) ?? {
      text,
      start: 0
    }
    const at = Math.max(0, index - sentence.start)
    const share = sentence.text.length / text.length
    const leading = at <= 80 || at / Math.max(sentence.text.length, 1) < 0.45
    const phraseShare = Math.min(phrase.length / Math.max(sentence.text.length, 1), 1)
    const score = share * (0.45 + phraseShare) * (leading ? 1.8 : 0.55)
    if (score > best) {
      best = score
      early = leading
    }
  }
  return { score: best, early }
}

function contentIndexes(text: string, phrase: string): number[] {
  const pattern = phrasePattern(phrase)
  const indexes: number[] = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const after = text.slice(match.index + match[0].length, match.index + match[0].length + 16)
    if (!isCitationTail(after, phrase)) indexes.push(match.index)
    if (match[0].length === 0) pattern.lastIndex += 1
  }
  return indexes
}

/** "Veblen, T. (1899)" and "Veblen's account" name the author, not the good. */
function isCitationTail(after: string, phrase: string): boolean {
  if (phrase.includes(' ')) return false
  return /^(?:['’]s)?\s*(?:,|\(|\d{4}\b)/.test(after) || /^(?:['’]s)\b/.test(after)
}

function sentences(text: string) {
  const found: { text: string; start: number }[] = []
  const pattern = /[^.!?]+(?:[.!?]+|$)/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) found.push({ text: match[0], start: match.index })
  if (!found.length) found.push({ text, start: 0 })
  return found
}

function phraseIn(haystack: string, phrase: string): boolean {
  return phrasePattern(phrase).test(haystack)
}

function phrasePattern(phrase: string): RegExp {
  const words = phrase.split(' ').filter(Boolean)
  const last = words[words.length - 1] ?? ''
  const stem = words.slice(0, -1).map(escapeRegExp).join('[\\s-]+')
  const tail = wordVariants(last).map(escapeRegExp).join('|')
  const body = stem ? `${stem}[\\s-]+(?:${tail})` : `(?:${tail})`
  return new RegExp(`(?<![a-z0-9])(?:${body})(?![a-z0-9])`, 'gi')
}

function samePhrase(left: string, right: string): boolean {
  return canonical(left) === canonical(right) && canonical(left).length > 0
}

function canonical(phrase: string): string {
  const words = phrase.split(' ').filter(Boolean)
  if (!words.length) return ''
  const stem = singular(words[words.length - 1])
  if (stem) words[words.length - 1] = stem
  return words.join(' ')
}

function wordVariants(word: string): string[] {
  const forms = new Set<string>([word])
  const stem = singular(word)
  const base = stem ?? word
  forms.add(base)
  if (base.length >= 3) {
    forms.add(`${base}s`)
    if (/(?:ch|sh|x|z)$/.test(base)) forms.add(`${base}es`)
    if (/[bcdfghjklmnpqrstvwxz]y$/.test(base)) forms.add(`${base.slice(0, -1)}ies`)
  }
  return Array.from(forms)
}

function singular(word: string): string | null {
  if (word.length < 5) return null
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (/(?:ch|sh|x|z)es$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('s') && !/(?:ss|us|is|ness)$/.test(word)) return word.slice(0, -1)
  return null
}

function windowAround(text: string, query: string): string {
  const phrases = candidatePhrases(query).sort((a, b) => b.words - a.words || b.phrase.length - a.phrase.length)
  for (const candidate of phrases) {
    const indexes = contentIndexes(text, candidate.phrase)
    if (!indexes.length) continue
    const sentence = sentences(text).find(
      part => indexes[0] >= part.start && indexes[0] < part.start + part.text.length
    )
    return (sentence?.text ?? text.slice(indexes[0])).trim()
  }
  return text
}

function reading(document: GlossarySearchDocument): string {
  return plain(`${document.definition ?? ''} ${document.explanation ?? ''}`)
}

function plain(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function clip(value: string, max: number): string {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, ' ')
    .replace(/[^a-z0-9'\s-]+/g, ' ')
    .replace(/[-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
