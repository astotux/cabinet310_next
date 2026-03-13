import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Услуги студии красоты",
  description: "Полный спектр услуг студии красоты Кабинет 310 в Сыктывкаре: перманентный макияж бровей, губ, межреснички, маникюр, ламинирование ресниц. Профессиональные мастера, современное оборудование.",
  keywords: [
    "салон красоты сыктывкар",
    "услуги красоты сыктывкар",
    "перманентный макияж цены",
    "маникюр цены сыктывкар",
    "ламинирование ресниц цена"
  ],
  openGraph: {
    title: "Услуги студии красоты — Кабинет 310 в Сыктывкаре",
    description: "Профессиональные услуги красоты: перманентный макияж, маникюр, ламинирование ресниц. Опытные мастера, стерильность, гарантия качества.",
    images: ['/og-services.jpg'],
  },
  alternates: {
    canonical: 'https://cabinet310.ru/services',
  },
};

export default function ServicesPage() {
  const services = [
    {
      name: "Ламинирование ресниц",
      description: "Подкручивание и укрепление натуральных ресниц. Эффект на 6-8 недель.",
      icon: "visibility",
      gradient: "from-accent-purple to-accent-pink",
      price: "от 1200₽",
      duration: "1-1.5 часа",
      link: "/services/lash-lamination",
      image: "/photo2.png",
      features: ["Ламинирование", "Ботокс ресниц", "Окрашивание"]
    },
    {
      name: "Маникюр",
      description: "Комплексный маникюр с покрытием гель-лак. Аппаратная обработка кутикулы и укрепление гелем.",
      icon: "back_hand",
      gradient: "from-primary to-accent-pink",
      price: "от 1500₽",
      duration: "1-1.5 часа",
      link: "/services/manicure",
      image: "/photo5.png",
      features: ["Аппаратная обработка", "Укрепление гелем", "Гель-лак"]
    },
    {
      name: "Перманентный макияж бровей",
      description: "Пудровые брови. Надежно, надолго. Естественная красота на 1-2 года.",
      icon: "face_3",
      gradient: "from-accent-pink to-accent-purple",
      price: "от 4000₽",
      duration: "1-2 часа",
      link: "/services/permanent-brows",
      image: "/photo1.png",
      features: ["Пудровые брови"]
    },
    {
      name: "Перманентный макияж губ",
      description: "Акварельные губы с естественным оттенком. Коррекция формы и цвета.",
      icon: "face_3",
      gradient: "from-accent-pink to-accent-purple",
      price: "от 4000₽",
      duration: "1-2 часа",
      link: "/services/permanent-lips",
      image: "/photo3.png",
      features: ["Акварельные губы"]
    },
    {
      name: "Перманентный макияж межреснички",
      description: "Подчеркивание линии роста ресниц. Выразительный взгляд без макияжа.",
      icon: "visibility",
      gradient: "from-accent-purple to-primary",
      price: "от 3500₽",
      duration: "0.5-1.5 часа",
      link: "/services/eyeliner",
      image: "/photo4.png",
      features: ["Верхнее веко"]
    }
  ];

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[200px] right-[10%] size-[500px] bg-accent-purple/50 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-[800px] left-[5%] size-[420px] bg-accent-pink/70 blur-[110px] rounded-full -z-10"></div>
        <div className="absolute top-[1400px] right-[8%] size-[460px] bg-accent-purple/50 blur-[115px] rounded-full -z-10"></div>
        <div className="absolute top-[2000px] left-[12%] size-[380px] bg-accent-pink/70 blur-[105px] rounded-full -z-10"></div>
        
        {/* Декоративные линии */}
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[100px] left-[-10%] w-[600px] md:w-[800px] opacity-30 -z-20 max-md:w-[400px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[600px] right-[-15%] w-[700px] md:w-[900px] opacity-25 -z-20 rotate-180 max-md:w-[450px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[1200px] left-[-5%] w-[550px] md:w-[750px] opacity-20 -z-20 max-md:w-[350px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[2000px] right-[-10%] w-[650px] md:w-[850px] opacity-30 -z-20 rotate-180 max-md:w-[400px]" />
        <Image src="/line.png" alt="" width={800} height={400} className="absolute top-[2800px] left-[-8%] w-[600px] md:w-[800px] opacity-25 -z-20 max-md:w-[380px]" />
        
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
      </div>

      <Header />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 md:py-16 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32 overflow-hidden">
        
        {/* Hero Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-16 relative min-h-[60vh] flex items-center">
          <div className="w-full text-center space-y-6 md:space-y-8 max-[480px]:space-y-5">
            
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full gradient-animated text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">
              <span className="material-symbols-outlined text-xs md:text-sm">spa</span>
              Наши услуги
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              Полный спектр <span className="text-gradient">услуг красоты</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-600 leading-relaxed max-w-3xl mx-auto">
              От перманентного макияжа до маникюра — все для вашей красоты в одном месте.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4 justify-center">
              <Link href="/booking" className="gradient-animated px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-transform">
                Записаться сейчас
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <a href="https://vk.com/cabinet_310" className="glass px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/80 transition-all text-center">
                Задать вопрос в ВК
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">spa</span>
              Все услуги
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">Что мы предлагаем</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Выберите услугу и запишитесь онлайн</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Link key={index} href={service.link} className="service-card-3d p-6 md:p-8 max-[480px]:p-5 rounded-2xl md:rounded-[2rem] group cursor-pointer">
                <div className="flex gap-4 md:gap-6 mb-5">
                  <div className={`size-14 md:size-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl md:text-3xl">{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-black mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
                  <div className="flex items-center gap-4 max-[320px]:gap-1">
                    <div className="flex items-center gap-1 text-xs  text-slate-500">
                      <span className="material-symbols-outlined text-sm max-[480px]:text-xs">schedule</span>
                      {service.duration}
                    </div>
                    <div className="text-lg md:text-xl max-[480px]:text-sm font-black text-primary">{service.price}</div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base group-hover:gap-4 transition-all">
                    Подробнее
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>
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
                Кабинет 310
              </h2>
              <p className="text-slate-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Территория, где искусство встречается с красотой. Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц в Сыктывкаре.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/booking" className="gradient-animated px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-transform max-[480px]:text-base">
                  Записаться
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <a href="https://vk.com/cabinet_310" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg hover:bg-white/20 transition-all max-[480px]:text-base">
                  Задать вопрос в ВК
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}