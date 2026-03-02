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
    
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, text }),
    });

    if (response.ok) {
      alert("Отзыв отправлен на модерацию!");
      setShowForm(false);
      setName("");
      setRating(5);
      setText("");
      fetchReviews();
    }
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
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-colors">Перманент</button>
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-colors">Маникюр</button>
            <button className="px-6 py-2.5 rounded-xl glass text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-white dark:hover:bg-slate-800 transition-colors">Ресницы</button>
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
                  <h4 className="font-bold text-slate-900 dark:text-white">{review.name}</h4>
                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
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
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black mb-6 dark:text-white">Оставить отзыв</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-white">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-white">Оценка</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} звезд</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-white">Отзыв</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 rounded-xl border dark:border-slate-700 dark:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg px-6 py-3 rounded-xl text-white font-bold"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
