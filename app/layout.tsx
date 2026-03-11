import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cabinet310.ru'),
  title: {
    default: "Кабинет 310 — Студия красоты в Сыктывкаре | Перманентный макияж и маникюр",
    template: "%s | Кабинет 310"
  },
  description: "Салон красоты в Сыктывкаре. Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц. 5+ лет опыта, 500+ довольных клиентов. Запись онлайн.",
  keywords: ["салон красоты сыктывкар", "студия красоты сыктывкар", "перманентный макияж сыктывкар", "пудровые брови сыктывкар", "татуаж губ сыктывкар", "межресничка сыктывкар", "маникюр сыктывкар", "ламинирование ресниц сыктывкар", "студия красоты сыктывкар", "перманент бровей"],
  authors: [{ name: "Кабинет 310" }],
  creator: "Кабинет 310",
  publisher: "Кабинет 310",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cabinet310.ru',
    siteName: 'Кабинет 310',
    title: 'Кабинет 310 — Студия красоты в Сыктывкаре',
    description: 'Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц. 5+ лет опыта, премиальные материалы, 100% стерильность.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Кабинет 310 — Студия красоты в Сыктывкаре',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Кабинет 310 — Студия красоты в Сыктывкаре',
    description: 'Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Удали эти строки или добавь реальные коды верификации
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href="https://cabinet310.ru" />
        <meta name="yandex-verification" content="050e9e29482539ba" />
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(107154105, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true,
                ecommerce:"dataLayer"
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/107154105"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "Кабинет 310",
              "description": "Студия красоты премиум-класса в Сыктывкаре. Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц.",
              "url": "https://cabinet310.ru",
              "telephone": "+7-908-695-49-04",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ваш адрес",
                "addressLocality": "Сыктывкар",
                "addressRegion": "Республика Коми",
                "postalCode": "167000",
                "addressCountry": "RU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "61.6681",
                "longitude": "50.8372"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "09:00",
                  "closes": "20:00"
                }
              ],
              "priceRange": "$$",
              "image": "https://cabinet310.ru/og-image.jpg",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "500"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Услуги студии красоты",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Перманентный макияж бровей",
                      "description": "Пудровые брови, естественный эффект"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Перманентный макияж губ",
                      "description": "Акварельные губы, контур и заполнение"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Межресничка",
                      "description": "Перманентный макияж межресничного пространства"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Маникюр",
                      "description": "Укрепление, дизайн ногтей"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Ламинирование ресниц",
                      "description": "Оформление и ламинирование ресниц"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://vk.com/cabinet310"
              ]
            })
          }}
        />
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
        <CookieConsent />
      </body>
    </html>
  );
}
