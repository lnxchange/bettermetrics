export function AIMJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": "https://www.usebettermetrics.com/#AIMFramework",
        "name": "AIM Motivation Framework",
        "alternateName": "Appetites-Intrinsic-Mimetic Framework",
        "genre": "Theoretical Framework",
        "description": "A taxonomic synthesis integrating neuroscience, behavioral economics, and legal systems analysis to resolve definitional inconsistencies in motivation science through three neurologically distinct sources.",
        "keywords": [
          "motivational taxonomy",
          "behavioral economics",
          "neuroscience synthesis",
          "definitional framework",
          "systems architecture"
        ],
        "creator": {
          "@type": "Person",
          "@id": "https://www.usebettermetrics.com/#YuleGuttenbeil"
        },
        "about": [
          {
            "@type": "DefinedTerm",
            "@id": "https://www.usebettermetrics.com/#Appetites",
            "name": "Appetites (A)",
            "description": "Cyclical biological drives arising from homeostatic deficits, mediated through hypothalamus → orbitofrontal cortex → ventral striatum pathways. Characterized by terminal satisfiability and predictable recovery cycles.",
            "inDefinedTermSet": "https://www.usebettermetrics.com/#AIMFramework",
            "termCode": "A"
          },
          {
            "@type": "DefinedTerm",
            "@id": "https://www.usebettermetrics.com/#IntrinsicMotivation",
            "name": "Intrinsic Motivation (I)",
            "description": "Persistent engagement in activities valued for their own sake, not terminally satisfiable. Mediated through VTA dopamine → hippocampus → prefrontal cortex pathways. Aligns with Self-Determination Theory's autonomy, competence, and relatedness needs.",
            "inDefinedTermSet": "https://www.usebettermetrics.com/#AIMFramework",
            "termCode": "I",
            "sameAs": "https://selfdeterminationtheory.org/"
          },
          {
            "@type": "DefinedTerm",
            "@id": "https://www.usebettermetrics.com/#MimeticDesire",
            "name": "Mimetic Desire (M)",
            "description": "Socially transmitted wanting arising from observation of others' goal-directed actions. Mediated through mirror neuron systems (parietal/premotor cortex) → ventral striatum. Amplifies with model status and social visibility, building on Girardian mimetic theory.",
            "inDefinedTermSet": "https://www.usebettermetrics.com/#AIMFramework",
            "termCode": "M",
            "sameAs": "https://en.wikipedia.org/wiki/Mimetic_theory"
          }
        ],
        "citation": [
          "https://selfdeterminationtheory.org/",
          "https://www.nature.com/articles/nrn1345",
          "Girard, René. Deceit, Desire, and the Novel (1961)"
        ],
        "learningResourceType": "Theoretical Model",
        "educationalUse": "Research and Academic Study"
      },
      {
        "@type": "Person",
        "@id": "https://www.usebettermetrics.com/#YuleGuttenbeil",
        "name": "Yule Guttenbeil",
        "jobTitle": "Principal Commercial Lawyer & Behavioral Systems Architect",
        "description": "Creator of the AIM Motivation Framework. Specializes in definitional systems architecture and cross-disciplinary synthesis in behavioral sciences.",
        "url": "https://www.usebettermetrics.com",
        "sameAs": [
          "https://www.usebettermetrics.com"
        ],
        "knowsAbout": [
          "Commercial Law",
          "Contract Systems",
          "Behavioral Economics",
          "Motivational Taxonomy",
          "Neuroscience Synthesis",
          "Systems Architecture"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.usebettermetrics.com/#website",
        "name": "Use Better Metrics",
        "url": "https://www.usebettermetrics.com",
        "description": "Research platform for the AIM Motivation Framework: a taxonomic synthesis resolving definitional inconsistencies across neuroscience, behavioral economics, and psychology.",
        "publisher": {
          "@id": "https://www.usebettermetrics.com/#YuleGuttenbeil"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.usebettermetrics.com/chat?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

