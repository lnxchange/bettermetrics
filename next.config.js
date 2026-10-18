/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  },
  async redirects() {
    // Pages retired in the site refocus. The theory now lives on /theory, the
    // self-diagnosis on the home page, and the research programme on /about.
    // Domain-specific questions are answered by the chat.
    return [
      { source: '/research', destination: '/theory#applications', permanent: true },
      { source: '/research/definitions', destination: '/theory', permanent: true },
      { source: '/research/theories', destination: '/theory', permanent: true },
      { source: '/research/methodology', destination: '/theory', permanent: true },
      { source: '/research/economics', destination: '/theory#applications', permanent: true },
      { source: '/research/psychology', destination: '/theory#applications', permanent: true },
      { source: '/research/law', destination: '/theory#applications', permanent: true },
      { source: '/research/organizations', destination: '/theory#applications', permanent: true },
      { source: '/research/health-policy', destination: '/theory#applications', permanent: true },
      { source: '/research/marketing', destination: '/theory#applications', permanent: true },
      { source: '/research/education', destination: '/theory#applications', permanent: true },
      { source: '/research/hypothesis', destination: '/about#research', permanent: true },
      { source: '/research-resources', destination: '/about#research', permanent: true },
      { source: '/understand-your-motivations', destination: '/#diagnostic', permanent: true },
      { source: '/understand-yourself', destination: '/#diagnostic', permanent: true }
    ]
  }
}
