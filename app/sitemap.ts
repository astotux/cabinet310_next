import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cabinet310.ru';
  const now = new Date('2026-03-13');

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/services/permanent-brows`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services/permanent-lips`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services/eyeliner`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services/manicure`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services/lash-lamination`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
