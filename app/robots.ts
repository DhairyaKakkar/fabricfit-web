import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private/transactional surfaces out of the index.
      disallow: ['/dashboard', '/checkout', '/api/', '/auth/', '/login'],
    },
    sitemap: 'https://trialroomstudio.com/sitemap.xml',
  };
}
