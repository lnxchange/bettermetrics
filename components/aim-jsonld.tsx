import { SITE_LOGO_PATH, SITE_NAME, SITE_URL } from '@/lib/site'

export function AIMJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}${SITE_LOGO_PATH}`,
          "width": 628,
          "height": 628
        },
        "founder": { "@id": `${SITE_URL}/#YuleGuttenbeil` }
      },
      {
        "@type": "CreativeWork",
        "@id": "https://aimtheory.org/#AIMFramework",
        "name": "AIM Framework",
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
          "@id": "https://aimtheory.org/#YuleGuttenbeil"
        },
        "about": [
          {
            "@type": "DefinedTerm",
            "@id": "https://aimtheory.org/#Appetites",
            "name": "Appetites (A)",
            "description": "Cyclical biological drives arising from homeostatic deficits, mediated through hypothalamus → orbitofrontal cortex → ventral striatum pathways. Characterized by terminal satisfiability and predictable recovery cycles.",
            "inDefinedTermSet": "https://aimtheory.org/#AIMFramework",
            "termCode": "A"
          },
          {
            "@type": "DefinedTerm",
            "@id": "https://aimtheory.org/#IntrinsicMotivation",
            "name": "Intrinsic Motivation (I)",
            "description": "Persistent engagement in activities valued for their own sake, not terminally satisfiable. Mediated through VTA dopamine → hippocampus → prefrontal cortex pathways. Aligns with Self-Determination Theory's autonomy, competence, and relatedness needs.",
            "inDefinedTermSet": "https://aimtheory.org/#AIMFramework",
            "termCode": "I",
            "sameAs": "https://selfdeterminationtheory.org/"
          },
          {
            "@type": "DefinedTerm",
            "@id": "https://aimtheory.org/#MimeticDesire",
            "name": "Mimetic Desire (M)",
            "description": "Socially transmitted wanting arising from observation of others' goal-directed actions. Mediated through mirror neuron systems (parietal/premotor cortex) → ventral striatum. Amplifies with model status and social visibility, building on Girardian mimetic theory.",
            "inDefinedTermSet": "https://aimtheory.org/#AIMFramework",
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
        "@id": "https://aimtheory.org/#YuleGuttenbeil",
        "name": "Yule Guttenbeil",
        "jobTitle": "Principal Commercial Lawyer & Behavioral Systems Architect",
        "description": "Creator of the AIM Framework. Specializes in definitional systems architecture and cross-disciplinary synthesis in behavioral sciences.",
        "url": "https://aimtheory.org",
        "sameAs": [
          "https://aimtheory.org"
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
        "@id": "https://aimtheory.org/#website",
        "name": SITE_NAME,
        "alternateName": "AIM Framework",
        "url": "https://aimtheory.org",
        "description": "Research platform for the AIM Framework: a taxonomic synthesis resolving definitional inconsistencies across neuroscience, behavioral economics, and psychology.",
        "publisher": {
          "@id": "https://aimtheory.org/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://aimtheory.org/chat?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Book",
        "@id": "https://aimtheory.org/#Book",
        "name": "A Unifying General Theory of Human Motivation: Appetites, Intrinsic Motivation and Mimetic Desire (AIM)",
        "alternateName": "The AIM Framework Book",
        "author": {
          "@id": "https://aimtheory.org/#YuleGuttenbeil"
        },
        "publisher": {
          "@id": "https://aimtheory.org/#organization"
        },
        "url": "https://aimtheory.org/treatise",
        "about": {
          "@id": "https://aimtheory.org/#AIMFramework"
        },
        "description": "A comprehensive theoretical synthesis integrating neuroscience, behavioral economics, Self-Determination Theory, and Girardian mimetic theory to resolve definitional inconsistencies (Code Drift) in motivation science through three neurologically distinct sources.",
        "genre": [
          "Behavioral Science",
          "Theoretical Framework",
          "Neuroscience",
          "Psychology"
        ],
        "keywords": [
          "motivation theory",
          "behavioral economics",
          "neuroscience synthesis",
          "mimetic desire",
          "intrinsic motivation",
          "Self-Determination Theory",
          "Girardian theory",
          "motivational taxonomy",
          "Code Drift"
        ],
        "inLanguage": "en",
        "hasPart": [
          {
            "@type": "Chapter",
            "name": "Chapter 2: General Theory of Motivation",
            "description": "Defines the core constructs, axioms, theorems, and glossary of the AIM Framework.",
            "position": 2,
            "url": "https://aimtheory.org/glossary"
          }
        ]
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

