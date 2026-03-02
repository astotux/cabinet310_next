import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отзывы клиентов — Кабинет 310",
  description: "Отзывы наших клиентов о качестве услуг студии красоты Кабинет 310",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
