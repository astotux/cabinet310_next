import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Контакты и адрес студии",
  description: "Контакты студии красоты Кабинет 310 в Сыктывкаре. Адрес, телефон, график работы, карта проезда. Запишитесь на перманентный макияж, маникюр или ламинирование ресниц.",
  keywords: ["кабинет 310 адрес", "кабинет 310 телефон", "студия красоты сыктывкар адрес", "где сделать перманент сыктывкар"],
  openGraph: {
    title: "Контакты — Кабинет 310 в Сыктывкаре",
    description: "Адрес, телефон, график работы студии красоты. Ждем вас ежедневно с 09:00 до 20:00.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/contacts',
  },
};

export default function ContactsPage() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[200px] right-[10%] size-[500px] bg-accent-purple/50 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-[800px] left-[5%] size-[420px] bg-accent-pink/70 blur-[110px] rounded-full -z-10"></div>
        <div className="absolute top-[1400px] left-[5%] size-[400px] bg-accent-purple/50 blur-[100px] rounded-full -z-10"></div>
        <div className="absolute top-[1800px] right-[8%] size-[460px] bg-accent-purple/50 blur-[115px] rounded-full -z-10"></div>
        <div className="absolute top-[2400px] right-[15%] size-[450px] bg-accent-pink/70 blur-[110px] rounded-full -z-10"></div>
        <div className="absolute top-[3000px] left-[12%] size-[380px] bg-accent-purple/50 blur-[105px] rounded-full -z-10"></div>
        <div className="absolute top-[3700px] right-[12%] size-[500px] bg-accent-purple/50 blur-[105px] rounded-full -z-10"></div>
        <div className="absolute top-[4200px] left-[8%] size-[400px] bg-accent-pink/70 blur-[105px] rounded-full -z-10"></div>
        <div className="absolute top-[4900px] right-[5%] size-[380px] bg-accent-purple/50 blur-[105px] rounded-full -z-10"></div>

        {/* Декоративные линии */}
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[100px] left-[-10%] w-[600px] md:w-[800px] opacity-30 -z-20 max-md:w-[400px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[600px] right-[-15%] w-[700px] md:w-[900px] opacity-25 -z-20 rotate-180 max-md:w-[450px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[1200px] left-[-5%] w-[550px] md:w-[750px] opacity-20 -z-20 max-md:w-[350px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[2000px] right-[-10%] w-[650px] md:w-[850px] opacity-30 -z-20 rotate-180 max-md:w-[400px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[2800px] left-[-8%] w-[600px] md:w-[800px] opacity-25 -z-20 max-md:w-[380px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[3500px] right-[-12%] w-[700px] md:w-[900px] opacity-20 -z-20 rotate-180 max-md:w-[420px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[4300px] left-[-10%] w-[650px] md:w-[850px] opacity-30 -z-20 max-md:w-[400px]" />

        {/* Декоративные звёздочки */}
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[150px] left-[15%] w-6 md:w-8 opacity-40 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[280px] right-[20%] w-4 md:w-5 opacity-30 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[450px] left-[8%] w-5 md:w-6 opacity-35 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[720px] right-[12%] w-7 md:w-9 opacity-25 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[950px] left-[25%] w-4 md:w-5 opacity-40 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[1100px] right-[18%] w-6 md:w-7 opacity-30 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[1350px] left-[12%] w-5 md:w-6 opacity-35 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[1600px] right-[25%] w-4 md:w-5 opacity-40 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[1850px] left-[18%] w-6 md:w-8 opacity-25 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[2100px] right-[15%] w-5 md:w-6 opacity-35 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[2450px] left-[22%] w-7 md:w-9 opacity-30 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[2700px] right-[10%] w-4 md:w-5 opacity-40 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[2950px] left-[16%] w-6 md:w-7 opacity-25 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[3200px] right-[22%] w-5 md:w-6 opacity-35 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[3550px] left-[10%] w-4 md:w-5 opacity-30 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[3850px] right-[16%] w-6 md:w-8 opacity-40 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[4100px] left-[20%] w-5 md:w-6 opacity-25 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[4400px] right-[14%] w-7 md:w-9 opacity-35 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[4700px] left-[14%] w-4 md:w-5 opacity-30 -z-20" />
        <Image src="/star.svg" alt="" width={24} height={24} className="absolute top-[5000px] right-[20%] w-6 md:w-7 opacity-40 -z-20" />
      </div>
      <Header />
      <main className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32">
        <section className="mb-16 max-[480px]:mb-12 max-[320px]:mb-10 relative rounded-3xl overflow-hidden min-h-[320px] flex items-center p-10 max-[480px]:p-6 max-[320px]:p-5 bg-slate-900">
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
            <h1 className="text-5xl max-[480px]:text-3xl max-[320px]:text-3xl font-black leading-[1.1] tracking-tight mb-5">
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
                    <p className="font-bold">г. Сыктывкар, ул. Куратова, д. 4</p>
                    <p className="text-sm text-slate-500  ">Кабинет 310</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-2xl bg-accent-purple/15 text-accent-purple flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Телефон</p>
                    <a className="font-bold hover:text-primary transition-colors" href="tel:+79086954904">+7 (908) 695-49-04</a>
                    <p className="text-sm text-slate-500  ">Можно писать в мессенджеры</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-2xl bg-accent-pink/20 text-accent-pink flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">График</p>
                    <p className="font-bold  ">Ежедневно: 9:00 — 20:00</p>
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
                      <div className="flex items-center gap-2">
                        <svg className="w-7 h-7 max-[480px]:w-6 max-[480px]:h-6 text-slate-400" width="804" height="481" viewBox="0 0 804 481" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.25306 5.61565C-27.5469 20.0157 50.8531 201.616 148.453 329.616C218.853 421.616 297.253 469.616 390.053 477.616C461.253 483.216 470.853 474.416 470.853 400.016C470.853 369.616 474.853 342.416 479.653 340.016C498.853 328.016 533.253 348.816 599.653 412.816L669.253 480.016H729.253C813.253 480.016 822.853 464.816 775.653 400.016C764.453 384.816 734.853 350.416 709.253 324.016C683.653 297.616 662.853 268.816 662.853 260.816C662.853 252.016 683.653 212.816 710.053 172.816C781.253 61.6156 797.253 25.6157 780.453 8.81565C770.853 -0.784346 681.253 -3.18435 659.653 4.81565C652.453 7.21565 628.453 44.8157 606.053 88.0156C566.853 164.016 507.653 236.016 485.253 236.016C477.253 236.016 474.053 210.416 472.453 128.816C471.653 64.0156 466.853 16.8157 461.253 10.4157C454.853 2.41565 431.653 0.0156536 371.653 1.61565C301.253 4.01565 290.853 5.61565 288.453 18.4157C286.853 26.4157 292.453 40.8157 300.453 49.6157C312.453 63.2156 315.653 82.4156 317.253 164.816C319.653 253.616 318.853 264.816 306.053 269.616C278.053 280.016 209.253 178.416 162.053 56.0157C141.253 1.61565 138.853 0.0156536 75.6531 0.815654C44.4531 0.815654 14.0531 3.21565 9.25306 5.61565Z" fill="lab(65.5349% -2.25151 -14.5072)" />
                        </svg>
                      </div>
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
