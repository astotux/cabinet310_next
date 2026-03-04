import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
        <div className="flex items-center gap-3">
          <a href="./index.html">
            <img src="/logo.svg" style={{"width": "100px"}} alt="Cabinet 310" />
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
            <Link href="/services" className="hover:text-white transition-colors">Услуги</Link>
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
              <a href="https://yandex.ru/profile/72948536986?lang=ru" className="hover:text-white transition-colors">г. Сыктывкар, ул. Куратова, д. 4</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">phone</span>
              <a href="tel:+79086954904" className="hover:text-white transition-colors">+7 (908) 695-49-04</a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 max-[480px]:w-6 max-[480px]:h-6 text-slate-400" width="804" height="481" viewBox="0 0 804 481" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.25306 5.61565C-27.5469 20.0157 50.8531 201.616 148.453 329.616C218.853 421.616 297.253 469.616 390.053 477.616C461.253 483.216 470.853 474.416 470.853 400.016C470.853 369.616 474.853 342.416 479.653 340.016C498.853 328.016 533.253 348.816 599.653 412.816L669.253 480.016H729.253C813.253 480.016 822.853 464.816 775.653 400.016C764.453 384.816 734.853 350.416 709.253 324.016C683.653 297.616 662.853 268.816 662.853 260.816C662.853 252.016 683.653 212.816 710.053 172.816C781.253 61.6156 797.253 25.6157 780.453 8.81565C770.853 -0.784346 681.253 -3.18435 659.653 4.81565C652.453 7.21565 628.453 44.8157 606.053 88.0156C566.853 164.016 507.653 236.016 485.253 236.016C477.253 236.016 474.053 210.416 472.453 128.816C471.653 64.0156 466.853 16.8157 461.253 10.4157C454.853 2.41565 431.653 0.0156536 371.653 1.61565C301.253 4.01565 290.853 5.61565 288.453 18.4157C286.853 26.4157 292.453 40.8157 300.453 49.6157C312.453 63.2156 315.653 82.4156 317.253 164.816C319.653 253.616 318.853 264.816 306.053 269.616C278.053 280.016 209.253 178.416 162.053 56.0157C141.253 1.61565 138.853 0.0156536 75.6531 0.815654C44.4531 0.815654 14.0531 3.21565 9.25306 5.61565Z" fill="lab(65.5349% -2.25151 -14.5072)"/>
              </svg>
              <a href="https://vk.com/cabinet_310" className="hover:text-white transition-colors">@cabinet310</a>
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
