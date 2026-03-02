'use client';

import { useEffect } from 'react';

export default function PortfolioCarousel() {
  useEffect(() => {
    // Dynamically import Swiper only on client side
    const initSwiper = async () => {
      const Swiper = (await import('swiper')).default;
      const { Navigation, Pagination, Autoplay } = await import('swiper/modules');
      
      new Swiper('.portfolioSwiper', {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          480: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 32,
          },
        },
      });
    };

    initSwiper();
  }, []);

  const portfolioImages = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYZO5DyIWa0pCfDz662qMo1pL0qqDJtl8nr3nOGiV7jCJmWJOdlazfoR8zFpwLKu72up2pyeRr4_DRWbJ8FxHBH3DVBbvd0QgCihCcLnWkTqb06IAIJqQyw3ifMYYsL0X6pPgE1znJLhY0NwtZqsuEzXpnWj43zJ5dihBz15Iviq0a7abIUBAvACyWK-z7gUfkothzymVqhM1MW8HzcOqk6BHiiJ4KZZQXCsvGFOKUz2GAddcQ1nLu_VfxO93Qu02-h_NwbiM1KxQ",
      alt: "Перманентный макияж бровей",
      category: "Брови",
      icon: "face_3",
      title: "Пудровые брови",
      description: "Естественный эффект"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv9twUesAuYJaCTlwZiBhhnUaP7fiKG4-A8ClhNHPYqsCOEYEabVVGQonjsUd_CWvrppGDcBq2BRd9c4Kiq-K__FbeUIoXDGYqhgKmiDWb5PGV8LWaZYp4hWBT9iY0oYRWUs-2GnTXLj-dq6hrqOizEAh91qjmi_BAMNZOqyBWCyRHeAi2Wzdt5eP0jp8cAYaLDl0LvR-S1paHEnS-pdGDU3aH8yfEc6Sdf_1RAeNhI1ZN1P8mOklppZgzNXKDlgENvZoDMFZlSSw",
      alt: "Маникюр с дизайном",
      category: "Маникюр",
      icon: "back_hand",
      title: "Авторский дизайн",
      description: "Уникальный стиль"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKoK0nkxIPDHSXuDFo9eRTbxbcpR4kN-rudegvXGjJXCEiTXCbuW_EBk_IJ6I5_aPpiXRz_Klm150HCSLuofnCb2UeRawuUu8rRk96tqeFeouGml5bWCZeOl0K7tcuYWx7kjU-lvRloZBhfN-hEFvSzZfRDS56oSzpteWn-AaRQJyv5OFk4fFK2rki0RZjilpERZiWvHl18zVtbwFHWC51-gM-f1ISHhSXC0tw7Im68__0Ma7nb-LEHtm9JQ8zM6we7ZBuCyBTDRw",
      alt: "Ламинирование ресниц",
      category: "Ресницы",
      icon: "visibility",
      title: "Ламинирование",
      description: "Выразительный взгляд"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5o8dJxHaU2afrjR1saDcd58EmcGKvCRm3rYCwoCj6t5n-XPM9DJyTozPbuvLnde9I0M67EUlxxTx9loPtnuUjvG3ZSNqRLfit5p5ir8X4gfJaA47kdDEEylwqEXsJ7QQzuj4mAwoISCVv9IoD3MpF0gSE9rK3607pEQekTts3nRCwPYxWWhPPpN3UjXwEKFVd8ayko_qT73AMdOlmHG_XHawcwjRThozQb7uSYLJz-Sw5LddB-3cyVyn-X4NKz8wicVGne1dMQXs",
      alt: "Акварельные губы",
      category: "Губы",
      icon: "face_3",
      title: "Акварельные губы",
      description: "Нежный оттенок"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbP5eqjUkfFVfIH8HFT1kh5hhEQTlJ3PRPBbLYXlyRu8ZdO2Ee2jpZ0Bi5pWllFY2zrpra9G6p3yAt59h8WvJLxmWnO9dWTullMcWFxos6JpWSWRUqGYWM_c1s4fo6stJ-IKDAJvf6Mnt-qOo6oKjYH2O_7KJCZZutaTg4IehYKV32vHLlyjxpdlBA4_5G3t3-BC9YNVusFBdxTz-8l2H_Az5Zs3ak40bxVP7iF9AMaEynjIJz_lBvYT3g0lBybHAtIqGfN7T3wbc",
      alt: "Оформление бровей",
      category: "Брови",
      icon: "face_3",
      title: "Архитектура бровей",
      description: "Идеальная форма"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYZO5DyIWa0pCfDz662qMo1pL0qqDJtl8nr3nOGiV7jCJmWJOdlazfoR8zFpwLKu72up2pyeRr4_DRWbJ8FxHBH3DVBbvd0QgCihCcLnWkTqb06IAIJqQyw3ifMYYsL0X6pPgE1znJLhY0NwtZqsuEzXpnWj43zJ5dihBz15Iviq0a7abIUBAvACyWK-z7gUfkothzymVqhM1MW8HzcOqk6BHiiJ4KZZQXCsvGFOKUz2GAddcQ1nLu_VfxO93Qu02-h_NwbiM1KxQ",
      alt: "Комплексный уход",
      category: "Комплекс",
      icon: "spa",
      title: "Полный уход",
      description: "Маникюр + педикюр"
    }
  ];

  return (
    <div className="relative">
      <div className="swiper portfolioSwiper">
        <div className="swiper-wrapper pb-4">
          {portfolioImages.map((image, index) => (
            <div key={index} className="swiper-slide">
              <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl aspect-[3/4] w-full">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="size-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">{image.icon}</span>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider">{image.category}</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-black mb-1">{image.title}</h4>
                    <p className="text-sm text-white/80">{image.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
}
