import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32">
      <section className="mb-16 max-[480px]:mb-12 max-[320px]:mb-10 relative rounded-3xl overflow-hidden min-h-[320px] flex items-center p-10 max-[480px]:p-6 max-[320px]:p-5 bg-slate-900">
        <div 
          className="absolute inset-0 opacity-35 bg-center bg-cover"
          style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5o8dJxHaU2afrjR1saDcd58EmcGKvCRm3rYCwoCj6t5n-XPM9DJyTozPbuvLnde9I0M67EUlxxTx9loPtnuUjvG3ZSNqRLfit5p5ir8X4gfJaA47kdDEEylwqEXsJ7QQzuj4mAwoISCVv9IoD3MpF0gSE9rK3607pEQekTts3nRCwPYxWWhPPpN3UjXwEKFVd8ayko_qT73AMdOlmHG_XHawcwjRThozQb7uSYLJz-Sw5LddB-3cyVyn-X4NKz8wicVGne1dMQXs')"}}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img 
            src="/star.svg" 
            alt=""
            className="absolute left-6 top-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-25 mix-blend-screen"
          />
          <img 
            src="/star.svg" 
            alt=""
            className="absolute right-8 top-16 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-20 mix-blend-screen"
          />
          <img 
            src="/star.svg" 
            alt=""
            className="absolute right-12 bottom-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-20 mix-blend-screen"
          />
        </div>

        <div className="relative z-10 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/15 border border-white/30 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">location_on</span>
            Как нас найти
          </div>
          <h1 className="text-5xl max-[480px]:text-3xl max-[320px]:text-2xl font-black leading-[1.1] tracking-tight mb-5">
            Контакты <span className="text-gradient">Кабинет 310</span>
          </h1>
          <p className="text-slate-100/90 text-lg max-[480px]:text-base leading-relaxed max-w-xl">
            Адрес, телефон, соцсети и карта — все в одном месте. Если не дозвонились, напишите нам в мессенджер.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
            <h2 className="text-2xl font-black tracking-tight mb-6  ">Наши контакты</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Адрес</p>
                  <p className="font-bold  ">Ваш город, адрес студии</p>
                  <p className="text-sm text-slate-500  ">Ориентир: ТЦ/метро/улица (по желанию)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-accent-purple/15 text-accent-purple flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Телефон</p>
                  <a className="font-bold hover:text-primary transition-colors" href="tel:+70000000000">+7 (___) ___-__-__</a>
                  <p className="text-sm text-slate-500  ">Можно писать в мессенджеры</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-accent-pink/20 text-accent-pink flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">График</p>
                  <p className="font-bold  ">Ежедневно: 10:00 — 21:00</p>
                  <p className="text-sm text-slate-500  ">По предварительной записи</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/70  ">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Соцсети</p>
              <div className="grid">
                <a 
                  href="#"
                  className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-white/60   border border-slate-200/60   hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold   leading-tight">Вконтакте</p>
                      <p className="text-xs text-slate-500   leading-tight">@cabinet310</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          <div className="service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-xl font-black mb-2  ">Как добраться</h3>
                <p className="text-sm text-slate-500   leading-relaxed">
                  Добавь сюда пару подсказок: подъезд/этаж, где парковка, как пройти от метро.
                </p>
              </div>
              <div className="size-12 rounded-2xl gradient-bg text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">directions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight  ">Мы на карте</h2>
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span className="material-symbols-outlined text-primary text-base">map</span>
                Локация
              </div>
            </div>

            <div 
              id="yandex-map"
              className="w-full h-[420px] max-[480px]:h-[360px] max-[320px]:h-[320px] rounded-2xl bg-slate-100   border border-slate-200/70   overflow-hidden"
            >
              <iframe 
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A69911730ccf7e45514f1b020950366a4dd45c223b3b597d3cf70ba7937401471&amp;source=constructor" 
                width="100%" 
                height="100%" 
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
