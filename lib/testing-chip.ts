/**
 * Visual treatment for a status word. The word is always shown; colour only
 * reinforces it. Words that are not in this table are neutral, so a later
 * vocabulary entry still renders.
 */
export type TestingChipTreatment =
  | 'strong'
  | 'neutral'
  | 'outlined'
  | 'muted'
  | 'positive'
  | 'caution'
  | 'negative'

export class TestingChip {
  static treatment(word: string): TestingChipTreatment {
    switch (word) {
      case 'machine-checked':
        return 'strong'
      case 'cited':
        return 'outlined'
      case 'open':
      case 'untested':
      case 'check pending':
        return 'muted'
      case 'supported':
      case 'done':
        return 'positive'
      case 'contested':
        return 'caution'
      case 'contradicted':
        return 'negative'
      case 'derived':
      case 'in progress':
      case 'partly done':
        return 'neutral'
      default:
        return 'neutral'
    }
  }

  static className(word: string): string {
    const base =
      'inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-left text-xs font-medium leading-snug'
    const tone: Record<TestingChipTreatment, string> = {
      strong: 'bg-foreground font-semibold text-background',
      neutral: 'bg-muted text-foreground',
      outlined: 'border border-foreground/40 bg-transparent text-foreground',
      muted: 'bg-muted text-muted-foreground',
      positive:
        'bg-green-50 text-green-950 dark:bg-green-950/50 dark:text-green-100',
      caution:
        'bg-amber-50 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100',
      negative: 'bg-red-50 text-red-950 dark:bg-red-950/40 dark:text-red-100'
    }
    return `${base} ${tone[TestingChip.treatment(word)]}`
  }
}
