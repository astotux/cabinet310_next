import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты и адрес студии",
  description: "Контакты студии красоты Кабинет 310 в Сыктывкаре. Адрес, телефон, график работы, карта проезда. Запишитесь на перманентный макияж, маникюр или ламинирование ресниц.",
  keywords: ["кабинет 310 адрес", "кабинет 310 телефон", "студия красоты сыктывкар адрес", "где сделать перманент сыктывкар"],
  openGraph: {
    title: "Контакты — Кабинет 310 в Сыктывкаре",
    description: "Адрес, телефон, график работы студии красоты. Ждем вас ежедневно с 09:00 до 20:00.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/contacts',
  },
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
