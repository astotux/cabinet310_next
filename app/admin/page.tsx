"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const bookingsRes = await fetch("/api/bookings");
    const bookingsData = await bookingsRes.json();
    setBookings(bookingsData);

    const reviewsRes = await fetch("/api/admin/reviews");
    const reviewsData = await reviewsRes.json();
    setReviews(reviewsData);
  };

  const approveReview = async (id: number) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    fetchData();
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Удалить эту запись?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full glass border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/logo.svg" style={{ width: '100px' }} alt="Cabinet 310" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Админ</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">account_circle</span>
              <span className="text-sm font-semibold">Мастер А</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold hover:border-primary transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6">
        <div className="mb-8">
          <h1 className="text-4xl max-[480px]:text-3xl max-[320px]:text-2xl font-black tracking-tight mb-2">
            Панель управления
          </h1>
          <p className="text-slate-500">Управление записями и ценами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="service-card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-2xl gradient-bg text-white flex items-center justify-center">
                <span className="material-symbols-outlined">event</span>
              </div>
              <span className="text-2xl font-black text-gradient">{bookings.length}</span>
            </div>
            <h3 className="font-bold mb-1">Записей сегодня</h3>
            <p className="text-xs text-slate-500">Всего записей</p>
          </div>

          <div className="service-card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-2xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <span className="text-2xl font-black text-gradient">8</span>
            </div>
            <h3 className="font-bold mb-1">Свободных слотов</h3>
            <p className="text-xs text-slate-500">На ближайшие 3 дня</p>
          </div>

          <div className="service-card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-2xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-2xl font-black text-gradient">{reviews.filter(r => !r.approved).length}</span>
            </div>
            <h3 className="font-bold mb-1">Отзывов на модерации</h3>
            <p className="text-xs text-slate-500">Требуют одобрения</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tight">Календарь записей</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
                    Сегодня
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold hover:border-primary transition-colors">
                    Неделя
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <h3 className="text-lg font-bold">27 февраля 2026</h3>
                  <button className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
                <button className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                  + Добавить запись
                </button>
              </div>

              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Записей пока нет</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-slate-200/60">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs font-bold text-slate-400 uppercase">Время</p>
                        <p className="text-lg font-black text-primary">{booking.time}</p>
                      </div>
                      <div className="h-12 w-px bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-sm text-accent-pink">face_3</span>
                          <h4 className="font-bold">{booking.service}</h4>
                        </div>
                        <p className="text-sm text-slate-500">{booking.clientName} • {booking.clientPhone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <button className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  <span className="font-semibold">Добавить слот или блокировку</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="service-card-glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black tracking-tight">Быстрые действия</h2>
              </div>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-primary transition-colors flex items-center gap-3">
                  <div className="size-10 rounded-xl gradient-bg text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">block</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Заблокировать время</p>
                    <p className="text-xs text-slate-500">Технический перерыв</p>
                  </div>
                </button>

                <button className="w-full p-4 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-primary transition-colors flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Открыть слоты</p>
                    <p className="text-xs text-slate-500">На следующую неделю</p>
                  </div>
                </button>

                <button className="w-full p-4 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-primary transition-colors flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                    <span className="material-symbols-outlined">download</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Экспорт записей</p>
                    <p className="text-xs text-slate-500">За текущий месяц</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="service-card-glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black tracking-tight">Отзывы на модерации</h2>
              </div>
              <div className="space-y-3">
                {reviews.filter(r => !r.approved).length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Нет отзывов</p>
                ) : (
                  reviews.filter(r => !r.approved).slice(0, 3).map((review) => (
                    <div key={review.id} className="p-3 rounded-xl bg-white/60 border border-slate-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-sm text-primary">person</span>
                        <span className="text-xs font-bold text-slate-400">{review.name}</span>
                      </div>
                      <p className="font-bold text-sm mb-1">{review.text.substring(0, 50)}...</p>
                      <button
                        onClick={() => approveReview(review.id)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Одобрить
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight">Управление ценами</h2>
            <button className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              + Добавить услугу
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Услуга</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Мастер</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Длительность</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Цена</th>
                  <th className="text-right py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">face_3</span>
                      </div>
                      <div>
                        <p className="font-bold">Перманент бровей</p>
                        <p className="text-xs text-slate-500">Пудровое напыление</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Мастер Б</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold">2 часа</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-black text-gradient">5 000 ₽</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">face_3</span>
                      </div>
                      <div>
                        <p className="font-bold">Перманент губ</p>
                        <p className="text-xs text-slate-500">Акварельная техника</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Мастер Б</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold">2.5 часа</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-black text-gradient">6 500 ₽</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">back_hand</span>
                      </div>
                      <div>
                        <p className="font-bold">Маникюр</p>
                        <p className="text-xs text-slate-500">Покрытие гель-лак</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-bold">Мастер А</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold">1.5 часа</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-black text-gradient">2 500 ₽</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">back_hand</span>
                      </div>
                      <div>
                        <p className="font-bold">Наращивание ногтей</p>
                        <p className="text-xs text-slate-500">Гелевое наращивание</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-bold">Мастер А</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold">2 часа</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-black text-gradient">3 500 ₽</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </div>
                      <div>
                        <p className="font-bold">Ламинирование ресниц</p>
                        <p className="text-xs text-slate-500">С ботоксом</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Мастер Б</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold">1 час</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-black text-gradient">2 000 ₽</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img src="/logo.svg" style={{ width: '100px' }} alt="Cabinet 310" />
              </Link>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Студия эстетики в городе Сыктывкар. Мы создаем безупречные образы, подчеркивая вашу индивидуальность
              через искусство перманента и нейл-сервиса.
            </p>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-slate-200">Навигация</h6>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link className="hover:text-white transition-colors" href="/#about">О студии</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#services">Услуги</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/reviews">Отзывы</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/contacts">Контакты</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#faq">Вопрос-ответ</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-slate-200">Контакты</h6>
            <div className="space-y-4 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                г. Сыктывкар, ул. Куратова, д. 4
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">call</span>
                +7 (908) 695-49-04
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                Ежедневно: 10:00 — 18:00
              </p>
            </div>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-slate-200">Мы в соцсетях</h6>
            <div className="flex gap-4 pt-1">
              <a 
                title="Мы в ВК"
                className="size-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer" 
                href="https://vk.com/cabinet_310"
              >
                <span className="text-lg">ВК</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Кабинет 310. Все права защищены.</p>
          <p>С любовью к вашей красоте ✨</p>
        </div>
      </footer>
    </div>
  );
}
