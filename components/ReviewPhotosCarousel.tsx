'use client';

import { useEffect } from 'react';
import Image from 'next/image';

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
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] w-full">
                <Image 
                  src={photo.imageUrl.startsWith('/') ? photo.imageUrl : `/uploads/${photo.imageUrl}`}
                  width={400}
                  height={400}
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
          </>
        )}
      </div>
    </div>
  );
}
