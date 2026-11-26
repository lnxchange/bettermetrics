/**
 * The chat prompt's Belief Register line.
 *
 * The line is the function-only specification of Chapter 4, Section 4.3.6,
 * read by ArchitectureSpecifications from the same chapter markdown the
 * architecture page uses. A shortened paraphrase is not kept beside it.
 */

import { ArchitectureSpecifications } from '@/lib/architecture-specifications'

export class ArchitecturePrompt {
  static readonly slot = '{{BELIEF_REGISTER}}'
  static readonly section = '4.3.6'

  static specification(markdown: string): string {
    return ArchitectureSpecifications.of(markdown, ArchitecturePrompt.section)
  }

  static apply(template: string, specification: string): string {
    if (!template.includes(ArchitecturePrompt.slot)) {
      throw new Error('The chat prompt has no Belief Register slot.')
    }
    if (!specification.startsWith('**Function-only specification.** ')) {
      throw new Error(
        'Chapter 4, Section 4.3.6 did not supply its function-only specification.'
      )
    }
    const prompt = template.split(ArchitecturePrompt.slot).join(specification)
    if (prompt.includes(ArchitecturePrompt.slot)) {
      throw new Error('The Belief Register slot was not filled.')
    }
    return prompt
  }
}
