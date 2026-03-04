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
        speed: 600,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '"></span>';
          },
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
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
      });
    };

    initSwiper();
  }, []);

  const portfolioImages = [
    {
      src: "/photo9.png",
      alt: "Маникюр",
      category: "Маникюр",
      icon: "back_hand",
      title: "Маникюр с дизайном",
      description: "Уникальный стиль"
    },
    {
      src: "/photo11.png",
      alt: "Ламинирование ресниц",
      category: "Ресницы",
      icon: "visibility",
      title: "Ламинирование ресниц",
      description: "Выразительный взгляд"
    },
    {
      src: "/photo13.png",
      alt: "Акварельные губы",
      category: "Губы",
      icon: "face_3",
      title: "Акварельные губы",
      description: "Нежный оттенок"
    },
        {
      src: "/photo14.png",
      alt: "Перманентный макияж бровей",
      category: "Брови",
      icon: "face_3",
      title: "Пудровые брови",
      description: "Естественный эффект"
    },
    {
      src: "/photo10.png",
      alt: "Маникюр с дизайном",
      category: "Маникюр",
      icon: "back_hand",
      title: "Маникюр с дизайном",
      description: "Уникальный стиль"
    },
    {
      src: "/photo12.png",
      alt: "Ламинирование ресниц",
      category: "Ресницы",
      icon: "face_3",
      title: "Ламинирование ресниц",
      description: "Выразительный взгляд"
    },

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
