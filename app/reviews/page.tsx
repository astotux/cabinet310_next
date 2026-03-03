"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const serviceOptions = [
    { name: "Перманент губ", icon: "face_3" },
    { name: "Перманент бровей", icon: "eye_tracking" },
    { name: "Межресничка", icon: "visibility" },
    { name: "Лами ресниц", icon: "content_cut" },
    { name: "Маникюр", icon: "back_hand" },
    { name: "Другое", icon: "more_horiz" },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await fetch("/api/reviews");
    const data = await response.json();
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Сначала загружаем фото, если они есть
      const photoUrls: string[] = [];
      
      if (photos.length > 0) {
        for (const photo of photos) {
          const formData = new FormData();
          formData.append("file", photo);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            photoUrls.push(uploadData.filename); // Используем filename вместо url
          }
        }
      }

      // Затем создаем отзыв с фото
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, service, photos: photoUrls }),
      });

      if (response.ok) {
        alert("Отзыв отправлен на модерацию!");
        setShowForm(false);
        setName("");
        setRating(5);
        setText("");
        setService("");
        setPhotos([]);
        fetchReviews();
      }
    } catch (error) {
      alert("Ошибка при отправке отзыва");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Ограничиваем до 5 фото
      setPhotos(prev => [...prev, ...filesArray].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto w-full px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6 max-[767px]:pb-32">
        <section className="mb-16 max-[480px]:mb-12 max-[320px]:mb-10 relative rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8 max-[480px]:p-6 max-[320px]:p-5 bg-slate-900">
          <div 
            className="absolute inset-0 opacity-40 bg-center bg-cover"
            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuFC3sfNL9nkEvXHoOc6khcMlyJxnd3Q4IaL1VTFJ2V--cLdbbn_12JWZAIKsk-U96_hdVB-3C4gfu_JUChPm16au1hENg_XQtfFFYY9tgbjzKErBMmLzXAiJjcagEuyDue9rV1nf99Zo8v707-m8K6Cgme-Ty6GJBz8evE70t2QtkJG2r2BABHn6XV_QCBIjKyJxRTL3Acl4devfIoRWBnxjTNWMgYG6pmTd3tcn7pGa0Ey_eJFPYiCxK02UYYQV7RiHHZX9cNO4')"}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img src="/star.svg" alt="" className="absolute left-6 top-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-25 mix-blend-screen" />
            <img src="/star.svg" alt="" className="absolute right-6 top-16 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-20 mix-blend-screen" />
            <img src="/star.svg" alt="" className="absolute right-12 bottom-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-20 mix-blend-screen" />
            <img src="/star.svg" alt="" className="hidden sm:block absolute left-10 bottom-8 w-7 h-7 md:w-9 md:h-9 opacity-15 mix-blend-screen" />
          </div>

          <div className="relative z-10 max-w-2xl px-2 max-[480px]:px-1">
            <div className="flex justify-center gap-1 mb-6 animate-pulse">
              <span className="material-symbols-outlined text-accent-pink text-4xl" style={{fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(122, 31, 249, 0.4)"}}>star</span>
              <span className="material-symbols-outlined text-accent-pink text-4xl" style={{fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(122, 31, 249, 0.4)"}}>star</span>
              <span className="material-symbols-outlined text-accent-pink text-4xl" style={{fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(122, 31, 249, 0.4)"}}>star</span>
              <span className="material-symbols-outlined text-accent-pink text-4xl" style={{fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(122, 31, 249, 0.4)"}}>star</span>
              <span className="material-symbols-outlined text-accent-pink text-4xl" style={{fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(122, 31, 249, 0.4)"}}>star</span>
            </div>
            <h2 className="text-white text-5xl max-[480px]:text-3xl max-[320px]:text-2xl lg:text-7xl font-black mb-4 tracking-tight">
              Истории вашего <br /> преображения
            </h2>
            <p className="text-slate-200 text-lg max-[480px]:text-base mb-8 font-light max-w-lg mx-auto">
              Счастливые улыбки наших клиентов — главная награда. Узнайте, почему нам доверяют свою красоту наши гости.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-bg text-white px-10 max-[480px]:px-8 max-[320px]:px-6 py-4 max-[480px]:py-3.5 rounded-2xl font-bold text-lg max-[480px]:text-base shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] transition-all">
                Читать отзывы
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 max-[480px]:px-8 max-[320px]:px-6 py-4 max-[480px]:py-3.5 rounded-2xl font-bold text-lg max-[480px]:text-base hover:bg-white/20 transition-all"
              >
                Оставить свой
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md">Все услуги</button>
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 font-semibold text-sm hover:bg-white transition-colors">Перманент</button>
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 font-semibold text-sm hover:bg-white transition-colors">Маникюр</button>
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 font-semibold text-sm hover:bg-white transition-colors">Ресницы</button>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            <span>Сортировка</span>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
            <img src="/star.svg" alt="" className="absolute left-2 top-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-20" />
            <img src="/star.svg" alt="" className="absolute right-2 top-16 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-20" />
            <img src="/star.svg" alt="" className="hidden md:block absolute left-2 top-1/2 w-8 h-8 md:w-10 md:h-10 opacity-15" />
            <img src="/star.svg" alt="" className="hidden md:block absolute right-2 top-2/3 w-8 h-8 md:w-10 md:h-10 opacity-15" />
            <img src="/star.svg" alt="" className="absolute left-2 bottom-6 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 opacity-12 hidden sm:block" />
            <img src="/star.svg" alt="" className="absolute right-2 bottom-10 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-12" />
          </div>

          {reviews.map((review) => (
            <div key={review.id} className="break-inside-avoid glass rounded-3xl p-6 max-[480px]:p-5 max-[320px]:p-4 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              
              {review.service && (
                <div className="mb-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">spa</span>
                  {review.service}
                </div>
              )}
              
              <div className="flex gap-0.5 mb-3 text-primary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0"}}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                {review.text}
              </p>
              
              {review.photos && review.photos.length > 0 && (
                <div className={`grid gap-2 mt-4 ${
                  review.photos.length === 1 ? 'grid-cols-1' :
                  review.photos.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {review.photos.map((photo: any) => (
                    <img
                      key={photo.id}
                      src={photo.imageUrl}
                      alt="Фото отзыва"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-[480px]:p-6 max-w-2xl w-full my-8 relative">
            {/* Декоративные звезды */}
            <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
              <img src="/star.svg" alt="" className="absolute -left-8 top-14 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-15" />
              <img src="/star.svg" alt="" className="absolute -right-8 top-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-15" />
              <img src="/star.svg" alt="" className="hidden sm:block absolute -left-8 bottom-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 opacity-12" />
              <img src="/star.svg" alt="" className="absolute -right-8 bottom-8 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-12" />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-4xl max-[480px]:text-3xl max-[320px]:text-2xl font-black text-slate-900 tracking-tight mb-3">
                  Поделитесь впечатлениями
                </h2>
                <p className="text-slate-500 max-w-md mx-auto max-[480px]:text-sm">
                  Ваше мнение помогает нам становиться лучше и радовать вас качественным сервисом
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 ml-1">Выберите услугу</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-[320px]:gap-2">
                    {serviceOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setService(option.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all shadow-sm ${
                          service === option.name
                            ? "bg-primary/5 border-primary text-primary"
                            : "bg-white border-slate-100 hover:border-primary hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined mb-2">{option.icon}</span>
                        <span className="text-xs font-semibold">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center space-y-3">
                  <label className="text-sm font-bold text-slate-700">Ваша оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 ${
                          star <= rating ? "text-primary" : "text-slate-300"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-4xl"
                          style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Area */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 ml-1">Ваш отзыв</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-2xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all p-4 placeholder:text-slate-400"
                    placeholder="Расскажите, как все прошло..."
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Фото (необязательно, до 5 шт)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-primary hover:text-primary transition-all bg-white/50 cursor-pointer">
                      <span className="material-symbols-outlined">add_a_photo</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Прикрепить фото</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        disabled={photos.length >= 5}
                        className="hidden"
                      />
                    </label>
                    
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full size-5 flex items-center justify-center shadow-md"
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Ваше имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all p-3.5"
                    placeholder="Введите имя"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-4 max-[480px]:py-3.5 rounded-2xl border-2 border-slate-200 font-bold hover:bg-slate-50 transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 gradient-bg py-4 max-[480px]:py-3.5 rounded-2xl text-white font-black text-lg max-[480px]:text-base tracking-wide shadow-xl shadow-accent-purple/30 hover:shadow-2xl hover:shadow-accent-purple/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {uploading ? "ОТПРАВКА..." : "ОТПРАВИТЬ ОТЗЫВ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
