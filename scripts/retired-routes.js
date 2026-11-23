/**
 * Permanent redirects for routes retired in the Minimal Architecture cutover.
 * Glossary destinations were checked against the live aimtheory.org sitemap
 * on 23 Nov 2026: each target returns as a glossary entry.
 */

/**
 * @typedef {{ source: string, destination: string, permanent: true, statusCode: 301 }} RetiredRedirect
 */

class RetiredRoutes {
  /** @returns {RetiredRedirect} */
  static axioms() {
    return { source: '/axioms', destination: '/architecture', permanent: true, statusCode: 301 }
  }

  /**
   * Old Chapter 2 headings, including the axiom-5 Mimetic Premium slug,
   * the Object Parasitism variant of that slug, and the restatement
   * headings that became architectural commitments.
   * @returns {RetiredRedirect[]}
   */
  static glossary() {
    const pairs = [
      ['axiom-1-three-source-taxonomy', 'three-source-taxonomy'],
      ['axiom-2-common-currency-integration', 'common-currency-integration'],
      ['axiom-3-source-opacity', 'source-opacity'],
      ['axiom-4-confabulation', 'confabulation'],
      ['axiom-5-m-as-amplifier-the-mimetic-premium', 'object-parasitism'],
      ['axiom-5-m-as-amplifier-object-parasitism', 'object-parasitism'],
      ['axiom-5-object-parasitism', 'object-parasitism'],
      [
        'axiom-6-differential-satiation-dynamics',
        'differential-satiation-dynamics'
      ],
      ['axiom-7-preconscious-transmission', 'preconscious-transmission'],
      ['axiom-8-bayesian-belief-dynamics', 'bayesian-belief-dynamics'],
      ['axiom-9-agent-based-causal-default', 'agent-based-causal-default'],
      ['agent-based-causal-default-axiom-9', 'agent-based-causal-default'],
      [
        'b1-b3-slow-layer-axiom-restatements',
        'b1-b3-slow-layer-architectural-commitments'
      ],
      [
        'fast-layer-axiom-restatements-m1-through-m5b',
        'fast-layer-architectural-commitments-m1-through-m5b'
      ],
      [
        'network-layer-axiom-restatements-n1-n4',
        'network-layer-architectural-commitments-n1-n4'
      ]
    ]
    return pairs.map(([source, destination]) => ({
      source: `/glossary/${source}`,
      destination: `/glossary/${destination}`,
      permanent: true,
      statusCode: 301
    }))
  }

  /** @returns {RetiredRedirect[]} */
  static all() {
    return [RetiredRoutes.axioms(), ...RetiredRoutes.glossary()]
  }
}

module.exports = { RetiredRoutes }
