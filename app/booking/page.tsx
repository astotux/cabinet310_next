"use client";

import { useState, useEffect, useRef } from "react";
import { IMaskInput } from 'react-imask';
import Footer from "@/components/Footer";
import BookingCalendar from "./components/BookingCalendar";
import Cookies from 'js-cookie';
import Link from "next/link";
import Image from "next/image";

interface Service {
  id: number;
  service: string;
  description: string;
  category: string;
  master: string;
  duration: number;
  price: number;
  oldPrice?: number | null;
  image: string | null;
}

type BookingStep = 1 | 2 | 3;

// Лайтбокс для карты с зумом и перетаскиванием
function MapLightbox({ onClose }: { onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const clampPos = (x: number, y: number, s: number) => {
    const maxX = Math.max(0, (s - 1) * 300);
    const maxY = Math.max(0, (s - 1) * 200);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.min(5, Math.max(1, scale - e.deltaY * 0.002));
    setScale(next);
    if (next === 1) setPos({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPos(p => clampPos(p.x + dx, p.y + dy, scale));
  };

  const onPointerUp = () => { dragging.current = false; };

  const zoom = (delta: number) => {
    const next = Math.min(5, Math.max(1, scale + delta));
    setScale(next);
    if (next === 1) setPos({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
        <span className="text-white/70 text-sm">Схема входа в студию</span>
        <div className="flex items-center gap-2">
          <button onClick={() => zoom(-0.5)} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors" aria-label="Уменьшить">
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>
          <span className="text-white/70 text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoom(0.5)} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors" aria-label="Увеличить">
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors ml-2" aria-label="Закрыть">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-hidden flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
      >
        <div style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transition: dragging.current ? 'none' : 'transform 0.15s ease', transformOrigin: 'center center' }}>
          <Image src="/inmap.png" alt="Схема входа в студию" width={1200} height={800} className="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-xl shadow-2xl select-none" draggable={false} />
        </div>
      </div>
      <p className="text-center text-white/40 text-xs pb-3 shrink-0">Колёсико или кнопки для зума · Перетащите для перемещения</p>
    </div>
  );
}

// Функция для форматирования длительности из минут
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} мин`;
  } else if (mins === 0) {
    return `${hours} ч`;
  } else {
    return `${hours} ч ${mins} мин`;
  }
};

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все услуги");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>(1);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  
  // Данные бронирования
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientComment, setClientComment] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [bookingError, setBookingError] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    
    // Загружаем состояние меню из localStorage
    const savedState = localStorage.getItem('mobileMenuVisible');
    if (savedState !== null) {
      setIsMenuVisible(savedState === 'true');
    }
  }, []);

  // Проверка существующей записи из куки после загрузки услуг
  useEffect(() => {
    if (services.length > 0) {
      checkExistingBooking();
    }
  }, [services]);

  // Проверка существующей записи из куки
  const checkExistingBooking = () => {
    const bookingData = Cookies.get('activeBooking');
    if (bookingData) {
      try {
        const booking = JSON.parse(bookingData);
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        const now = new Date();

        // Если время записи еще не прошло, показываем экран успешного бронирования
        if (bookingDateTime > now) {
          setSelectedServices(booking.serviceIds);
          setSelectedDate(booking.date);
          setSelectedTime(booking.time);
          setClientName(booking.clientName);
          setClientPhone(booking.clientPhone);
          setClientComment(booking.clientComment || "");
          setBookingSuccess(true);
        } else {
          // Время прошло, удаляем куки
          Cookies.remove('activeBooking');
        }
      } catch (error) {
        console.error("Ошибка при чтении данных бронирования:", error);
        Cookies.remove('activeBooking');
      }
    }
  };

  // Плавная прокрутка вверх при смене этапа
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [step]);

  // Автоматическая проверка истечения времени записи
  useEffect(() => {
    if (bookingSuccess) {
      const checkInterval = setInterval(() => {
        const bookingData = Cookies.get('activeBooking');
        if (bookingData) {
          try {
            const booking = JSON.parse(bookingData);
            const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
            const now = new Date();

            // Если время записи прошло, сбрасываем состояние
            if (bookingDateTime <= now) {
              Cookies.remove('activeBooking');
              setBookingSuccess(false);
              setStep(1);
              setSelectedServices([]);
              setSelectedDate("");
              setSelectedTime("");
              setClientName("");
              setClientPhone("");
              setClientComment("");
            }
          } catch (error) {
            console.error("Ошибка при проверке времени записи:", error);
          }
        }
      }, 60000); // Проверяем каждую минуту

      return () => clearInterval(checkInterval);
    }
  }, [bookingSuccess]);

  // Функция для переключения меню с сохранением в localStorage
  const toggleMenu = () => {
    const newState = !isMenuVisible;
    setIsMenuVisible(newState);
    localStorage.setItem('mobileMenuVisible', String(newState));
  };

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
    
    // Валидация телефона
    const phoneDigits = clientPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      setBookingError("Пожалуйста, введите полный номер телефона");
      return;
    }
    
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

      // Сохраняем данные бронирования в куки
      const bookingData = {
        serviceIds: selectedServices,
        date: selectedDate,
        time: selectedTime,
        clientName,
        clientPhone,
        clientComment,
      };
      
      // Устанавливаем куки с истечением через 30 дней
      Cookies.set('activeBooking', JSON.stringify(bookingData), { expires: 30 });

      setBookingSuccess(true);

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
                <img loading="lazy" src="/logo.svg" className="w-20 md:w-24 lg:w-28" alt="Logo" />
              </a>
            </div>
            <nav className="flex items-center gap-6 lg:gap-10">
              <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/">
                Главная
              </Link>
              <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/services">
                Услуги
              </Link>
              <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/reviews">
                Отзывы
              </Link>
              <Link className="text-xs lg:text-sm font-semibold hover:text-primary transition-colors" href="/contacts">
                Контакты
              </Link>
            </nav>
          </div>
        </div>

        <div className="md:hidden p-3 w-full flex justify-between items-center">
          
          <div className="w-10"></div>
          
          <div className="glass rounded-2xl px-4 py-3 inline-flex items-center justify-center">
            <a href="/">
              <img loading="lazy" src="/logo.svg" className="w-24" alt="Logo" />
            </a>
          </div>

          <button
            onClick={toggleMenu}
            className="glass rounded-xl p-2 flex items-center justify-center hover:bg-white/80 transition-colors"
            aria-label={isMenuVisible ? "Скрыть меню" : "Показать меню"}
          >
            <span className="material-symbols-outlined text-xl text-primary">
              {isMenuVisible ? "expand_more" : "expand_less"}
            </span>
          </button>

        </div>

        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isMenuVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-around m-3">
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/">
              <span className="material-symbols-outlined text-xl">home</span>
              <span>Главная</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/services">
              <span className="material-symbols-outlined text-xl">spa</span>
              <span>Услуги</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/reviews">
              <span className="material-symbols-outlined text-xl">star</span>
              <span>Отзывы</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-xs font-semibold hover:text-primary transition-colors" href="/contacts">
              <span className="material-symbols-outlined text-xl">account_box</span>
              <span>Контакты</span>
            </Link>
          </nav>
        </div>
      </header>

      <div className="font-display bg-background-light text-slate-900 min-h-screen overflow-x-hidden">
        <main className="max-w-6xl mx-auto px-6 max-[480px]:px-4 max-[320px]:px-3 py-12 max-[480px]:py-8 max-[320px]:py-6 pb-24 md:pb-12">
        
        {/* Экран успешного бронирования */}
        {bookingSuccess ? (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="glass rounded-3xl p-12 max-[480px]:p-8 max-[320px]:p-6 shadow-2xl border border-white/40 max-w-2xl w-full text-center relative overflow-hidden">

              <div className="relative z-10">
                {/* Иконка успеха */}
                <div className="size-24 mx-auto mb-8 rounded-full gradient-bg flex items-center justify-center shadow-xl shadow-primary/30">
                  <span className="material-symbols-outlined text-6xl text-white">check_circle</span>
                </div>

                {/* Заголовок */}
                <h2 className="text-4xl max-[480px]:text-3xl max-[320px]:text-2xl font-black tracking-tight text-slate-900 mb-4">
                  Запись успешно создана!
                </h2>

                {/* Описание */}
                <p className="text-lg max-[480px]:text-base text-slate-600 mb-8 leading-relaxed">
                  Спасибо за вашу запись! Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>

                {/* Детали бронирования */}
                <div className="bg-white/50 rounded-2xl p-6 max-[480px]:p-5 mb-8 space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl gradient-bg text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">face_3</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Услуги</p>
                      {selectedServiceObjects.map(service => (
                        <p key={service.id} className="text-base font-bold text-slate-900">{service.service}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">calendar_today</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Дата и время</p>
                      <p className="text-base font-bold text-slate-900 capitalize">{formatReadableDate(selectedDate)}, {selectedTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">person</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Контакт</p>
                      <p className="text-base font-bold text-slate-900">{clientName}</p>
                      <p className="text-sm text-slate-600">{clientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Как найти вход */}
                <div className="mb-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Как нас найти</p>
                  <button
                    onClick={() => setMapOpen(true)}
                    className="relative w-full rounded-2xl overflow-hidden border border-white/40 shadow-md hover:scale-[1.01] transition-transform group"
                    aria-label="Открыть схему входа"
                  >
                    <Image
                      src="/inmap.png"
                      alt="Схема входа в студию"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                        <span className="material-symbols-outlined text-slate-700">zoom_in</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Лайтбокс */}
                {mapOpen && <MapLightbox onClose={() => setMapOpen(false)} />}

                {/* Кнопка на главную */}
                <div className="flex gap-4 max-[480px]:flex-col">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-3 gradient-bg px-10 max-[480px]:px-8 py-4 max-[480px]:py-3.5 rounded-2xl text-white font-bold text-lg max-[480px]:text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                  >
                    <span className="material-symbols-outlined">home</span>
                    Вернуться на главную
                  </Link>
                  <button
                    onClick={() => {
                      Cookies.remove('activeBooking');
                      setBookingSuccess(false);
                      setStep(1);
                      setSelectedServices([]);
                      setSelectedDate("");
                      setSelectedTime("");
                      setClientName("");
                      setClientPhone("");
                      setClientComment("");
                    }}
                    className="inline-flex items-center justify-center gap-3 bg-white border-2 border-primary/20 px-10 max-[480px]:px-8 py-4 max-[480px]:py-3.5 rounded-2xl text-gradient font-bold text-lg max-[480px]:text-base hover:scale-[1.02] transition-transform"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Новая запись
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                        <div className="size-16 max-[480px]:size-14 rounded-2xl bg-white shadow-inner flex items-center justify-center text-primary overflow-hidden shrink-0">
                          {service.image ? (
                            <img loading="lazy" alt={service.service} className="w-full h-full object-cover" src={service.image} />
                          ) : (
                            <span className="material-symbols-outlined text-3xl">spa</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{service.service}</h4>
                          {service.description && (
                            <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <span className="material-symbols-outlined text-base">schedule</span>
                              <span className="font-medium">{formatDuration(service.duration)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base text-slate-600">payments</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className={`font-semibold text-slate-600 text-sm`}>
                                  {service.price.toLocaleString()} ₽
                                </span>
                                {service.oldPrice && (
                                  <span className="line-through text-slate-400 text-xs font-medium">
                                    {service.oldPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
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
                      <IMaskInput
                        mask="+7 (000) 000-00-00"
                        value={clientPhone}
                        onAccept={(value) => setClientPhone(value)}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-5 py-4 max-[480px]:py-3.5 max-[320px]:py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400"
                        id="phone"
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
                      disabled={!clientName || !clientPhone || !privacyConsent || submitting}
                      className={`w-full gradient-bg py-5 max-[480px]:py-4 max-[320px]:py-3.5 rounded-2xl text-white font-black text-xl max-[480px]:text-lg max-[320px]:text-base shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 ${
                        !clientName || !clientPhone || !privacyConsent || submitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"
                      }`}
                    >
                      {submitting ? "Отправка..." : "Подтвердить запись"}
                      {!submitting && <span className="material-symbols-outlined">check_circle</span>}
                    </button>

                    <div className="flex items-start gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="privacy-consent"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="mt-0.5 size-3.5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                        required
                      />
                      <label htmlFor="privacy-consent" className="text-xs text-slate-500 cursor-pointer leading-relaxed">
                        Я согласен(на) на{" "}
                        <Link 
                          href="/privacy" 
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          обработку персональных данных
                        </Link>
                      </label>
                    </div>
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
        </>
        )}
        </main>

        <Footer />
      </div>
    </>
  );
}
