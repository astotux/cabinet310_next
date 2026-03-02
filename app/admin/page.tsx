"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    service: "",
    description: "",
    category: "",
    master: "",
    duration: "",
    price: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
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
    try {
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      const reviewsRes = await fetch("/api/admin/reviews");
      const reviewsData = await reviewsRes.json();
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      const servicesRes = await fetch("/api/services");
      const servicesData = await servicesRes.json();
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setBookings([]);
      setReviews([]);
      setServices([]);
    }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.filename) {
        setServiceForm({ ...serviceForm, image: data.filename });
      }
    } catch (error) {
      alert("Ошибка загрузки изображения");
    } finally {
      setUploading(false);
    }
  };

  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceForm({
      service: "",
      description: "",
      category: "",
      master: "",
      duration: "",
      price: "",
      image: "",
    });
    setShowServiceModal(true);
  };

  const openEditServiceModal = (service: any) => {
    setEditingService(service);
    setServiceForm({
      service: service.service,
      description: service.description || "",
      category: service.category || "",
      master: service.master,
      duration: service.duration,
      price: service.price.toString(),
      image: service.image || "",
    });
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceForm),
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceForm),
        });
      }
      setShowServiceModal(false);
      fetchData();
    } catch (error) {
      alert("Ошибка сохранения услуги");
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Удалить эту услугу?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchData();
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
            <button 
              onClick={openAddServiceModal}
              className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
            >
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
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Услуг пока нет
                    </td>
                  </tr>
                ) : (
                  services.map((service, index) => (
                    <tr 
                      key={service.id} 
                      className={`${index !== services.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-white/40 transition-colors`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {service.image ? (
                            <img 
                              src={service.image} 
                              alt={service.service}
                              className="size-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">spa</span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold">{service.service}</p>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                {service.category}
                              </span>
                            </div>
                            {service.description && (
                              <p className="text-xs text-slate-500">{service.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          service.master.includes('А') 
                            ? 'bg-accent-purple/10 text-accent-purple' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {service.master}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold">{service.duration}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-black text-gradient">{service.price.toLocaleString()} ₽</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openEditServiceModal(service)}
                            className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="size-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">
                {editingService ? "Редактировать услугу" : "Добавить услугу"}
              </h2>
              <button
                onClick={() => setShowServiceModal(false)}
                className="size-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Название услуги *</label>
                <input
                  type="text"
                  value={serviceForm.service}
                  onChange={(e) => setServiceForm({ ...serviceForm, service: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Перманент бровей"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Описание</label>
                <input
                  type="text"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Пудровое напыление"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Категория *</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  <option value="">Выберите категорию</option>
                  <option value="Перманент">Перманент</option>
                  <option value="Маникюр">Маникюр</option>
                  <option value="Ламинирование">Ламинирование</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Мастер *</label>
                  <select
                    value={serviceForm.master}
                    onChange={(e) => setServiceForm({ ...serviceForm, master: e.target.value })}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <option value="">Выберите мастера</option>
                    <option value="Мастер А">Мастер А</option>
                    <option value="Мастер Б">Мастер Б</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Длительность *</label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="2 часа"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Цена (₽) *</label>
                <input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Изображение</label>
                <div className="space-y-3">
                  {serviceForm.image && (
                    <div className="relative inline-block">
                      <img
                        src={serviceForm.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setServiceForm({ ...serviceForm, image: "" })}
                        className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary transition-all"
                  />
                  {uploading && <p className="text-sm text-slate-500">Загрузка...</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg px-6 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
                >
                  {editingService ? "Сохранить" : "Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
