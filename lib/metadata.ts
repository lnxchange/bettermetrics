import { Metadata } from 'next'

export interface ArticleMetadataProps {
  title: string
  description: string
  path: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  image?: string
}

/**
 * Generate enhanced metadata for article pages with full SEO and Safari Reader support
 */
export function generateArticleMetadata({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
  authors = ['Yule Guttenbeil'],
  tags = [],
  image = '/AIM Logo.png'
}: ArticleMetadataProps): Metadata {
  const url = `https://www.usebettermetrics.com${path}`
  const imageUrl = `https://www.usebettermetrics.com${image}`

  return {
    title,
    description,
    authors: authors.map(name => ({ name })),
    keywords: [
      'AIM Framework',
      'motivation science',
      'behavioral economics',
      'intrinsic motivation',
      'mimetic desire',
      'neuroscience',
      'psychology',
      ...tags
    ],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url,
      siteName: 'Use Better Metrics',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      publishedTime,
      modifiedTime,
      authors
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@usebettermetrics'
    },
    alternates: {
      canonical: url
    },
    // Safari Reader and article metadata
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      'article:author': authors.join(', '),
      'article:section': 'Research',
      'article:tag': tags.join(', ')
    }
  }
}

/**
 * Generate JSON-LD structured data for article pages
 */
export function generateArticleStructuredData({
  title,
  description,
  path,
  publishedTime = new Date().toISOString(),
  modifiedTime = new Date().toISOString(),
  authors = ['Yule Guttenbeil'],
  image = '/AIM Logo.png'
}: ArticleMetadataProps) {
  const url = `https://www.usebettermetrics.com${path}`
  const imageUrl = `https://www.usebettermetrics.com${image}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: authors.map(name => ({
      '@type': 'Person',
      name
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Use Better Metrics',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.usebettermetrics.com/AIM Logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }
}
