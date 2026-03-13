import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description: "Реальные отзывы клиентов студии красоты Кабинет 310 в Сыктывкаре. Перманентный макияж бровей, губ, межреснички, маникюр, ламинирование ресниц. Фото работ и впечатления наших гостей.",
  keywords: ["отзывы кабинет 310", "отзывы перманентный макияж сыктывкар", "отзывы маникюр сыктывкар", "отзывы студия красоты"],
  openGraph: {
    title: "Отзывы клиентов — Кабинет 310",
    description: "Реальные отзывы и фото работ от наших клиентов. Узнайте, почему нам доверяют свою красоту.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/reviews',
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
