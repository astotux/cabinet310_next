import Link from "next/link";

interface Promotion {
  id: number;
  title: string;
  text: string;
  image: string | null;
}

async function getActivePromotion(): Promise<Promotion | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/promotions`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PromoBanner() {
  const promo = await getActivePromotion();
  if (!promo) return null;

  const bgStyle = promo.image
    ? { backgroundImage: `url(${promo.image.startsWith('/') ? promo.image : `/uploads/${promo.image}`})` }
    : { backgroundImage: `url(promo.png)`};

  return (
    <section className="mb-24 md:mb-28 lg:mb-32 max-[480px]:mb-16">
      <div
        className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden min-h-[280px] md:min-h-[320px] flex items-center bg-white bg-cover bg-center"
        style={bgStyle}
      >
        {/* Затемнение */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Декоративные звёздочки */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img src="/star.svg" alt="" className="absolute left-6 top-8 w-8 opacity-40" />
          <img src="/star.svg" alt="" className="absolute right-8 top-6 w-10 opacity-30" />
          <img src="/star.svg" alt="" className="absolute left-10 bottom-8 w-6 opacity-25" />
          <img src="/star.svg" alt="" className="absolute right-12 bottom-10 w-7 opacity-35" />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-8 md:px-16 py-12 md:py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-xs">local_offer</span>
            Акция
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            {promo.title}
          </h2>
          <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8 max-w-xl mx-auto">
            {promo.text}
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 gradient-animated px-8 py-4 rounded-xl text-white font-bold text-base shadow-2xl hover:scale-105 transition-transform"
          >
            Записаться
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
