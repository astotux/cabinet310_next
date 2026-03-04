import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
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
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 md:py-16 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32 overflow-hidden">
        {/* Hero Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-16 relative min-h-[85vh] md:min-h-[75vh] max-[480px]:min-h-[auto] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-6 md:space-y-8 max-[480px]:space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full gradient-animated text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">
                <span className="material-symbols-outlined text-xs md:text-sm">auto_awesome</span>
                <span className="hidden sm:inline">Студия красоты</span>
                <span className="sm:hidden">Студия красоты</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight  ">
                Кабинет <span className="text-gradient">310</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-600   leading-relaxed max-w-lg">
                Территория, где искусство встречается с красотой. Перманентный макияж бровей, губ и межреснички, маникюр, ламинирование ресниц в Сыктывкаре.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                <Link href="/booking" className="gradient-animated px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-transform">
                  Записаться сейчас
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <a href="#portfolio" className="glass px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/80 transition-all text-center">
                  Наши работы
                </a>
              </div>
              <div className="glass px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl flex justify-center gap-6 md:gap-8 pt-4 md:pt-6">
                <div>
                  <p className="text-3xl md:text-4xl font-black text-gradient">500+</p>
                  <p className="text-xs md:text-sm text-slate-500  ">Довольных клиентов</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-black text-gradient">5+</p>
                  <p className="text-xs md:text-sm text-slate-500  ">Лет опыта</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-black text-gradient">100%</p>
                  <p className="text-xs md:text-sm text-slate-500  ">Стерильность</p>
                </div>
              </div>
            </div>
            <div className="relative lg:h-[600px] md:h-[500px] h-[350px] max-[480px]:h-[300px]">
              <div className="absolute inset-0 grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-3 md:space-y-4 floating">
                  <div className="bento-card h-32 md:h-40 lg:h-48 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo1.png" alt="Перманент" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo3.png" alt="Маникюр" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 pt-8 md:pt-12 floating-undi">
                  <div className="bento-card h-44 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo4.png" alt="Ресницы" width={400} height={500} className="w-full h-full object-cover" />
                  </div>
                  <div className="bento-card h-32 md:h-40 lg:h-48 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="/photo2.png" alt="Интерьер" width={400} height={300} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-10 -right-10 size-48 md:size-64 bg-accent-pink/20 blur-[80px] md:blur-[100px] rounded-full"></div>
              <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 md:size-64 bg-accent-purple/20 blur-[80px] md:blur-[100px] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="about">
          <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-12 lg:p-16 max-[480px]:p-6">
            <div className="absolute top-0 right-0 size-64 md:size-96 bg-accent-purple/40 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 size-64 md:size-96 bg-accent-pink/70 blur-[80px] md:blur-[120px] rounded-full"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4 md:space-y-6">
                    <div className="bento-card aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                      <Image src="/photo6.png" alt="Работа мастера" width={400} height={400} className="w-full h-full object-cover" />
                    </div>
                    <div className="bento-card aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                      <Image src="/photo5.png" alt="Маникюр" width={400} height={300} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                    <div className="bento-card aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                      <Image src="/photo8.png" alt="Ресницы" width={400} height={300} className="w-full h-full object-cover" />
                    </div>
                    <div className="bento-card aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                      <Image src="/photo7.png" alt="Интерьер" width={400} height={400} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs md:text-sm">workspace_premium</span>
                  О нас
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight  ">
                  Философия <span className="text-gradient">Кабинет 310</span>
                </h3>
                <p className="text-lg md:text-xl text-slate-600   leading-relaxed">
                  Мы создали пространство, где архитектура лица и эстетика рук возведены в ранг искусства.
                </p>
                <p className="text-sm md:text-base text-slate-600   leading-relaxed">
                  Каждая процедура — это сочетание передовых техник, премиальных материалов и индивидуального подхода. Мы работаем только с сертифицированными пигментами и материалами класса люкс, обеспечивая стерильность и долговечный результат.
                </p>
                <div className="grid grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6">
                  <div className="text-center">
                    <div className="size-12 md:size-16 mx-auto mb-2 md:mb-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-xl">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">health_and_safety</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold  ">100% стерильно</p>
                  </div>
                  <div className="text-center">
                    <div className="size-12 md:size-16 mx-auto mb-2 md:mb-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-white shadow-xl">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">verified</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold  ">Premium качество</p>
                  </div>
                  <div className="text-center">
                    <div className="size-12 md:size-16 mx-auto mb-2 md:mb-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white shadow-xl">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">emoji_events</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold  ">5+ лет опыта</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="services">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">spa</span>
              Наши услуги
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black  ">Что мы предлагаем</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Выберите направление и откройте для себя новый уровень красоты</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Link href="/booking" className="service-card-3d p-8 md:p-10 max-[480px]:p-6 rounded-2xl md:rounded-[2rem] group cursor-pointer">
              <div className="size-14 md:size-16 rounded-xl md:rounded-2xl gradient-animated text-white flex items-center justify-center mb-5 md:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl">face_3</span>
              </div>
              <h4 className="text-xl md:text-2xl font-black mb-3 md:mb-4   group-hover:text-primary transition-colors">Перманентный макияж</h4>
              <p className="text-sm md:text-base text-slate-600   mb-5 md:mb-6 leading-relaxed">Пудровые брови, акварельные губы, межресничка в Сыктывкаре. Естественная красота на годы.</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base group-hover:gap-4 transition-all">
                Записаться
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            <Link href="/booking" className="service-card-3d p-8 md:p-10 max-[480px]:p-6 rounded-2xl md:rounded-[2rem] group cursor-pointer">
              <div className="size-14 md:size-16 rounded-xl md:rounded-2xl gradient-animated text-white flex items-center justify-center mb-5 md:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl">back_hand</span>
              </div>
              <h4 className="text-xl md:text-2xl font-black mb-3 md:mb-4   group-hover:text-primary transition-colors">Маникюр</h4>
              <p className="text-sm md:text-base text-slate-600   mb-5 md:mb-6 leading-relaxed">Укрепление, наращивание, дизайн. Безупречные руки — ваша визитная карточка.</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base group-hover:gap-4 transition-all">
                Записаться
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            <Link href="/booking" className="service-card-3d p-8 md:p-10 max-[480px]:p-6 rounded-2xl md:rounded-[2rem] group cursor-pointer md:col-span-2 lg:col-span-1">
              <div className="size-14 md:size-16 rounded-xl md:rounded-2xl gradient-animated text-white flex items-center justify-center mb-5 md:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl">visibility</span>
              </div>
              <h4 className="text-xl md:text-2xl font-black mb-3 md:mb-4   group-hover:text-primary transition-colors">Ламинирование ресниц</h4>
              <p className="text-sm md:text-base text-slate-600   mb-5 md:mb-6 leading-relaxed">Ламинирование и оформление ресниц в Сыктывкаре. Выразительный взгляд без макияжа.</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base group-hover:gap-4 transition-all">
                Записаться
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="portfolio">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">photo_library</span>
              Портфолио
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black  ">Наши работы</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Результаты, которыми мы гордимся</p>
          </div>
          <PortfolioCarousel />
        </section>

        {/* Why Us Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="why-us">
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-10 -left-10 size-32 md:size-40 gradient-bg rounded-full opacity-20 blur-3xl"></div>
                <Image
                  alt="Сервис в студии Cabinet 310"
                  className="rounded-2xl md:rounded-[2.5rem] relative z-10 w-full object-cover aspect-[4/5]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbP5eqjUkfFVfIH8HFT1kh5hhEQTlJ3PRPBbLYXlyRu8ZdO2Ee2jpZ0Bi5pWllFY2zrpra9G6p3yAt59h8WvJLxmWnO9dWTullMcWFxos6JpWSWRUqGYWM_c1s4fo6stJ-IKDAJvf6Mnt-qOo6oKjYH2O_7KJCZZutaTg4IehYKV32vHLlyjxpdlBA4_5G3t3-BC9YNVusFBdxTz-8l2H_Az5Zs3ak40bxVP7iF9AMaEynjIJz_lBvYT3g0lBybHAtIqGfN7T3wbc"
                  width={600}
                  height={750}
                />
              </div>
              <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs md:text-sm">star</span>
                  Преимущества
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black  ">Почему выбирают нас</h3>
                <p className="text-lg md:text-xl text-slate-600   leading-relaxed">
                  Мы создали условия, в которых красота рождается в комфорте, а результат превосходит ожидания.
                </p>
                <div className="space-y-5 md:space-y-6">
                  <div className="flex gap-4 md:gap-6 items-start group">
                    <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl md:text-2xl">health_and_safety</span>
                    </div>
                    <div>
                      <h5 className="font-black text-base md:text-lg mb-1 md:mb-2  ">Безопасность 100%</h5>
                      <p className="text-sm md:text-base text-slate-600  ">Многоступенчатая стерилизация инструментов и использование только одноразовых расходных материалов.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6 items-start group">
                    <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
                    </div>
                    <div>
                      <h5 className="font-black text-base md:text-lg mb-1 md:mb-2  ">Premium-качество</h5>
                      <p className="text-sm md:text-base text-slate-600  ">Работаем на сертифицированных пигментах и люксовых брендах гель-лаков.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6 items-start group">
                    <div className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl md:text-2xl">workspace_premium</span>
                    </div>
                    <div>
                      <h5 className="font-black text-base md:text-lg mb-1 md:mb-2  ">Уровень экспертов</h5>
                      <p className="text-sm md:text-base text-slate-600  ">Наши мастера постоянно повышают квалификацию и владеют топовыми техниками индустрии.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-20 max-[320px]:mb-16" id="faq">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs md:text-sm">help</span>
              Вопрос-ответ
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black  ">Частые вопросы</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg px-4">Ответы на самые популярные вопросы о наших услугах</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4">
              <details className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group" open>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">event_available</span>
                    </span>
                    <h2 className="font-bold text-base sm:text-lg  ">Как записаться на процедуру?</h2>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600   leading-relaxed">
                  Вы можете оставить заявку через сайт, написать нам в мессенджер или позвонить по телефону. Мы уточним желаемую услугу и подберём удобное время.
                </div>
              </details>
              <details className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-accent-pink/15 text-accent-pink flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">health_and_safety</span>
                    </span>
                    <h2 className="font-bold text-base sm:text-lg  ">Как вы обеспечиваете стерильность?</h2>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600   leading-relaxed">
                  Мы используем только одноразовые расходные материалы и проводим многоступенчатую стерилизацию инструментов в соответствии с санитарными нормами. Поверхности обрабатываются после каждого гостя.
                </div>
              </details>
              <details className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-accent-purple/15 text-accent-purple flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">payments</span>
                    </span>
                    <h2 className="font-bold text-base sm:text-lg  ">Какие способы оплаты доступны?</h2>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600   leading-relaxed">
                  Вы можете оплатить услуги наличными, картой и переводом. Если вам нужен чек для отчётности — сообщите администратору заранее.
                </div>
              </details>
              <details className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">schedule</span>
                    </span>
                    <h2 className="font-bold text-base sm:text-lg  ">Что если я опаздываю или не могу прийти?</h2>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600   leading-relaxed">
                  Пожалуйста, предупредите нас как можно раньше. При опоздании более чем на 15 минут часть процедуры может быть сокращена или перенесена — мы всегда стараемся найти комфортное решение.
                </div>
              </details>
              <details className="rounded-3xl border border-slate-200/80 bg-white/80 faq-item p-6 max-[480px]:p-5 max-[320px]:p-4 group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">face_3</span>
                    </span>
                    <h2 className="font-bold text-base sm:text-lg  ">Можно ли делать перманент при наличии аллергий?</h2>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0">expand_more</span>
                </summary>
                <div className="mt-3 text-sm text-slate-600   leading-relaxed">
                  При склонности к аллергиям мы рекомендуем предварительную консультацию и патч-тест. Мастер подберёт безопасные пигменты и честно расскажет о возможных рисках.
                </div>
              </details>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="glass rounded-3xl p-7 max-[480px]:p-6 max-[320px]:p-5 border border-white/50 shadow-xl">
                <h3 className="text-xl font-black mb-3  ">Не нашли ответ?</h3>
                <p className="text-sm text-slate-600   mb-6">Свяжитесь с нами — мы всегда на связи!</p>
                <div className="space-y-4">
                  <a href="https://vk.com/cabinet_310" className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-all group">
                    <div className="size-11 max-[480px]:size-11 rounded-xl bg-[#0077FF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 max-[480px]:w-6 max-[480px]:h-6 text-white" width="804" height="481" viewBox="0 0 804 481" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.25306 5.61565C-27.5469 20.0157 50.8531 201.616 148.453 329.616C218.853 421.616 297.253 469.616 390.053 477.616C461.253 483.216 470.853 474.416 470.853 400.016C470.853 369.616 474.853 342.416 479.653 340.016C498.853 328.016 533.253 348.816 599.653 412.816L669.253 480.016H729.253C813.253 480.016 822.853 464.816 775.653 400.016C764.453 384.816 734.853 350.416 709.253 324.016C683.653 297.616 662.853 268.816 662.853 260.816C662.853 252.016 683.653 212.816 710.053 172.816C781.253 61.6156 797.253 25.6157 780.453 8.81565C770.853 -0.784346 681.253 -3.18435 659.653 4.81565C652.453 7.21565 628.453 44.8157 606.053 88.0156C566.853 164.016 507.653 236.016 485.253 236.016C477.253 236.016 474.053 210.416 472.453 128.816C471.653 64.0156 466.853 16.8157 461.253 10.4157C454.853 2.41565 431.653 0.0156536 371.653 1.61565C301.253 4.01565 290.853 5.61565 288.453 18.4157C286.853 26.4157 292.453 40.8157 300.453 49.6157C312.453 63.2156 315.653 82.4156 317.253 164.816C319.653 253.616 318.853 264.816 306.053 269.616C278.053 280.016 209.253 178.416 162.053 56.0157C141.253 1.61565 138.853 0.0156536 75.6531 0.815654C44.4531 0.815654 14.0531 3.21565 9.25306 5.61565Z" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500  ">Написать</p>
                      <p className="font-bold text-sm  ">В ВК</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="glass rounded-3xl p-7 max-[480px]:p-6 max-[320px]:p-5 border border-white/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                  </div>
                  <h4 className="font-black  ">Режим работы</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600  ">Понедельник - Воскресенье</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">09:00 - 20:00</span>
                  </div>
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