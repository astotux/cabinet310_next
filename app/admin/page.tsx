"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tab, setTab] = useState("bookings");
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
    // Вызываем API для удаления cookie
    await fetch('/api/admin/logout', { method: 'POST' });
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">Админ-панель</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          >
            Выйти
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("bookings")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              tab === "bookings" ? "gradient-bg text-white" : "glass hover:bg-white/80"
            }`}
          >
            Записи ({bookings.length})
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              tab === "reviews" ? "gradient-bg text-white" : "glass hover:bg-white/80"
            }`}
          >
            Отзывы ({reviews.filter(r => !r.approved).length})
          </button>
        </div>

        {tab === "bookings" && (
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Записи</h2>
            {bookings.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Записей пока нет</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-lg">{booking.clientName}</p>
                      <p className="text-sm text-slate-600">
                        {booking.service} - {booking.date} в {booking.time}
                      </p>
                      <p className="text-sm text-slate-600">Телефон: {booking.clientPhone}</p>
                      <p className="text-xs text-slate-400 mt-1">Мастер: {booking.master}</p>
                    </div>
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Отзывы на модерации</h2>
            {reviews.filter(r => !r.approved).length === 0 ? (
              <p className="text-slate-500 text-center py-8">Нет отзывов на модерации</p>
            ) : (
              <div className="space-y-4">
                {reviews.filter(r => !r.approved).map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold">{review.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${
                              i < review.rating ? "text-yellow-400" : "text-slate-300"
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{review.text}</p>
                    <button
                      onClick={() => approveReview(review.id)}
                      className="gradient-bg px-4 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Одобрить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
