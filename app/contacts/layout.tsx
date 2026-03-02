import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты — Кабинет 310",
  description: "Адрес, телефон и режим работы студии красоты Кабинет 310",
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
