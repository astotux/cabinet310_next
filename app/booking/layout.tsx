import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Онлайн запись на услуги",
  description: "Запишитесь онлайн на перманентный макияж бровей, губ и межреснички, маникюр или ламинирование ресниц в салоне Кабинет 310 в Сыктывкаре. Выберите удобное время и дату.",
  keywords: ["запись на перманент сыктывкар", "запись на маникюр сыктывкар", "онлайн запись салон красоты", "запись кабинет 310"],
  openGraph: {
    title: "Онлайн запись — Кабинет 310",
    description: "Выберите услугу, дату и время. Запишитесь на перманентный макияж, маникюр или ламинирование ресниц онлайн.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://cabinet310.ru/booking',
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
