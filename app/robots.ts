import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/qr/', '/admin', '/qr'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/', '/api/', '/qr/', '/admin', '/qr'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/qr/', '/admin', '/qr'],
      },
    ],
    sitemap: 'https://cabinet310.ru/sitemap.xml',
  };
}
