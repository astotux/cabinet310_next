import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Кабинет 310 — Студия красоты в Сыктывкаре',
    short_name: 'Кабинет 310',
    description: 'Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц в Сыктывкаре',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7a1ff9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
