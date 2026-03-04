"use client";

export default function QRPage() {
  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen flex items-center justify-center p-4 max-[480px]:p-3">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 size-96 gradient-bg opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 size-96 bg-primary/20 opacity-20 blur-3xl rounded-full"></div>
        <img src="/star.svg" alt="" className="absolute left-[10%] top-[15%] w-10 h-10 opacity-15" />
        <img src="/star.svg" alt="" className="absolute right-[15%] top-[20%] w-12 h-12 opacity-15" />
        <img src="/star.svg" alt="" className="absolute left-[20%] bottom-[25%] w-8 h-8 opacity-12" />
        <img src="/star.svg" alt="" className="absolute right-[10%] bottom-[15%] w-10 h-10 opacity-12" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 max-[480px]:mb-4">
          <a href="/">
            <img src="/logo.svg" style={{ width: '100px' }} alt="Cabinet 310" className="mx-auto mb-4 max-[480px]:mb-3" />
          </a>
          <h1 className="text-3xl max-[480px]:text-2xl font-black tracking-tight mb-2">
            Оставьте отзыв
          </h1>
          <p className="text-slate-600 text-sm max-[480px]:text-xs">
            Ваше мнение очень важно для нас!
          </p>
        </div>

        {/* Review Buttons */}
        <div className="space-y-3 max-[480px]:space-y-2.5">
          {/* Website Review */}
          <a
            href="/reviews"
            className="glass rounded-2xl p-4 max-[480px]:p-3.5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group hover:scale-[1.02]"
          >
            <div className="size-12 max-[480px]:size-11 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-2xl max-[480px]:text-xl">
                rate_review
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-base max-[480px]:text-sm text-slate-900 mb-0.5">
                На нашем сайте
              </h3>
              <p className="text-xs max-[480px]:text-[11px] text-slate-600 truncate">
                Оставьте отзыв с фото
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">
              arrow_forward
            </span>
          </a>

          {/* Yandex Maps Review */}
          <a
            href="https://yandex.ru/profile/72948536986?lang=ru"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-4 max-[480px]:p-3.5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group hover:scale-[1.02]"
          >
            <div className="size-12 max-[480px]:size-11 rounded-xl bg-[#FC3F1D] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 max-[480px]:w-6 max-[480px]:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-base max-[480px]:text-sm text-slate-900 mb-0.5">
                На Яндекс Картах
              </h3>
              <p className="text-xs max-[480px]:text-[11px] text-slate-600 truncate">
                Оцените нас на картах
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">
              arrow_forward
            </span>
          </a>

          {/* VK Review */}
          <a
            href="https://vk.com/cabinet_310"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-4 max-[480px]:p-3.5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group hover:scale-[1.02]"
          >
            <div className="size-12 max-[480px]:size-11 rounded-xl bg-[#0077FF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 max-[480px]:w-6 max-[480px]:h-6 text-white" width="804" height="481" viewBox="0 0 804 481" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.25306 5.61565C-27.5469 20.0157 50.8531 201.616 148.453 329.616C218.853 421.616 297.253 469.616 390.053 477.616C461.253 483.216 470.853 474.416 470.853 400.016C470.853 369.616 474.853 342.416 479.653 340.016C498.853 328.016 533.253 348.816 599.653 412.816L669.253 480.016H729.253C813.253 480.016 822.853 464.816 775.653 400.016C764.453 384.816 734.853 350.416 709.253 324.016C683.653 297.616 662.853 268.816 662.853 260.816C662.853 252.016 683.653 212.816 710.053 172.816C781.253 61.6156 797.253 25.6157 780.453 8.81565C770.853 -0.784346 681.253 -3.18435 659.653 4.81565C652.453 7.21565 628.453 44.8157 606.053 88.0156C566.853 164.016 507.653 236.016 485.253 236.016C477.253 236.016 474.053 210.416 472.453 128.816C471.653 64.0156 466.853 16.8157 461.253 10.4157C454.853 2.41565 431.653 0.0156536 371.653 1.61565C301.253 4.01565 290.853 5.61565 288.453 18.4157C286.853 26.4157 292.453 40.8157 300.453 49.6157C312.453 63.2156 315.653 82.4156 317.253 164.816C319.653 253.616 318.853 264.816 306.053 269.616C278.053 280.016 209.253 178.416 162.053 56.0157C141.253 1.61565 138.853 0.0156536 75.6531 0.815654C44.4531 0.815654 14.0531 3.21565 9.25306 5.61565Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-base max-[480px]:text-sm text-slate-900 mb-0.5">
                В группе ВКонтакте
              </h3>
              <p className="text-xs max-[480px]:text-[11px] text-slate-600 truncate">
                Поделитесь впечатлениями
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">
              arrow_forward
            </span>
          </a>

        </div>

        {/* Footer Note */}
        <div className="mt-5 max-[480px]:mt-4 text-center">
          <div className="glass rounded-xl p-3 max-[480px]:p-2.5 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg max-[480px]:text-base">favorite</span>
            <p className="text-xs max-[480px]:text-[11px] text-slate-600">
              Спасибо, что выбираете нас!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
