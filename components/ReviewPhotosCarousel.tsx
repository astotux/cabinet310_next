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
      const { Navigation, Autoplay } = await import('swiper/modules');
      
      new Swiper(`.reviewSwiper-${reviewId}`, {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        speed: 600,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: `.swiper-button-next-${reviewId}`,
          prevEl: `.swiper-button-prev-${reviewId}`,
        },
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
              {(() => {
                const src = photo.imageUrl.startsWith('/') ? photo.imageUrl : `/uploads/${photo.imageUrl}`;
                return (
                  <div className="relative overflow-hidden rounded-xl w-full flex items-center justify-center" style={{ minHeight: 180 }}>
                    {/* Blurred background */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover scale-110"
                      style={{ filter: 'blur(18px)', opacity: 0.7 }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    {/* Actual photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt="Фото отзыва"
                      className="relative z-10 max-w-full max-h-[420px] object-contain"
                      loading="lazy"
                    />
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <div className={`swiper-button-next swiper-button-next-${reviewId}`}></div>
            <div className={`swiper-button-prev swiper-button-prev-${reviewId}`}></div>
          </>
        )}
      </div>
    </div>
  );
}
