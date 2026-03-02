"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import BookingCalendar from "./components/BookingCalendar";

interface Service {
  id: number;
  service: string;
  description: string;
  category: string;
  master: string;
  duration: number;
  price: number;
  image: string | null;
}

type BookingStep = 1 | 2 | 3;

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все услуги");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>(1);
  
  // Данные бронирования
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientComment, setClientComment] = useState("");
  const [bookingError, setBookingError] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Все услуги", ...Array.from(new Set(services.map(s => s.category)))];
  
  const filteredServices = selectedCategory === "Все услуги" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const toggleService = (id: number) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectedServiceObjects = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedServiceObjects.reduce((sum, s) => sum + s.price, 0);

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedServices.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((step - 1) as BookingStep);
      setBookingError("");
    }
  };

  const handleSubmitBooking = async () => {
    setBookingError("");
    setSubmitting(true);

    try {
      // Создаем бронирование для каждой выбранной услуги
      const bookingPromises = selectedServiceObjects.map(service =>
        fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: service.service,
            master: service.master,
            date: selectedDate,
            time: selectedTime,
            clientName,
            clientPhone,
            comment: clientComment,
          }),
        })
      );

      const responses = await Promise.all(bookingPromises);
      
      // Проверяем, все ли запросы успешны
      const allSuccessful = responses.every(r => r.ok);
      
      if (!allSuccessful) {
        const firstError = responses.find(r => !r.ok);
        const errorData = firstError ? await firstError.json() : null;
        throw new Error(errorData?.error || "Ошибка создания бронирования");
      }

      setBookingSuccess(true);
      
      // Сброс формы через 3 секунды
      setTimeout(() => {
        setStep(1);
        setSelectedServices([]);
        setSelectedDate("");
        setSelectedTime("");
        setClientName("");
        setClientPhone("");
        setClientComment("");
        setBookingSuccess(false);
      }, 3000);

    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  // Функция для форматирования даты в читаемый формат
  const formatReadableDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long',
      weekday: 'long'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  return (
    <>
      {/* Header без кнопки "Записаться" */}
      <header className="sticky top-0 z-50 w-full font-display">
        <div className="hidden md:block glass border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <a href="/">
                <img src="/logo.svg" className="w-20 md:w-24 lg:w-28" alt="Logo" />
              </a>
            </div>
            <nav className="flex items-center gap-6 lg:gap-10">
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/">
                Главная
              </a>
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/reviews">
                Отзывы
              </a>
              <a className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/contacts">
                Контакты
              </a>
            </nav>
          </div>
        </div>

        <div className="md:hidden p-3 w-full flex justify-center">
          <div className="glass rounded-2xl px-4 py-3 inline-flex items-center justify-center">
            <a href="/">
              <img src="/logo.svg" className="w-24" alt="Logo" />
            </a>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-around m-3">
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/reviews">
              <span className="material-symbols-outlined text-xl">star</span>
              <span>Отзывы</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/">
              <span className="material-symbols-outlined text-xl">home</span>
              <span>Главная</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/contacts">
              <span className="material-symbols-outlined text-xl">account_box</span>
              <span>Контакты</span>
            </a>
          </nav>
        </div>
      </header>

      <div className="font-display bg-background-light text-slate-900 min-h-screen overflow-x-hidden">
        <main className="max-w-6xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6 pb-24 md:pb-12">
        {/* Индикатор прогресса с полоской между этапами */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Фоновая линия */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0"></div>
            
            {/* Прогресс линия */}
            <div 
              className="absolute top-5 left-0 h-0.5 gradient-bg z-0 transition-all duration-500"
              style={{ 
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'
              }}
            ></div>
            
            <div className="flex flex-col items-center gap-2 bg-background-light px-4 max-[320px]:px-2 relative z-10">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? "gradient-bg text-white shadow-lg shadow-primary/30" : "bg-white border-2 border-slate-200 text-slate-400"
              }`}>
                1
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                step >= 1 ? "text-gradient" : "text-slate-400"
              }`}>Услуга</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background-light px-4 max-[320px]:px-2 relative z-10">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? "gradient-bg text-white shadow-lg shadow-primary/30" : "bg-white border-2 border-slate-200 text-slate-400"
              }`}>
                2
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                step >= 2 ? "text-gradient" : "text-slate-400"
              }`}>Время</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background-light px-4 max-[320px]:px-2 relative z-10">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? "gradient-bg text-white shadow-lg shadow-primary/30" : "bg-white border-2 border-slate-200 text-slate-400"
              }`}>
                3
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                step >= 3 ? "text-gradient" : "text-slate-400"
              }`}>Подтверждение</span>
            </div>
          </div>
        </div>

        {/* Шаг 1: Выбор услуги */}
        {step === 1 && (
          <>
            <div className="mb-12">
              <h2 className="text-5xl max-[480px]:text-3xl max-[320px]:text-2xl font-black tracking-tight text-slate-900 mb-4">
                Забронировать визит
              </h2>
              <p className="text-slate-500 text-lg max-[480px]:text-base">
                Выберите одну или несколько услуг, которые вы хотите получить.
              </p>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "gradient-bg text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-gradient-to-r hover:from-accent-pink hover:to-accent-purple hover:text-white hover:border-transparent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Загрузка услуг...</p>
              </div>
            ) : (
              <div className="space-y-4 mb-20 relative overflow-hidden">

                {filteredServices.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">Услуги не найдены</p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="service-card-glass p-6 max-[480px]:p-5 max-[320px]:p-4 rounded-3xl flex items-center justify-between gap-6 group max-[480px]:flex-col max-[480px]:items-stretch"
                    >
                      <div className="flex items-center gap-6 max-[480px]:gap-4">
                        <div className="size-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-primary overflow-hidden">
                          {service.image ? (
                            <img alt={service.service} className="w-full h-full object-cover" src={service.image} />
                          ) : (
                            <span className="material-symbols-outlined text-3xl">spa</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{service.service}</h4>
                          {service.description && (
                            <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span> {service.duration} мин
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">payments</span> {service.price.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`px-8 max-[480px]:px-6 max-[320px]:px-5 py-3 rounded-xl text-sm max-[480px]:w-full font-bold transition-all ${
                          selectedServices.includes(service.id)
                            ? "gradient-bg text-white"
                            : "border-2 border-primary/10 text-gradient hover:gradient-bg hover:text-white"
                        }`}
                      >
                        {selectedServices.includes(service.id) ? "Выбрано" : "Выбрать"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="max-w-6xl mx-auto flex items-center justify-between relative overflow-visible max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:gap-4">
              <div className="pointer-events-none absolute inset-0 overflow-visible z-20" aria-hidden="true">
                <img src="/star.svg" alt="" className="absolute -left-10 -top-10 w-10 h-10 sm:w-12 sm:h-12 opacity-15" />
                <img src="/star.svg" alt="" className="absolute -right-10 -bottom-10 w-12 h-12 sm:w-14 sm:h-14 opacity-15" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Выбрано услуг: {selectedServices.length}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  Итого: {totalPrice.toLocaleString()} ₽
                </p>
              </div>
              <button
                disabled={selectedServices.length === 0}
                onClick={handleNextStep}
                className={`gradient-bg px-12 max-[480px]:px-8 max-[320px]:px-6 py-4 max-[480px]:py-3.5 rounded-2xl text-white font-bold text-lg max-[480px]:text-base shadow-xl shadow-primary/20 max-[480px]:w-full transition-all flex items-center gap-2 justify-center ${
                  selectedServices.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                Продолжить
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </>
        )}

        {/* Шаг 2: Выбор даты и времени */}
        {step === 2 && selectedServiceObjects.length > 0 && (
          <>
            <div className="mb-12">
              <h2 className="text-5xl max-[480px]:text-3xl max-[320px]:text-2xl font-black tracking-tight text-slate-900 mb-4">
                Выбор даты и времени
              </h2>
              <p className="text-slate-500 text-lg max-[480px]:text-base">
                Выберите удобный день и время для вашего визита
              </p>
            </div>

            <BookingCalendar
              serviceId={selectedServiceObjects[0].id}
              master={selectedServiceObjects[0].master}
              onSlotSelect={handleSlotSelect}
            />

            <div className="mt-12 flex items-center justify-between max-[480px]:flex-col-reverse max-[480px]:items-stretch max-[480px]:gap-3">
              <button
                onClick={handlePreviousStep}
                className="px-8 max-[480px]:px-6 max-[320px]:px-5 py-4 max-[480px]:py-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-white transition-all flex items-center gap-2 max-[480px]:w-full max-[480px]:justify-center"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Назад
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleNextStep}
                className={`gradient-bg px-12 max-[480px]:px-8 max-[320px]:px-6 py-4 max-[480px]:py-3.5 rounded-2xl text-white font-bold text-lg max-[480px]:text-base shadow-xl shadow-primary/30 transition-transform flex items-center gap-2 max-[480px]:w-full max-[480px]:justify-center ${
                  !selectedDate || !selectedTime ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
                }`}
              >
                Продолжить
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </>
        )}

        {/* Шаг 3: Подтверждение */}
        {step === 3 && (
          <>
            <div className="mb-12">
              <h2 className="text-5xl max-[480px]:text-3xl max-[320px]:text-2xl font-black tracking-tight text-slate-900 mb-4">
                Подтверждение записи
              </h2>
              <p className="text-slate-500 text-lg max-[480px]:text-base">
                Пожалуйста, проверьте данные и введите контактную информацию
              </p>
            </div>

            <div className="glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5 lg:p-12 shadow-2xl border border-white/40 relative overflow-hidden">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-[480px]:gap-8 max-[320px]:gap-6">
                {/* Левая колонка - Детали заказа */}
                <div className="space-y-8">
                  <h3 className="text-xl font-bold border-b border-primary/10 pb-4">Детали заказа</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl gradient-bg text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">face_3</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Услуга</p>
                        {selectedServiceObjects.map(service => (
                          <p key={service.id} className="text-lg font-bold text-slate-900">{service.service}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-accent-pink/20 text-accent-pink flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">calendar_today</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Дата и Время</p>
                        <p className="text-lg font-bold text-slate-900 capitalize">{formatReadableDate(selectedDate)}</p>
                        <p className="text-base font-semibold text-primary mt-1">{selectedTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-accent-purple/20 text-accent-purple flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Стоимость</p>
                        <p className="text-2xl font-black text-gradient">{totalPrice.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 max-[480px]:p-5 max-[320px]:p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-sm leading-relaxed">
                    Нажимая кнопку "Подтвердить запись", вы соглашаетесь с правилами посещения студии и политикой конфиденциальности.
                  </div>
                </div>

                {/* Правая колонка - Форма */}
                <div className="space-y-8">
                  <h3 className="text-xl font-bold border-b border-primary/10 pb-4">Ваши данные</h3>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitBooking(); }}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="name">Имя и Фамилия</label>
                      <input
                        className="w-full px-5 py-4 max-[480px]:py-3.5 max-[320px]:py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400"
                        id="name"
                        placeholder="Александр Пушкин"
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="phone">Телефон</label>
                      <input
                        className="w-full px-5 py-4 max-[480px]:py-3.5 max-[320px]:py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400"
                        id="phone"
                        placeholder="+7 (___) ___-__-__"
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="comment">Комментарий (необязательно)</label>
                      <textarea
                        className="w-full px-5 py-4 max-[480px]:py-3.5 max-[320px]:py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400 min-h-[100px]"
                        id="comment"
                        placeholder="Дополнительные пожелания"
                        value={clientComment}
                        onChange={(e) => setClientComment(e.target.value)}
                      ></textarea>
                    </div>

                    {bookingError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {bookingError}
                      </div>
                    )}

                    {bookingSuccess && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                        ✅ Бронирование успешно создано!
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!clientName || !clientPhone || submitting}
                      className={`w-full gradient-bg py-5 max-[480px]:py-4 max-[320px]:py-3.5 rounded-2xl text-white font-black text-xl max-[480px]:text-lg max-[320px]:text-base shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 ${
                        !clientName || !clientPhone || submitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"
                      }`}
                    >
                      {submitting ? "Отправка..." : "Подтвердить запись"}
                      {!submitting && <span className="material-symbols-outlined">check_circle</span>}
                    </button>
                  </form>

                  <button
                    onClick={handlePreviousStep}
                    disabled={submitting}
                    className="w-full py-4 text-sm font-bold text-slate-400 hover:text-gradient transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Вернуться к выбору времени
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        </main>

        <Footer />
      </div>
    </>
  );
}
