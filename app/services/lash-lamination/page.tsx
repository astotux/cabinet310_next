import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Ламинирование ресниц в Сыктывкаре — Кабинет 310",
  description: "Профессиональное ламинирование ресниц в Сыктывкаре. Подкручивание, укрепление и окрашивание натуральных ресниц. Эффект на 6-8 недель. Опытные мастера, безопасные составы.",
  keywords: [
    "ламинирование ресниц сыктывкар",
    "ботокс ресниц сыктывкар",
    "подкручивание ресниц",
    "ламинирование ресниц цена сыктывкар",
    "кабинет 310 ламинирование"
  ],
  openGraph: {
    title: "Ламинирование ресниц — Кабинет 310 в Сыктывкаре",
    description: "Выразительный взгляд без наращивания. Ламинирование и ботокс ресниц. Записывайтесь к лучшим мастерам Сыктывкара.",
    images: ['/og-lash-lamination.jpg'],
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cabinet310.ru/services/lash-lamination',
    siteName: 'Кабинет 310',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ламинирование ресниц — Кабинет 310 в Сыктывкаре',
    description: 'Выразительный взгляд без наращивания. Ламинирование и ботокс ресниц.',
    images: ['/og-lash-lamination.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/services/lash-lamination',
  },
  other: {
    'yandex-verification': 'your-yandex-verification-code',
    'google-site-verification': 'your-google-verification-code',
  },
};

export default function LashLaminationPage() {
  const portfolioPhotos = [
    { image: "/photo1.png", title: "Естественный изгиб", description: "Красивое подкручивание" },
    { image: "/photo2.png", title: "Выразительный взгляд", description: "Эффект открытых глаз" },
    { image: "/photo3.png", title: "До и после", description: "Видимый результат" },
    { image: "/photo4.png", title: "Укрепление", description: "Здоровые ресницы" },
    { image: "/photo5.png", title: "Стойкий эффект", description: "Красота на недели" },
    { image: "/photo6.png", title: "Профессиональная работа", description: "Опытные мастера" }
  ];

  const faqItems = [
    {
      question: "Как долго держится ламинирование ресниц?",
      answer: "Эффект ламинирования держится 6-8 недель в зависимости от индивидуальных особенностей и скорости обновления ресниц. После этого процедуру можно повторить.",
      icon: "schedule"
    },
    {
      question: "Вредно ли ламинирование для ресниц?",
      answer: "Нет, ламинирование не вредит ресницам. Наоборот, составы содержат кератин и питательные компоненты, которые укрепляют и восстанавливают структуру ресниц.",
      icon: "health_and_safety"
    },
    {
      question: "Можно ли красить ресницы после ламинирования?",
      answer: "Да, но обычно в этом нет необходимости, так как в процедуру входит окрашивание. Если хотите использовать тушь, выбирайте составы без масел.",
      icon: "brush"
    },
    {
      question: "Какие противопоказания к процедуре?",
      answer: "Беременность и лактация (по желанию клиента), воспалительные заболевания глаз, аллергия на компоненты состава, недавние операции на глазах.",
      icon: "warning"
    }
  ];

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[200px] right-[10%] size-[500px] bg-accent-purple/50 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-[800px] left-[5%] size-[420px] bg-accent-pink/70 blur-[110px] rounded-full -z-10"></div>
        <div className="absolute top-[1400px] right-[8%] size-[460px] bg-accent-purple/50 blur-[115px] rounded-full -z-10"></div>
        <div className="absolute top-[2000px] left-[12%] size-[380px] bg-accent-pink/70 blur-[105px] rounded-full -z-10"></div>
        <div className="absolute top-[2600px] right-[15%] size-[450px] bg-accent-purple/50 blur-[110px] rounded-full -z-10"></div>
      </div>

      <Header />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 md:py-16 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32 overflow-hidden">
        
        {/* Hero Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-16 relative min-h-[85vh] md:min-h-[75vh] max-[480px]:min-h-[auto] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-6 md:space-y-8 max-[480px]:space-y-5 relative z-10">
              <Breadcrumbs items={[
                { label: "Главная", href: "/" },
                { label: "Услуги", href: "/services" },
                { label: "Ламинирование ресниц" }
              ]} />
              
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full gradient-animated text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">
                <span className="material-symbols-outlined text-xs md:text-sm">visibility</span>
                Ламинирование ресниц
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                Роскошные <span className="text-gradient">ресницы</span> без наращивания
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-600 leading-relaxed max-w-lg">
                Профессиональное ламинирование ресниц в Сыктывкаре. Подкручивание, укрепление и окрашивание натуральных ресниц. Эффект на 6-8 недель.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                <Link href="/booking" className="gradient-animated px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на ламинирование
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <a href="#portfolio" className="glass px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/80 transition-all text-center">
                  Портфолио
                </a>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] md:h-[500px] h-[350px] max-[480px]:h-[300px]">
              <div className="absolute inset-0 grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-3 md:space-y-4 floating">
                  <div className="bento-card h-32 md:h-40 lg:h-48 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo1.png" alt="Ламинирование ресниц" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo3.png" alt="Результат ламинирования" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 pt-8 md:pt-12 floating-undi">
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo4.png" alt="Красивые ресницы" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-32 md:h-40 lg:h-48 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo2.png" alt="Кабинет мастера" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-10 -right-10 size-48 md:size-64 bg-accent-pink/20 blur-[80px] md:blur-[100px] rounded-full"></div>
              <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 md:size-64 bg-accent-purple/20 blur-[80px] md:blur-[100px] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Technique Info Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="techniques">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-12 lg:p-16 max-[480px]:p-6">
            <div className="absolute top-0 right-0 size-64 md:size-96 bg-accent-purple/40 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 size-64 md:size-96 bg-accent-pink/70 blur-[80px] md:blur-[120px] rounded-full"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs md:text-sm">brush</span>
                  Наша процедура
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Ламинирование ресниц</h2>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Комплексная процедура подкручивания, укрепления и окрашивания натуральных ресниц. Создает эффект открытого взгляда и визуально увеличивает длину ресниц.
                </p>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">schedule</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Длительность</p>
                    <p className="text-lg md:text-xl font-black">1-1.5 часа</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">spa</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Комфорт</p>
                    <p className="text-lg md:text-xl font-black">Безболезненно</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">event</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Эффект</p>
                    <p className="text-lg md:text-xl font-black text-primary">6-8 недель</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">payments</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Стоимость</p>
                    <p className="text-lg md:text-xl font-black">от 1200₽</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-xl md:text-2xl font-black mb-4">Что входит в процедуру</h3>
                  {[
                    { icon: "chat", text: "Консультация и подбор изгиба" },
                    { icon: "cleaning_services", text: "Очищение и обезжиривание" },
                    { icon: "auto_fix_high", text: "Подкручивание на бигуди" },
                    { icon: "shield", text: "Нанесение укрепляющих составов" },
                    { icon: "brush", text: "Окрашивание в желаемый цвет" },
                    { icon: "spa", text: "Питание и увлажнение" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <p className="text-sm md:text-base font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-12 lg:p-16 max-[480px]:p-6">
            <div className="absolute top-0 right-0 size-64 md:size-96 bg-accent-purple/40 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 size-64 md:size-96 bg-accent-pink/70 blur-[80px] md:blur-[120px] rounded-full"></div>
            
            <div className="relative text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs md:text-sm">timeline</span>
                Как проходит процедура
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Этапы ламинирования ресниц</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Подробный процесс от консультации до финального результата</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Консультация",
                  description: "Обсуждаем желаемый изгиб, подбираем оптимальный размер бигуди",
                  icon: "chat",
                  duration: "5-10 мин"
                },
                {
                  step: "02", 
                  title: "Подготовка",
                  description: "Очищаем и обезжириваем ресницы, фиксируем на бигуди",
                  icon: "cleaning_services",
                  duration: "10-15 мин"
                },
                {
                  step: "03",
                  title: "Ламинирование",
                  description: "Наносим составы для подкручивания и укрепления ресниц",
                  icon: "auto_fix_high",
                  duration: "30-40 мин"
                },
                {
                  step: "04",
                  title: "Окрашивание и уход",
                  description: "Окрашиваем ресницы, наносим питательные масла",
                  icon: "brush",
                  duration: "15-20 мин"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 text-center group hover:bg-white/80 transition-all">
                    <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl gradient-animated text-white flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">{item.icon}</span>
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Этап {item.step}</div>
                    <h3 className="text-lg md:text-xl font-black mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{item.description}</p>
                    <div className="text-xs text-slate-500 font-semibold">{item.duration}</div>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <span className="material-symbols-outlined text-primary text-2xl">arrow_forward</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section id="portfolio" className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">photo_library</span>
              Наши работы
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Портфолио</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Примеры наших работ по ламинированию ресниц</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioPhotos.map((photo, index) => (
              <div key={index} className="service-card-glass rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={photo.image} 
                    alt={photo.title} 
                    width={400} 
                    height={400} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg text-white mb-1">{photo.title}</h3>
                    <p className="text-sm text-white/90">{photo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advantages Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-10 -left-10 size-32 md:size-40 gradient-bg rounded-full opacity-20 blur-3xl"></div>
              <Image
                alt="Мастер за работой в Кабинет 310"
                className="rounded-2xl md:rounded-[2.5rem] relative z-10 w-full object-cover aspect-[4/5]"
                src="/photo5.png"
                width={600}
                height={750}
              />
            </div>
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs md:text-sm">star</span>
                Наши преимущества
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Почему выбирают нас для ламинирования</h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Мы используем только профессиональные составы и создаем естественный красивый изгиб, который подчеркивает вашу природную красоту.
              </p>
              <div className="space-y-5 md:space-y-6">
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Премиальные составы</h3>
                    <p className="text-sm md:text-base text-slate-600">Работаем с профессиональными брендами: LVL Lashes, Thuya, Dolly's Lash</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">eco</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Безопасные компоненты</h3>
                    <p className="text-sm md:text-base text-slate-600">Составы с кератином и витаминами, без вредных веществ</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">workspace_premium</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Опытные мастера</h3>
                    <p className="text-sm md:text-base text-slate-600">Сертифицированные специалисты с большим опытом работы</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">spa</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Комфортная процедура</h3>
                    <p className="text-sm md:text-base text-slate-600">Безболезненно, можно расслабиться и отдохнуть</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">help</span>
              Вопросы и ответы
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Частые вопросы о ламинировании</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Ответы на самые популярные вопросы о процедуре</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {faqItems.map((item, index) => (
              <details key={index} className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                    </span>
                    <h3 className="font-bold text-base sm:text-lg">{item.question}</h3>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 lg:p-16 max-[480px]:p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-transparent to-accent-pink/20"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs md:text-sm">event_available</span>
                Запись открыта
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Готовы к роскошным ресницам?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/booking" className="gradient-animated px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на ламинирование
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/contacts" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                  Задать вопрос
                </Link>
              </div>
              <div className="flex items-center justify-center gap-8 pt-6 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">от 1200₽</p>
                  <p className="text-sm">Стоимость процедуры</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">1-1.5 часа</p>
                  <p className="text-sm">Длительность</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">6-8 недель</p>
                  <p className="text-sm">Держится эффект</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
