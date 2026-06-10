import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Админ 310',
    short_name: 'Админ 310',
    description: 'Панель управления Кабинет 310',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#7a1ff9',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
