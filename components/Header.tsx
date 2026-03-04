"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  // Загружаем состояние меню из localStorage при монтировании
  useEffect(() => {
    const savedState = localStorage.getItem('mobileMenuVisible');
    if (savedState !== null) {
      setIsMenuVisible(savedState === 'true');
    }
  }, []);

  // Сохраняем состояние меню в localStorage при изменении
  const toggleMenu = () => {
    const newState = !isMenuVisible;
    setIsMenuVisible(newState);
    localStorage.setItem('mobileMenuVisible', String(newState));
  };

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

      <div className="md:hidden p-3 w-full flex justify-between items-center">
        
        <div className="w-10"></div>
        <div className="glass rounded-2xl px-4 py-3 inline-flex items-center justify-center">
          <Link href="/">
            <Image src="/logo.svg" width={96} height={34} className="w-24" alt="Logo" />
          </Link>
        </div>
        <button
          onClick={toggleMenu}
          className="glass rounded-xl p-2 flex items-center justify-center hover:bg-white/80 transition-colors"
          aria-label={isMenuVisible ? "Скрыть меню" : "Показать меню"}
        >
          <span className="material-symbols-outlined text-xl text-primary">
            {isMenuVisible ? "expand_more" : "expand_less"}
          </span>
        </button>
        
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isMenuVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex flex-col gap-3 p-3">
          <Link
            href="/booking"
            className="gradient-bg rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Записаться
          </Link>

          <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-around">
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/">
              <span className="material-symbols-outlined text-xl">home</span>
              <span>Главная</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/services">
              <span className="material-symbols-outlined text-xl">spa</span>
              <span>Услуги</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/reviews">
              <span className="material-symbols-outlined text-xl">star</span>
              <span>Отзывы</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/contacts">
              <span className="material-symbols-outlined text-xl">account_box</span>
              <span>Контакты</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
