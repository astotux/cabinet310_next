import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
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

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}
