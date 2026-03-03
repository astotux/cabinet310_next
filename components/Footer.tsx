import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
        <div className="flex items-center gap-3">
          <a href="./index.html">
            <img src="./logo.svg" style={{"width": "100px"}} alt="Cabinet 310" />
          </a>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Студия эстетики в городе Сыктывкар. Мы создаем безупречные образы, подчеркивая вашу индивидуальность
          через искусство перманента и нейл-сервиса.
        </p>
      </div>

        <div className="space-y-4">
          <h4 className="font-bold text-base">Навигация</h4>
          <nav className="flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <Link href="/reviews" className="hover:text-white transition-colors">Отзывы</Link>
            <Link href="/contacts" className="hover:text-white transition-colors">Контакты</Link>
            <Link href="/booking" className="hover:text-white transition-colors">Записаться</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-base">Контакты</h4>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">location_on</span>
              <p>г. Москва, ул. Примерная, д. 310</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">phone</span>
              <a href="tel:+79991234567" className="hover:text-white transition-colors">+7 (999) 123-45-67</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">mail</span>
              <a href="mailto:info@cabinet310.ru" className="hover:text-white transition-colors">info@cabinet310.ru</a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-base">Режим работы</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Понедельник - Воскресенье</p>
            <p className="font-semibold text-white">09:00 - 20:00</p>
          </div>
          <div className="pt-4">
            <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Записаться
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 Кабинет 310. Все права защищены.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
          <span className="hidden md:inline">•</span>
          <p>С любовью к вашей красоте ✨</p>
        </div>
      </div>
    </footer>
  );
}
