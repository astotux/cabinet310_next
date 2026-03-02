import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Кабинет 310 — Студия красоты",
  description: "Перманентный макияж и нейл-сервис нового уровня",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <style dangerouslySetInnerHTML={{__html: `
          .swiper-pagination-bullet {
            background: linear-gradient(135deg, #FEB9E5 0%, #9F6DFC 100%) !important;
            opacity: 1 !important;
            width: 8px !important;
            height: 8px !important;
            transition: all 0.3s ease !important;
          }
          .swiper-pagination-bullet-active {
            background: linear-gradient(135deg, #FEB9E5 0%, #9F6DFC 100%) !important;
            width: 24px !important;
            border-radius: 4px !important;
          }
          .swiper-button-next,
          .swiper-button-prev {
            color: #7a1ff9 !important;
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
          .swiper-button-next:after,
          .swiper-button-prev:after {
            content: '' !important;
          }
          .swiper-button-prev svg {
            transform: rotate(180deg) !important;
          }
          .swiper-button-next svg,
          .swiper-button-prev svg {
            width: 20px !important;
            height: 20px !important;
          }
          @media (max-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              display: none !important;
            }
          }
        `}} />
      </head>
      <body className={`${inter.variable} font-display antialiased`}>
        {children}
      </body>
    </html>
  );
}
