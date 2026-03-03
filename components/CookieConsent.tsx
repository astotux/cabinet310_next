'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Проверяем, принял ли пользователь cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-[100] p-3 md:p-4 pb-37 md:pb-4 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="material-symbols-outlined text-primary text-lg md:text-2xl shrink-0">cookie</span>
              <div>
                <p className="text-[10px] md:text-sm text-slate-600 leading-snug md:leading-relaxed">
                  Мы используем файлы cookie для улучшения работы сайта. 
                  Продолжая использовать сайт, вы соглашаетесь с их использованием.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={acceptCookies}
            className="gradient-bg px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-white font-bold text-xs md:text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
