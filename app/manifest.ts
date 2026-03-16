import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Кабинет 310 — Салон красоты в Сыктывкаре',
    short_name: 'Кабинет 310',
    description: 'Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц в Сыктывкаре',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
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
