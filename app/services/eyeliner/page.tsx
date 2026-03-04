import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import structuredData from "./structured-data.json";

export const metadata: Metadata = {
  title: "Перманентный макияж межресничка в Сыктывкаре — Кабинет 310 | От 3500₽",
  description: "Межресничка в Сыктывкаре | Перманентный макияж глаз | Стрелки | Цена от 3500₽ | Результат 1-2 года | Стерильность 100% | Запись онлайн в Кабинет 310. Выразительный взгляд!",
  keywords: [
    "перманентный макияж межресничка сыктывкар",
    "татуаж межресничка сыктывкар",
    "перманент межресничка сыктывкар",
    "межресничка цена сыктывкар",
    "кабинет 310 межресничка"
  ],
  openGraph: {
    title: "Перманентный макияж межресничка — Кабинет 310 в Сыктывкаре",
    description: "Выразительный взгляд без макияжа. Межресничка, стрелки. Записывайтесь к лучшим мастерам Сыктывкара.",
    images: ['/og-image.jpg'],
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cabinet310.ru/services/eyeliner',
    siteName: 'Кабинет 310',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Перманентный макияж межресничка — Кабинет 310 в Сыктывкаре',
    description: 'Выразительный взгляд без макияжа. Межресничка, стрелки.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/services/eyeliner',
  },
  other: {
    'yandex-verification': 'your-yandex-verification-code',
    'google-site-verification': 'your-google-verification-code',
  },
};

export default function EyelinerPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Больно ли делать перманентный макияж межресничка?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Веки — чувствительная зона, но мы используем качественную анестезию. Процедура проходит комфортно, большинство клиентов отмечают терпимые ощущения."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько держится перманентный макияж межресничка?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "В зависимости от индивидуальных особенностей кожи — от 1 до 2 лет. Жирная кожа век требует более частого обновления."
        }
      },
      {
        "@type": "Question",
        "name": "Можно ли носить контактные линзы после процедуры?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Рекомендуется воздержаться от ношения линз в течение 3-5 дней после процедуры. Затем можно вернуться к обычному режиму."
        }
      },
      {
        "@type": "Question",
        "name": "Какие противопоказания к процедуре?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Беременность, лактация, конъюнктивит, воспалительные заболевания глаз, прием антикоагулянтов. Подробную консультацию проводит мастер."
        }
      }
    ]
  };

  const portfolioPhotos = [
    { image: "/photo1.png", title: "Естественная межресничка", description: "Деликатное подчеркивание" },
    { image: "/photo2.png", title: "Выразительный взгляд", description: "Идеальная линия" },
    { image: "/photo3.png", title: "Классическая стрелка", description: "Элегантность и стиль" },
    { image: "/photo4.png", title: "Тонкая работа", description: "Профессиональное исполнение" },
    { image: "/photo5.png", title: "Стойкий результат", description: "Красота на годы" },
    { image: "/photo6.png", title: "Индивидуальный подход", description: "Учет особенностей глаз" }
  ];

  const faqItems = [
    {
      question: "Больно ли делать перманентный макияж межресничка?",
      answer: "Веки — чувствительная зона, но мы используем качественную анестезию. Процедура проходит комфортно, большинство клиентов отмечают терпимые ощущения.",
      icon: "healing"
    },
    {
      question: "Сколько держится перманентный макияж межресничка?",
      answer: "В зависимости от индивидуальных особенностей кожи — от 1 до 2 лет. Жирная кожа век требует более частого обновления.",
      icon: "schedule"
    },
    {
      question: "Можно ли носить контактные линзы после процедуры?",
      answer: "Рекомендуется воздержаться от ношения линз в течение 3-5 дней после процедуры. Затем можно вернуться к обычному режиму.",
      icon: "visibility"
    },
    {
      question: "Какие противопоказания к процедуре?",
      answer: "Беременность, лактация, конъюнктивит, воспалительные заболевания глаз, прием антикоагулянтов. Подробную консультацию проводит мастер.",
      icon: "warning"
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[200px] right-[10%] size-[500px] bg-accent-purple/50 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-[800px] left-[5%] size-[420px] bg-accent-pink/70 blur-[110px] rounded-full -z-10"></div>
        <div className="absolute top-[1400px] right-[8%] size-[460px] bg-accent-purple/50 blur-[115px] rounded-full -z-10"></div>
        <div className="absolute top-[2000px] left-[12%] size-[380px] bg-accent-pink/70 blur-[105px] rounded-full -z-10"></div>
        <div className="absolute top-[2600px] right-[15%] size-[450px] bg-accent-purple/50 blur-[110px] rounded-full -z-10"></div>
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

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 md:py-16 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32 overflow-hidden">

        {/* Hero Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-16 relative min-h-[85vh] md:min-h-[75vh] max-[480px]:min-h-[auto] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-6 md:space-y-8 max-[480px]:space-y-5 relative z-10">
              <Breadcrumbs items={[
                { label: "Главная", href: "/" },
                { label: "Услуги", href: "/services" },
                { label: "Перманентный макияж межресничка" }
              ]} />

              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full gradient-animated text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">
                <span className="material-symbols-outlined text-xs md:text-sm">visibility</span>
                Перманентный макияж
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                Выразительный <span className="text-gradient">взгляд</span> на годы
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-600 leading-relaxed max-w-lg">
                Профессиональный перманентный макияж межресничка в Сыктывкаре. Естественное подчеркивание линии роста ресниц от опытных мастеров.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                <Link href="/booking" className="gradient-animated px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на межресничку
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
                    <Image src="/photo1.png" alt="Межресничка" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo3.png" alt="Перманентная стрелка" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 pt-8 md:pt-12 floating-undi">
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo4.png" alt="Результат межреснички" width={400} height={500} className="w-full h-full object-cover" />
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
                  Наша техника
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Межресничка</h2>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Деликатное заполнение пространства между ресницами. Создает эффект густых ресниц и выразительного взгляда без явного макияжа.
                </p>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">schedule</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Длительность</p>
                    <p className="text-lg md:text-xl font-black">0.5-1.5 часа</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">healing</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Заживление</p>
                    <p className="text-lg md:text-xl font-black">5-7 дней</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">event</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Результат</p>
                    <p className="text-lg md:text-xl font-black text-primary">1-2 года</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">payments</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Стоимость</p>
                    <p className="text-lg md:text-xl font-black">от 3500₽</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-xl md:text-2xl font-black mb-4">Что входит в процедуру</h3>
                  {[
                    { icon: "chat", text: "Консультация и подбор техники" },
                    { icon: "draw", text: "Согласование линии и интенсивности" },
                    { icon: "healing", text: "Анестезия для комфорта" },
                    { icon: "brush", text: "Выполнение перманентного макияжа" },
                    { icon: "support_agent", text: "Консультации по уходу" }
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Этапы создания выразительного взгляда</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Подробный процесс от консультации до финального результата</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Консультация",
                  description: "Обсуждаем желаемый результат, выбираем технику и интенсивность",
                  icon: "chat",
                  duration: "10-15 мин"
                },
                {
                  step: "02",
                  title: "Согласование",
                  description: "Определяем линию и толщину, учитываем форму глаз",
                  icon: "draw",
                  duration: "10-15 мин"
                },
                {
                  step: "03",
                  title: "Анестезия",
                  description: "Наносим обезболивающий крем для максимального комфорта",
                  icon: "healing",
                  duration: "15-20 мин"
                },
                {
                  step: "04",
                  title: "Выполнение процедуры",
                  description: "Создаем перманентный макияж с соблюдением всех норм стерильности",
                  icon: "brush",
                  duration: "30-60 мин"
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
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Примеры наших работ по перманентному макияжу межресничка</p>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Почему выбирают нас для межреснички</h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Мы создаем естественный выразительный взгляд, который подчеркивает вашу красоту и экономит время на макияж.
              </p>
              <div className="space-y-5 md:space-y-6">
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Сертифицированные пигменты</h3>
                    <p className="text-sm md:text-base text-slate-600">Используем только премиальные пигменты, безопасные для чувствительной зоны глаз</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">visibility</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Деликатная работа</h3>
                    <p className="text-sm md:text-base text-slate-600">Тонкая работа с учетом формы глаз и естественной линии роста ресниц</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">health_and_safety</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Полная стерильность</h3>
                    <p className="text-sm md:text-base text-slate-600">Одноразовые инструменты, многоступенчатая стерилизация, соблюдение всех санитарных норм</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">support_agent</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Поддержка после процедуры</h3>
                    <p className="text-sm md:text-base text-slate-600">Консультируем по уходу, отвечаем на вопросы</p>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Частые вопросы о межресничке</h2>
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
                Готовы к выразительному взгляду?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/booking" className="gradient-animated px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на межресничку
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/contacts" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                  Задать вопрос
                </Link>
              </div>
              <div className="flex items-center justify-center max-[480px]:flex-col gap-8 pt-6 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">от 3500₽</p>
                  <p className="text-sm">Стоимость процедуры</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">5-7 дней</p>
                  <p className="text-sm">Заживление</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">1-2 года</p>
                  <p className="text-sm">Держится результат</p>
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