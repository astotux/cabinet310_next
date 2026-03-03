import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] right-[10%] size-[400px] bg-accent-purple/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[10%] size-[400px] bg-accent-pink/70 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-[480px]:px-4 max-w-3xl mx-auto">
        {/* Большая цифра 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[180px] max-[768px]:text-[120px] max-[480px]:text-[80px] font-black leading-none text-gradient opacity-20 select-none">
            404
          </h1>
        </div>

        {/* Заголовок */}
        <h2 className="text-4xl max-[768px]:text-3xl max-[480px]:text-2xl font-black tracking-tight text-slate-900 mb-4">
          Страница не найдена
        </h2>

        {/* Описание */}
        <p className="text-lg max-[480px]:text-base text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
          К сожалению, страница, которую вы ищете, не существует или была перемещена. Но не переживайте — мы поможем вам найти то, что нужно!
        </p>

        {/* Кнопки навигации */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 gradient-bg px-10 max-[480px]:px-8 py-4 max-[480px]:py-3.5 rounded-2xl text-white font-bold text-lg max-[480px]:text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">home</span>
            На главную
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 glass px-10 max-[480px]:px-8 py-4 max-[480px]:py-3.5 rounded-2xl font-bold text-lg max-[480px]:text-base hover:bg-white/80 transition-all"
          >
            <span className="material-symbols-outlined">event</span>
            Записаться
          </Link>
        </div>

        {/* Дополнительные ссылки */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Возможно, вас заинтересует:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/reviews"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Отзывы
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/contacts"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Контакты
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Мы в ВК
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
