import type { MetadataRoute } from 'next';
import { POSTS } from '@/content/posts';

const SITE_URL = 'https://trialroomstudio.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         changeFrequency: 'weekly',  priority: 1 },
    { url: `${SITE_URL}/demo`,     changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/pricing`,  changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/products`, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/contact`,  changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${SITE_URL}/blog`,     changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/signup`,   changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/privacy`,  changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/terms`,    changeFrequency: 'yearly',  priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
