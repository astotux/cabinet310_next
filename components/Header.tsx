"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden md:block glass border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/">
              <Image src="/logo.svg" width={112} height={40} className="w-20 md:w-24 lg:w-28" alt="Logo" />
            </Link>
          </div>
          <nav className="flex items-center gap-6 lg:gap-10">
            <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/">
              Главная
            </Link>
            <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/services">
              Услуги
            </Link>
            <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/reviews">
              Отзывы
            </Link>
            <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/contacts">
              Контакты
            </Link>
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/booking"
              className="gradient-bg px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-white text-xs md:text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              Записаться
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden p-3 w-full flex justify-center">
        <div className="glass rounded-2xl px-4 py-3 inline-flex items-center justify-center">
          <Link href="/">
            <Image src="/logo.svg" width={96} height={34} className="w-24" alt="Logo" />
          </Link>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-3 p-3">
        <Link
          href="/booking"
          className="gradient-bg rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity text-center"
        >
          Записаться
        </Link>

        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-around">
          <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/services">
            <span className="material-symbols-outlined text-xl">spa</span>
            <span>Услуги</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/reviews">
            <span className="material-symbols-outlined text-xl">star</span>
            <span>Отзывы</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/">
            <span className="material-symbols-outlined text-xl">home</span>
            <span>Главная</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/contacts">
            <span className="material-symbols-outlined text-xl">account_box</span>
            <span>Контакты</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
