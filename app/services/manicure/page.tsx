import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import structuredData from "./structured-data.json";

export const metadata: Metadata = {
  title: "Маникюр в Сыктывкаре — Кабинет 310 | Гель-лак + укрепление от 1500₽",
  description: "Маникюр в Сыктывкаре | Аппаратная обработка | Укрепление гелем | Гель-лак | Цена от 1500₽ | Стерильность 100% | Запись онлайн в Кабинет 310. Держится 2-3 недели!",
  keywords: [
    "маникюр сыктывкар",
    "ногти сыктывкар",
    "аппаратный маникюр сыктывкар",
    "укрепление ногтей",
    "гель-лак сыктывкар",
    "кабинет 310 маникюр",
    "маникюр цена сыктывкар"
  ],
  openGraph: {
    title: "Маникюр — Кабинет 310 в Сыктывкаре",
    description: "Профессиональный комплексный маникюр с покрытием гель-лак. Аппаратная обработка кутикулы и укрепление гелем. Записывайтесь к лучшим мастерам Сыктывкара.",
    images: ['/og-image.jpg'],
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cabinet310.ru/services/manicure',
    siteName: 'Кабинет 310',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Маникюр — Кабинет 310 в Сыктывкаре',
    description: 'Профессиональный комплексный маникюр с покрытием гель-лак. Аппаратная обработка кутикулы и укрепление гелем.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/services/manicure',
  },
  other: {
    'yandex-verification': 'your-yandex-verification-code',
    'google-site-verification': 'your-google-verification-code',
  },
};

export default function ManicurePage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Как долго держится гель-лак?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "При правильном уходе гель-лак держится 2-3 недели. Срок носки зависит от скорости роста ногтей и соблюдения рекомендаций мастера."
        }
      },
      {
        "@type": "Question",
        "name": "Что такое укрепление ногтей гелем?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Укрепление гелем — это нанесение тонкого слоя геля на натуральные ногти для их защиты и предотвращения ломкости. Это безопасная процедура, которая помогает отрастить здоровые ногти."
        }
      },
      {
        "@type": "Question",
        "name": "Можно ли делать маникюр при грибке?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Нет, при грибковых заболеваниях необходимо сначала пройти лечение. Мы работаем только со здоровыми ногтями."
        }
      },
      {
        "@type": "Question",
        "name": "Как часто нужно обновлять маникюр?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Рекомендуется обновлять маникюр каждые 2-3 недели, когда гель-лак начинает отрастать. Это поддерживает ухоженный вид и здоровье ногтей."
        }
      }
    ]
  };

  const portfolioPhotos = [
    { image: "/photo1.png", title: "Классический дизайн", description: "Элегантность и стиль" },
    { image: "/photo2.png", title: "Френч", description: "Вечная классика" },
    { image: "/photo3.png", title: "Яркий дизайн", description: "Смелые решения" },
    { image: "/photo4.png", title: "Минимализм", description: "Сдержанная красота" },
    { image: "/photo5.png", title: "Укрепление гелем", description: "Здоровые ногти" },
    { image: "/photo6.png", title: "Нюдовый маникюр", description: "Естественная красота" }
  ];

  const services = [
    {
      name: "Комплексный маникюр",
      description: "Полный уход за руками и ногтями с покрытием гель-лак",
      price: "от 1500₽",
      duration: "1.5 часа",
      icon: "back_hand"
    }
  ];

  const faqItems = [
    {
      question: "Как долго держится гель-лак?",
      answer: "При правильном уходе гель-лак держится 2-3 недели. Срок носки зависит от скорости роста ногтей и соблюдения рекомендаций мастера.",
      icon: "schedule"
    },
    {
      question: "Что такое укрепление ногтей гелем?",
      answer: "Укрепление гелем — это нанесение тонкого слоя геля на натуральные ногти для их защиты и предотвращения ломкости. Это безопасная процедура, которая помогает отрастить здоровые ногти.",
      icon: "health_and_safety"
    },
    {
      question: "Можно ли делать маникюр при грибке?",
      answer: "Нет, при грибковых заболеваниях необходимо сначала пройти лечение. Мы работаем только со здоровыми ногтями.",
      icon: "warning"
    },
    {
      question: "Как часто нужно обновлять маникюр?",
      answer: "Рекомендуется обновлять маникюр каждые 2-3 недели, когда гель-лак начинает отрастать. Это поддерживает ухоженный вид и здоровье ногтей.",
      icon: "tune"
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
                { label: "Маникюр" }
              ]} />
              
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full gradient-animated text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">
                <span className="material-symbols-outlined text-xs md:text-sm">back_hand</span>
                Маникюр
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                Безупречные <span className="text-gradient">руки</span> каждый день
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-600 leading-relaxed max-w-lg">
                Профессиональный комплексный маникюр в Сыктывкаре. Аппаратная обработка кутикулы, укрепление ногтей гелем и покрытие гель-лак. Качественные материалы и опытные мастера.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                <Link href="/booking" className="gradient-animated px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на маникюр
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
                    <Image src="/photo1.png" alt="Маникюр" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo3.png" alt="Дизайн ногтей" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 pt-8 md:pt-12 floating-undi">
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo4.png" alt="Результат маникюра" width={400} height={500} className="w-full h-full object-cover" />
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

        {/* Service Info Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="service">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-12 lg:p-16 max-[480px]:p-6">
            <div className="absolute top-0 right-0 size-64 md:size-96 bg-accent-purple/40 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 size-64 md:size-96 bg-accent-pink/70 blur-[80px] md:blur-[120px] rounded-full"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs md:text-sm">back_hand</span>
                  Наша услуга
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Комплексный маникюр</h2>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Полный уход за руками и ногтями. Включает аппаратную обработку кутикулы, укрепление ногтей гелем и покрытие гель-лаком.
                </p>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">schedule</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Длительность</p>
                    <p className="text-lg md:text-xl font-black">1.5 часа</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <div className="size-10 md:size-12 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">event</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Носка</p>
                    <p className="text-lg md:text-xl font-black">2-3 недели</p>
                  </div>
                  <div className="glass rounded-2xl p-4 md:p-6 col-span-2">
                    <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl md:text-2xl">payments</span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 max-[320px]:text-[9px]">Стоимость</p>
                    <p className="text-lg md:text-xl font-black">от 1500₽</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-xl md:text-2xl font-black mb-4">Что входит в услугу</h3>
                  {[
                    { icon: "settings", text: "Аппаратная обработка кутикулы" },
                    { icon: "content_cut", text: "Коррекция формы ногтей" },
                    { icon: "shield", text: "Укрепление ногтей гелем" },
                    { icon: "brush", text: "Покрытие гель-лаком" },
                    { icon: "palette", text: "Дизайн по желанию" }
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

        {/* What's Included Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-12 lg:p-16 max-[480px]:p-6">
            <div className="absolute top-0 right-0 size-64 md:size-96 bg-accent-purple/40 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 size-64 md:size-96 bg-accent-pink/70 blur-[80px] md:blur-[120px] rounded-full"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs md:text-sm">checklist</span>
                  Что входит
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Комплексный уход за руками</h2>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Каждая процедура маникюра включает полный комплекс услуг для здоровья и красоты ваших ногтей.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: "cleaning_services", title: "Обработка кутикулы", desc: "Аккуратное удаление или отодвигание" },
                    { icon: "content_cut", title: "Коррекция формы", desc: "Придание желаемой формы ногтям" },
                    { icon: "spa", title: "Полировка", desc: "Выравнивание ногтевой пластины" },
                    { icon: "brush", title: "Покрытие гель-лак", desc: "Стойкое покрытие на 2-3 недели" },
                    { icon: "palette", title: "Дизайн", desc: "По желанию: френч, рисунки, декор" },
                    { icon: "self_improvement", title: "Уход за кожей рук", desc: "Увлажнение и массаж" }
                  ].map((item, idx) => (
                    <div key={idx} className="glass rounded-2xl p-4 md:p-5 flex items-start gap-4 group hover:bg-white/80 transition-all">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-black text-base mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6">
                  <h3 className="text-xl md:text-2xl font-black mb-4">Используемые материалы</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">verified</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">Премиальные гель-лаки</p>
                        <p className="text-sm text-slate-600">CND, OPI, Luxio — стойкость и безопасность</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">health_and_safety</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">Стерильные инструменты</p>
                        <p className="text-sm text-slate-600">Многоступенчатая обработка и стерилизация</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">eco</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">Безопасные составы</p>
                        <p className="text-sm text-slate-600">Без вредных компонентов, гипоаллергенные</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200/70">
                    <Link href="/booking" className="w-full gradient-animated px-6 py-4 rounded-xl text-white font-bold text-center flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform">
                      Записаться на маникюр
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
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
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Примеры наших работ по маникюру и дизайну ногтей</p>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Почему выбирают нас для маникюра</h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Мы создаем не просто красивый маникюр, а заботимся о здоровье ваших ногтей и кожи рук.
              </p>
              <div className="space-y-5 md:space-y-6">
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Премиальные материалы</h3>
                    <p className="text-sm md:text-base text-slate-600">Работаем только с люксовыми брендами гель-лаков: CND, OPI, Luxio</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">health_and_safety</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Стерильность 100%</h3>
                    <p className="text-sm md:text-base text-slate-600">Многоступенчатая стерилизация инструментов, одноразовые пилки и бафы</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">workspace_premium</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Опытные мастера</h3>
                    <p className="text-sm md:text-base text-slate-600">Наши мастера постоянно повышают квалификацию и следят за трендами</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start group">
                  <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl md:text-2xl">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg mb-1 md:mb-2">Удобное время</h3>
                    <p className="text-sm md:text-base text-slate-600">Работаем ежедневно, удобная онлайн-запись</p>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Частые вопросы о маникюре</h2>
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
                Готовы к идеальному маникюру?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/booking" className="gradient-animated px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться на маникюр
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/contacts" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                  Задать вопрос
                </Link>
              </div>
              <div className="flex items-center justify-center max-[480px]:flex-col gap-8 pt-6 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">от 1500₽</p>
                  <p className="text-sm">Стоимость</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">1.5-2 часа</p>
                  <p className="text-sm">Длительность</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">2-3 недели</p>
                  <p className="text-sm">Держится покрытие</p>
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