import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Запись онлайн — Кабинет 310",
  description: "Онлайн запись на услуги перманентного макияжа, маникюра и ламинирования ресниц",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
