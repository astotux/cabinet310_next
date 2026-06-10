import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ панель",
  manifest: '/admin/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: "Админ 310",
    statusBarStyle: "default",
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
