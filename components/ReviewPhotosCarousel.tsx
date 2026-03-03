'use client';

import { useEffect } from 'react';

interface ReviewPhotosCarouselProps {
  photos: { id: number; imageUrl: string }[];
  reviewId: number;
}

export default function ReviewPhotosCarousel({ photos, reviewId }: ReviewPhotosCarouselProps) {
  useEffect(() => {
    // Dynamically import Swiper only on client side
    const initSwiper = async () => {
      const Swiper = (await import('swiper')).default;
      const { Navigation, Pagination } = await import('swiper/modules');
      
      new Swiper(`.reviewSwiper-${reviewId}`, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false, // Отключаем loop для корректной работы пагинации
        speed: 400,
        pagination: {
          el: `.swiper-pagination-${reviewId}`,
          clickable: true,
          type: 'bullets',
          dynamicBullets: true,
          dynamicMainBullets: 3,
        },
        navigation: {
          nextEl: `.swiper-button-next-${reviewId}`,
          prevEl: `.swiper-button-prev-${reviewId}`,
        },
        breakpoints: {
          480: {
            slidesPerView: photos.length === 1 ? 1 : 1.5,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: photos.length === 1 ? 1 : Math.min(2, photos.length),
            spaceBetween: 12,
          },
        },
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
      });
    };

    initSwiper();
  }, [photos, reviewId]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative mt-4">
      <div className={`swiper reviewSwiper-${reviewId}`}>
        <div className="swiper-wrapper">
          {photos.map((photo) => (
            <div key={photo.id} className="swiper-slide">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] w-full">
                <img 
                  src={photo.imageUrl} 
                  alt="Фото отзыва" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <div className={`swiper-button-next swiper-button-next-${reviewId}`}></div>
            <div className={`swiper-button-prev swiper-button-prev-${reviewId}`}></div>
            <div className={`swiper-pagination swiper-pagination-${reviewId}`}></div>
          </>
        )}
      </div>
    </div>
  );
}
