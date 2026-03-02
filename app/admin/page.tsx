"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IMaskInput } from 'react-imask';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  
  // Состояние для модального окна записи
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    service: "",
    master: "",
    date: "",
    time: "",
    clientName: "",
    clientPhone: "",
    comment: "",
  });
  
  // Состояние для модального окна блокировки времени
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);
  const [blockTimeForm, setBlockTimeForm] = useState({
    master: "",
    date: "",
    selectedTimes: [] as string[],
    reason: "",
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  
  // Статистика
  const [todayBookingsLiza, setTodayBookingsLiza] = useState(0);
  const [todayBookingsZhenya, setTodayBookingsZhenya] = useState(0);
  const [selectedMasterForBookings, setSelectedMasterForBookings] = useState<'Лиза' | 'Женя'>('Лиза');
  const [monthRevenueLiza, setMonthRevenueLiza] = useState(0);
  const [monthRevenueZhenya, setMonthRevenueZhenya] = useState(0);
  const [selectedMasterForRevenue, setSelectedMasterForRevenue] = useState<'Лиза' | 'Женя'>('Лиза');
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  
  // Модальное окно статистики
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsViewMode, setStatsViewMode] = useState<'bookings' | 'revenue'>('bookings');
  const [statsMasterFilter, setStatsMasterFilter] = useState<'all' | 'Лиза' | 'Женя'>('all');
  
  const router = useRouter();
  
  // Состояние для календаря
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    // Создаем дату в полдень, чтобы избежать проблем с часовыми поясами
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  });
  
  // Функция для форматирования даты
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
  };
  
  // Функция для получения начала и конца недели
  const getWeekRange = (date: Date): { start: Date; end: Date } => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Понедельник как первый день
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  };
  
  // Функция для форматирования диапазона недели
  const formatWeekRange = (date: Date): string => {
    const { start, end } = getWeekRange(date);
    const startStr = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const endStr = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };
  
  // Навигация по календарю
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    const now = new Date();
    // Создаем дату в полдень, чтобы избежать проблем с часовыми поясами
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    setCurrentDate(today);
  };
  
  // Фильтрация записей по текущей дате/неделе
  const getFilteredBookings = () => {
    if (viewMode === 'day') {
      // Форматируем дату вручную, избегая проблем с часовыми поясами
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      return bookings.filter(b => b.date === dateStr);
    } else {
      const { start, end } = getWeekRange(currentDate);
      return bookings.filter(b => {
        // Парсим дату как локальную
        const [year, month, day] = b.date.split('-').map(Number);
        const bookingDate = new Date(year, month - 1, day);
        return bookingDate >= start && bookingDate <= end;
      }).sort((a, b) => {
        // Сортировка по дате, затем по времени
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.time.localeCompare(b.time);
      });
    }
  };

  // Функция для форматирования длительности из минут в читаемый формат
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
      
      // Подсчет статистики
      calculateStats(bookingsData, reviewsData, servicesData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setBookings([]);
      setReviews([]);
      setServices([]);
    }
  };

  const calculateStats = (bookingsData: any[], reviewsData: any[], servicesData: any[]) => {
    // Записей сегодня для каждого мастера
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayBookings = bookingsData.filter((b: any) => b.date === today);
    
    const lizaTodayBookings = todayBookings.filter((b: any) => b.master === 'Лиза');
    setTodayBookingsLiza(lizaTodayBookings.length);
    
    const zhenyaTodayBookings = todayBookings.filter((b: any) => b.master === 'Женя');
    setTodayBookingsZhenya(zhenyaTodayBookings.length);

    // Доход за текущий месяц для каждого мастера
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthBookings = bookingsData.filter((booking: any) => {
      // Парсим дату как локальную
      const [year, month] = booking.date.split('-').map(Number);
      return month - 1 === currentMonth && year === currentYear;
    });

    // Доход Лизы
    const lizaRevenue = monthBookings
      .filter((booking: any) => booking.master === 'Лиза')
      .reduce((sum: number, booking: any) => {
        const service = servicesData.find((s: any) => s.service === booking.service);
        return sum + (service?.price || 0);
      }, 0);
    setMonthRevenueLiza(lizaRevenue);

    // Доход Жени
    const zhenyaRevenue = monthBookings
      .filter((booking: any) => booking.master === 'Женя')
      .reduce((sum: number, booking: any) => {
        const service = servicesData.find((s: any) => s.service === booking.service);
        return sum + (service?.price || 0);
      }, 0);
    setMonthRevenueZhenya(zhenyaRevenue);

    // Отзывов на модерации
    const pendingReviews = reviewsData.filter((r: any) => !r.approved);
    setPendingReviewsCount(pendingReviews.length);
  };

  // Подготовка данных для графика
  const getChartData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const data = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let dayBookings = bookings.filter((b: any) => b.date === dateStr);
      
      // Фильтрация по мастеру
      if (statsMasterFilter !== 'all') {
        dayBookings = dayBookings.filter((b: any) => b.master === statsMasterFilter);
      }
      
      // Создаем дату локально, избегая проблем с часовыми поясами
      const localDate = new Date(currentYear, currentMonth, day);
      const monthLabel = localDate.toLocaleDateString('ru-RU', { month: 'short' });
      
      if (statsViewMode === 'bookings') {
        data.push({
          day,
          value: dayBookings.length,
          label: `${day} ${monthLabel}`
        });
      } else {
        const dayRevenue = dayBookings.reduce((sum: number, booking: any) => {
          const service = services.find((s: any) => s.service === booking.service);
          return sum + (service?.price || 0);
        }, 0);
        data.push({
          day,
          value: dayRevenue,
          label: `${day} ${monthLabel}`
        });
      }
    }
    
    return data;
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

  // Функции для работы с записями
  const openAddBookingModal = () => {
    setEditingBooking(null);
    setBookingForm({
      service: "",
      master: "",
      date: "",
      time: "",
      clientName: "",
      clientPhone: "",
      comment: "",
    });
    setShowBookingModal(true);
  };

  const openEditBookingModal = (booking: any) => {
    setEditingBooking(booking);
    setBookingForm({
      service: booking.service,
      master: booking.master,
      date: booking.date,
      time: booking.time,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      comment: booking.comment || "",
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация телефона
    const phoneDigits = bookingForm.clientPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      alert("Пожалуйста, введите полный номер телефона");
      return;
    }

    try {
      if (editingBooking) {
        await fetch(`/api/bookings/${editingBooking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingForm),
        });
      } else {
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingForm),
        });
      }
      setShowBookingModal(false);
      fetchData();
    } catch (error) {
      alert("Ошибка сохранения записи");
    }
  };

  // Функции для блокировки времени
  const openBlockTimeModal = () => {
    setBlockTimeForm({
      master: "",
      date: "",
      selectedTimes: [],
      reason: "",
    });
    setAvailableSlots([]);
    setCurrentMonth(new Date());
    setSelectedCalendarDate(null);
    setShowBlockTimeModal(true);
  };

  // Функции для календаря
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedCalendarDate(date);
    // Форматируем дату правильно, избегая проблем с часовыми поясами
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setBlockTimeForm(prev => ({ ...prev, date: dateStr }));
    if (blockTimeForm.master) {
      loadAvailableSlots(dateStr);
    }
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const isPast = date < today;
      
      // Сравниваем даты правильно
      const isSelected = selectedCalendarDate && 
        date.getFullYear() === selectedCalendarDate.getFullYear() &&
        date.getMonth() === selectedCalendarDate.getMonth() &&
        date.getDate() === selectedCalendarDate.getDate();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isPast && handleDateSelect(date)}
          disabled={isPast}
          className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-all ${
            isSelected
              ? "gradient-bg text-white shadow-lg shadow-primary/20"
              : isPast
              ? "text-slate-300 cursor-not-allowed"
              : "hover:bg-white cursor-pointer"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatMonthYear = () => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const loadAvailableSlots = async (date: string, master?: string) => {
    const currentMaster = master || blockTimeForm.master;
    if (!date || !currentMaster) return;
    
    setLoadingSlots(true);
    try {
      // Генерируем все возможные слоты (09:00 - 20:00 с шагом 60 минут)
      const slots: string[] = [];
      for (let hour = 9; hour < 20; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      
      // Загружаем заблокированные слоты для выбранного мастера и даты
      const blockedRes = await fetch('/api/blocked-slots');
      const blockedData = await blockedRes.json();
      
      // Фильтруем заблокированные слоты для текущего мастера и даты
      const blockedForDate = blockedData
        .filter((slot: any) => slot.master === currentMaster && slot.date === date)
        .map((slot: any) => slot.time);
      
      // Автоматически выбираем уже заблокированные слоты
      setBlockTimeForm(prev => ({
        ...prev,
        selectedTimes: blockedForDate
      }));
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Ошибка загрузки слотов:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const toggleTimeSlot = (time: string) => {
    setBlockTimeForm(prev => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(time)
        ? prev.selectedTimes.filter(t => t !== time)
        : [...prev.selectedTimes, time]
    }));
  };

  const selectAllSlots = () => {
    setBlockTimeForm(prev => ({
      ...prev,
      selectedTimes: [...availableSlots]
    }));
  };

  const selectAllSlotsUntilEndOfMonth = async () => {
    if (!blockTimeForm.master || !selectedCalendarDate || blockTimeForm.selectedTimes.length === 0) {
      alert('Сначала выберите хотя бы один временной слот');
      return;
    }

    const selectedDate = new Date(selectedCalendarDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = selectedDate.getDate();

    // Собираем только выбранные слоты для всех дней до конца месяца
    const allSlots: { date: string; time: string }[] = [];
    
    for (let day = currentDay; day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day);
      const dateYear = date.getFullYear();
      const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
      const dateDay = String(date.getDate()).padStart(2, '0');
      const dateStr = `${dateYear}-${dateMonth}-${dateDay}`;
      
      // Добавляем только выбранные временные слоты для этого дня
      blockTimeForm.selectedTimes.forEach(time => {
        allSlots.push({ date: dateStr, time });
      });
    }

    // Загружаем существующие блокировки для этого периода
    try {
      const blockedRes = await fetch('/api/blocked-slots');
      const blockedData = await blockedRes.json();
      
      // Фильтруем существующие блокировки для текущего мастера и периода
      const existingBlocks = blockedData.filter((slot: any) => {
        if (slot.master !== blockTimeForm.master) return false;
        // Парсим дату как локальную
        const [slotYear, slotMonth, slotDay] = slot.date.split('-').map(Number);
        const slotDate = new Date(slotYear, slotMonth - 1, slotDay);
        return slotDate >= selectedDate && slotDate.getMonth() === month;
      });

      // Создаем новые блокировки только для тех слотов, которых еще нет
      const createPromises = allSlots.map(slot => {
        // Проверяем, не существует ли уже такая блокировка
        const exists = existingBlocks.some(
          (existing: any) => existing.date === slot.date && existing.time === slot.time
        );
        
        if (!exists) {
          return fetch('/api/blocked-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              master: blockTimeForm.master,
              date: slot.date,
              time: slot.time,
              reason: blockTimeForm.reason || null,
            }),
          });
        }
        return Promise.resolve({ ok: true });
      });

      const responses = await Promise.all(createPromises);
      const newBlocksCount = responses.filter(r => r && r.ok).length;

      const daysCount = lastDayOfMonth - currentDay + 1;
      const timeSlotsCount = blockTimeForm.selectedTimes.length;
      
      alert(`Успешно заблокированы слоты:\n${timeSlotsCount} временных слота × ${daysCount} дней = ${timeSlotsCount * daysCount} блокировок`);
      fetchData();
    } catch (error) {
      console.error('Ошибка блокировки слотов:', error);
      alert('Ошибка при блокировке слотов до конца месяца');
    }
  };

  const handleBlockTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (blockTimeForm.selectedTimes.length === 0) {
      alert('Выберите хотя бы один временной слот');
      return;
    }

    try {
      // Загружаем текущие заблокированные слоты
      const blockedRes = await fetch('/api/blocked-slots');
      const blockedData = await blockedRes.json();
      
      // Находим существующие блокировки для этого мастера и даты
      const existingBlocks = blockedData.filter(
        (slot: any) => slot.master === blockTimeForm.master && slot.date === blockTimeForm.date
      );
      
      const existingTimes = existingBlocks.map((slot: any) => slot.time);
      
      // Определяем, какие слоты нужно добавить, а какие удалить
      const timesToAdd = blockTimeForm.selectedTimes.filter(time => !existingTimes.includes(time));
      const timesToRemove = existingBlocks.filter(
        (slot: any) => !blockTimeForm.selectedTimes.includes(slot.time)
      );

      // Создаем новые блокировки
      const addPromises = timesToAdd.map(time =>
        fetch('/api/blocked-slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            master: blockTimeForm.master,
            date: blockTimeForm.date,
            time,
            reason: blockTimeForm.reason || null,
          }),
        })
      );

      // Удаляем снятые блокировки
      const removePromises = timesToRemove.map((slot: any) =>
        fetch(`/api/blocked-slots?id=${slot.id}`, {
          method: 'DELETE',
        })
      );

      const responses = await Promise.all([...addPromises, ...removePromises]);
      const allSuccessful = responses.every(r => r.ok);

      if (!allSuccessful) {
        throw new Error('Ошибка обновления блокировок');
      }

      const message = [];
      if (timesToAdd.length > 0) message.push(`добавлено ${timesToAdd.length}`);
      if (timesToRemove.length > 0) message.push(`удалено ${timesToRemove.length}`);
      
      alert(`Успешно обновлено: ${message.join(', ')} слотов`);
      setShowBlockTimeModal(false);
      fetchData();
    } catch (error) {
      console.error('Ошибка блокировки времени:', error);
      alert('Ошибка при блокировке времени');
    }
  };

  // Функция экспорта записей в PDF
  const handleExportPDF = async () => {
    try {
      // Проверяем, есть ли записи
      if (!bookings || bookings.length === 0) {
        alert('Нет записей для экспорта');
        return;
      }

      // Получаем текущий месяц и год
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Фильтруем записи за текущий месяц
      const monthBookings = bookings.filter(booking => {
        // Парсим дату как локальную
        const [year, month] = booking.date.split('-').map(Number);
        return month - 1 === currentMonth && year === currentYear;
      });

      if (monthBookings.length === 0) {
        alert('Нет записей за текущий месяц');
        return;
      }

      // Динамический импорт pdfmake
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule: any = await import('pdfmake/build/vfs_fonts');
      const pdfMake = pdfMakeModule.default || pdfMakeModule;
      const vfs = pdfFontsModule.default?.pdfMake?.vfs || pdfFontsModule.pdfMake?.vfs;
      
      if (pdfMake && vfs) {
        (pdfMake as any).vfs = vfs;
      }

      // Названия месяцев на русском
      const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];

      // Сортируем записи
      const sortedBookings = monthBookings.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });

      // Подготавливаем данные для таблицы
      const tableBody = [
        // Заголовок таблицы
        [
          { text: 'Дата', style: 'tableHeader' },
          { text: 'Время', style: 'tableHeader' },
          { text: 'Услуга', style: 'tableHeader' },
          { text: 'Мастер', style: 'tableHeader' },
          { text: 'Клиент', style: 'tableHeader' },
          { text: 'Телефон', style: 'tableHeader' },
          { text: 'Комментарий', style: 'tableHeader' }
        ],
        // Данные
        ...sortedBookings.map(booking => {
          // Парсим дату как локальную
          const [year, month, day] = booking.date.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
          
          return [
            { text: formattedDate, alignment: 'center' },
            { text: booking.time, alignment: 'center' },
            booking.service,
            { text: booking.master, alignment: 'center' },
            booking.clientName,
            booking.clientPhone,
            booking.comment || '-'
          ];
        })
      ];

      // Определяем документ
      const docDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: `Записи за ${monthNames[currentMonth]} ${currentYear}`,
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          {
            text: `Всего записей: ${sortedBookings.length}`,
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 5]
          },
          {
            text: 'Кабинет 310 - Студия эстетики',
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: [50, 45, '*', 60, 80, 75, 80],
              body: tableBody
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#9333ea' : (rowIndex % 2 === 0 ? '#f9fafb' : null);
              },
              hLineWidth: function () { return 0.5; },
              vLineWidth: function () { return 0.5; },
              hLineColor: function () { return '#e5e7eb'; },
              vLineColor: function () { return '#e5e7eb'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#1f2937'
          },
          subheader: {
            fontSize: 10,
            color: '#6b7280'
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: 'white',
            alignment: 'center'
          }
        },
        defaultStyle: {
          fontSize: 8,
          font: 'Roboto'
        },
        footer: function(currentPage: number, pageCount: number) {
          return {
            columns: [
              {
                text: `Создано: ${now.toLocaleDateString('ru-RU')}`,
                alignment: 'left',
                fontSize: 8,
                color: '#6b7280',
                margin: [40, 0]
              },
              {
                text: `Страница ${currentPage} из ${pageCount}`,
                alignment: 'center',
                fontSize: 8,
                color: '#6b7280'
              },
              {
                text: '',
                alignment: 'right',
                margin: [0, 0, 40, 0]
              }
            ]
          };
        }
      };

      // Создаем и скачиваем PDF
      const fileName = `записи_${monthNames[currentMonth]}_${currentYear}.pdf`;
      (pdfMake as any).createPdf(docDefinition).download(fileName);

    } catch (error) {
      console.error('Ошибка экспорта PDF:', error);
      alert(`Ошибка при создании PDF файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  // Функция для форматирования даты в читаемый формат
  const formatReadableDate = (dateStr: string): string => {
    // Парсим дату как локальную, избегая проблем с часовыми поясами
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long',
    };
    return date.toLocaleDateString('ru-RU', options);
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
              <span className="text-2xl font-black text-gradient">
                {selectedMasterForBookings === 'Лиза' ? todayBookingsLiza : todayBookingsZhenya}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Записей сегодня</h3>
              <div className="flex gap-1 bg-white rounded-lg p-1">
                <button
                  onClick={() => setSelectedMasterForBookings('Лиза')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    selectedMasterForBookings === 'Лиза'
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Лиза
                </button>
                <button
                  onClick={() => setSelectedMasterForBookings('Женя')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    selectedMasterForBookings === 'Женя'
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Женя
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">На {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</p>
          </div>

          <div className="service-card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-2xl bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-2xl font-black text-gradient">
                {selectedMasterForRevenue === 'Лиза' ? monthRevenueLiza.toLocaleString() : monthRevenueZhenya.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Доход за месяц</h3>
              <div className="flex gap-1 bg-white rounded-lg p-1">
                <button
                  onClick={() => setSelectedMasterForRevenue('Лиза')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    selectedMasterForRevenue === 'Лиза'
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Лиза
                </button>
                <button
                  onClick={() => setSelectedMasterForRevenue('Женя')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    selectedMasterForRevenue === 'Женя'
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Женя
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">{new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="service-card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-2xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                <span className="material-symbols-outlined">rate_review</span>
              </div>
              <span className="text-2xl font-black text-gradient">{pendingReviewsCount}</span>
            </div>
            <h3 className="font-bold mb-1">Отзывов на модерации</h3>
            <p className="text-xs text-slate-500">Требуют одобрения</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="service-card-glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl max-[480px]:text-xl font-black tracking-tight">Календарь записей</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setViewMode('day');
                      const now = new Date();
                      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
                      setCurrentDate(today);
                    }}
                    className={`px-4 py-2 max-[480px]:px-3 max-[480px]:py-1.5 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-colors ${
                      viewMode === 'day'
                        ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                        : 'border border-slate-200 hover:border-primary'
                    }`}
                  >
                    Сегодня
                  </button>
                  <button 
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-2 max-[480px]:px-3 max-[480px]:py-1.5 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-colors ${
                      viewMode === 'week'
                        ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                        : 'border border-slate-200 hover:border-primary'
                    }`}
                  >
                    Неделя
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                  <button 
                    onClick={navigatePrevious}
                    className="size-10 max-[480px]:size-9 rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <span className="material-symbols-outlined max-[480px]:text-lg">chevron_left</span>
                  </button>
                  <h3 className="text-lg max-[480px]:text-sm font-bold min-w-[200px] max-[480px]:min-w-[150px] text-center">
                    {viewMode === 'day' ? formatDate(currentDate) : formatWeekRange(currentDate)}
                  </h3>
                  <button 
                    onClick={navigateNext}
                    className="size-10 max-[480px]:size-9 rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <span className="material-symbols-outlined max-[480px]:text-lg">chevron_right</span>
                  </button>
                </div>
                <button 
                  onClick={openBlockTimeModal}
                  className="px-4 py-2 max-[480px]:px-3 max-[480px]:py-2 rounded-xl gradient-bg text-white text-sm max-[480px]:text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined max-[480px]:text-base">block</span>
                  <span className="max-[480px]:hidden">Заблокировать время</span>
                  <span className="hidden max-[480px]:inline">Блокировка</span>
                </button>
              </div>

              <div className="space-y-3">
                {getFilteredBookings().length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    {viewMode === 'day' ? 'Записей на этот день нет' : 'Записей на эту неделю нет'}
                  </p>
                ) : (
                  getFilteredBookings().map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 max-[480px]:p-3 rounded-2xl bg-white/60 border border-slate-200/60">
                      <div className="text-center sm:text-left min-w-[80px] max-[480px]:min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Дата</p>
                        <p className="text-sm font-bold text-slate-700">{formatReadableDate(booking.date)}</p>
                        <p className="text-lg font-black text-primary mt-1">{booking.time}</p>
                      </div>
                      <div className="hidden sm:block h-16 w-px bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-sm text-accent-pink">face_3</span>
                          <h4 className="font-bold text-sm sm:text-base">{booking.service}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {booking.master}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{booking.clientName} • {booking.clientPhone}</p>
                        {booking.comment && (
                          <p className="text-sm text-slate-500 italic mt-1">💬 {booking.comment}</p>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end sm:justify-start">
                        <button 
                          onClick={() => openEditBookingModal(booking)}
                          className="size-9 max-[480px]:size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg max-[480px]:text-base">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="size-9 max-[480px]:size-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg max-[480px]:text-base">close</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <button 
                  onClick={openAddBookingModal}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="font-semibold">Добавить запись</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="service-card-glass rounded-3xl p-6 max-[480px]:p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl max-[480px]:text-lg font-black tracking-tight">Быстрые действия</h2>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowStatsModal(true)}
                  className="w-full p-4 max-[480px]:p-3 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-primary transition-colors flex items-center gap-3"
                >
                  <div className="size-10 max-[480px]:size-9 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white flex items-center justify-center">
                    <span className="material-symbols-outlined max-[480px]:text-lg">analytics</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm max-[480px]:text-xs">Статистика</p>
                    <p className="text-xs max-[480px]:text-[10px] text-slate-500">График за месяц</p>
                  </div>
                </button>

                <button 
                  onClick={handleExportPDF}
                  className="w-full p-4 max-[480px]:p-3 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-primary transition-colors flex items-center gap-3"
                >
                  <div className="size-10 max-[480px]:size-9 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                    <span className="material-symbols-outlined max-[480px]:text-lg">download</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm max-[480px]:text-xs">Экспорт записей</p>
                    <p className="text-xs max-[480px]:text-[10px] text-slate-500">За текущий месяц</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="service-card-glass rounded-3xl p-6 max-[480px]:p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl max-[480px]:text-lg font-black tracking-tight">Отзывы на модерации</h2>
              </div>
              <div className="space-y-3">
                {reviews.filter(r => !r.approved).length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Нет отзывов</p>
                ) : (
                  reviews.filter(r => !r.approved).slice(0, 3).map((review) => (
                    <div key={review.id} className="p-3 max-[480px]:p-2 rounded-xl bg-white/60 border border-slate-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-sm max-[480px]:text-xs text-primary">person</span>
                        <span className="text-xs max-[480px]:text-[10px] font-bold text-slate-400">{review.name}</span>
                      </div>
                      <p className="font-bold text-sm max-[480px]:text-xs mb-1">{review.text.substring(0, 50)}...</p>
                      <button
                        onClick={() => approveReview(review.id)}
                        className="text-xs max-[480px]:text-[10px] text-primary font-bold hover:underline"
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl max-[480px]:text-xl font-black tracking-tight">Управление ценами</h2>
            <button 
              onClick={openAddServiceModal}
              className="px-4 py-2 rounded-xl gradient-bg text-white text-sm max-[480px]:text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              + Добавить услугу
            </button>
          </div>

          {/* Десктопная таблица */}
          <div className="hidden lg:block overflow-x-auto">
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
                        <span className="text-sm font-semibold">{formatDuration(service.duration)}</span>
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

          {/* Мобильные карточки */}
          <div className="lg:hidden space-y-4">
            {services.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Услуг пока нет</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="p-4 rounded-2xl bg-white/60 border border-slate-200/60">
                  <div className="flex items-start gap-3 mb-3">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.service}
                        className="size-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="size-16 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">spa</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{service.service}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                          {service.category}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-xs text-slate-500 mb-2">{service.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          service.master.includes('А') 
                            ? 'bg-accent-purple/10 text-accent-purple' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {service.master}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {formatDuration(service.duration)}
                        </span>
                        <span className="text-base font-black text-gradient">
                          {service.price.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button 
                      onClick={() => openEditServiceModal(service)}
                      className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      <span>Изменить</span>
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-3xl p-8 max-[480px]:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl max-[480px]:text-xl font-black">
                {editingService ? "Редактировать услугу" : "Добавить услугу"}
              </h2>
              <button
                onClick={() => setShowServiceModal(false)}
                className="size-10 max-[480px]:size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined max-[480px]:text-lg">close</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Мастер *</label>
                  <select
                    value={serviceForm.master}
                    onChange={(e) => setServiceForm({ ...serviceForm, master: e.target.value })}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <option value="">Выберите мастера</option>
                    <option value="Лиза">Лиза</option>
                    <option value="Женя">Женя</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Длительность (минуты) *</label>
                  <input
                    type="number"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                    min="1"
                    step="1"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="90"
                  />
                  <p className="text-xs text-slate-500 mt-1">Укажите длительность в минутах (например: 90 для 1.5 часа)</p>
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

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-3xl p-8 max-[480px]:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl max-[480px]:text-xl font-black">
                {editingBooking ? "Редактировать запись" : "Добавить запись"}
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="size-10 max-[480px]:size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined max-[480px]:text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Услуга *</label>
                <select
                  value={bookingForm.service}
                  onChange={(e) => {
                    const selectedService = services.find(s => s.service === e.target.value);
                    setBookingForm({ 
                      ...bookingForm, 
                      service: e.target.value,
                      master: selectedService ? selectedService.master : ""
                    });
                  }}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  <option value="">Выберите услугу</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.service}>
                      {service.service} ({service.master})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Мастер *</label>
                <input
                  type="text"
                  value={bookingForm.master}
                  readOnly
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                  placeholder="Выберите услугу"
                />
                <p className="text-xs text-slate-500 mt-1">Мастер определяется автоматически при выборе услуги</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Дата *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Время *</label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Имя клиента *</label>
                <input
                  type="text"
                  value={bookingForm.clientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Александр Пушкин"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Телефон клиента *</label>
                <IMaskInput
                  mask="+7 (000) 000-00-00"
                  value={bookingForm.clientPhone}
                  onAccept={(value) => setBookingForm({ ...bookingForm, clientPhone: value })}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Комментарий</label>
                <textarea
                  value={bookingForm.comment}
                  onChange={(e) => setBookingForm({ ...bookingForm, comment: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
                  placeholder="Дополнительные пожелания клиента"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg px-6 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
                >
                  {editingBooking ? "Сохранить" : "Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlockTimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-3xl p-8 max-[480px]:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl max-[480px]:text-xl font-black">Заблокировать время</h2>
              <button
                onClick={() => setShowBlockTimeModal(false)}
                className="size-10 max-[480px]:size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined max-[480px]:text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleBlockTimeSubmit} className="space-y-6">
              {/* Выбор мастера */}
              <div>
                <label className="block text-sm font-bold mb-3">Мастер *</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBlockTimeForm(prev => ({ ...prev, master: "Лиза" }));
                      if (blockTimeForm.date) {
                        loadAvailableSlots(blockTimeForm.date, "Лиза");
                      }
                    }}
                    className={`flex-1 p-4 rounded-2xl font-bold transition-all ${
                      blockTimeForm.master === "Лиза"
                        ? "gradient-bg text-white shadow-lg shadow-primary/20"
                        : "bg-white border-2 border-slate-200 hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">face_3</span>
                      <span>Лиза</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBlockTimeForm(prev => ({ ...prev, master: "Женя" }));
                      if (blockTimeForm.date) {
                        loadAvailableSlots(blockTimeForm.date, "Женя");
                      }
                    }}
                    className={`flex-1 p-4 rounded-2xl font-bold transition-all ${
                      blockTimeForm.master === "Женя"
                        ? "gradient-bg text-white shadow-lg shadow-primary/20"
                        : "bg-white border-2 border-slate-200 hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">face_3</span>
                      <span>Женя</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Календарь и временные слоты */}
              <div className="glass rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Календарь */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">{formatMonthYear()}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePreviousMonth}
                        className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  {/* Заголовки дней недели */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Пн</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Вт</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Ср</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Чт</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Пт</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Сб</div>
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Вс</div>
                  </div>

                  {/* Сетка календаря */}
                  <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                  </div>
                </div>

                {/* Временные слоты */}
                <div className="lg:col-span-5 flex flex-col border-t border-slate-200/50 pt-8 lg:pt-0 lg:border-t-0 lg:border-l lg:border-slate-200/50 pl-0 lg:pl-8">
                  <div className="mb-6">
                    <h3 className="text-xl max-[480px]:text-lg font-bold mb-1">Выберите время</h3>
                    {selectedCalendarDate && (
                      <p className="text-sm max-[480px]:text-xs text-slate-500">
                        {selectedCalendarDate.toLocaleDateString('ru-RU', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    )}
                  </div>

                  {!blockTimeForm.master ? (
                    <div className="flex-grow flex items-center justify-center text-slate-400">
                      <p className="text-center text-sm">Выберите мастера</p>
                    </div>
                  ) : !selectedCalendarDate ? (
                    <div className="flex-grow flex items-center justify-center text-slate-400">
                      <p className="text-center text-sm">Выберите дату в календаре</p>
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex-grow flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <p className="text-slate-500 text-sm">Загрузка...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow overflow-y-auto space-y-6">
                      {/* Утро */}
                      {availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 9 && hour < 12;
                      }).length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Утро</h4>
                          <div className="grid grid-cols-3 max-[480px]:grid-cols-2 gap-2">
                            {availableSlots.filter(slot => {
                              const hour = parseInt(slot.split(':')[0]);
                              return hour >= 9 && hour < 12;
                            }).map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => toggleTimeSlot(slot)}
                                className={`py-3 max-[480px]:py-2 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                                  blockTimeForm.selectedTimes.includes(slot)
                                    ? 'gradient-bg text-white shadow-lg shadow-primary/20'
                                    : 'bg-white border border-slate-200 hover:border-primary'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* День */}
                      {availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 12 && hour < 17;
                      }).length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">День</h4>
                          <div className="grid grid-cols-3 max-[480px]:grid-cols-2 gap-2">
                            {availableSlots.filter(slot => {
                              const hour = parseInt(slot.split(':')[0]);
                              return hour >= 12 && hour < 17;
                            }).map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => toggleTimeSlot(slot)}
                                className={`py-3 max-[480px]:py-2 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                                  blockTimeForm.selectedTimes.includes(slot)
                                    ? 'gradient-bg text-white shadow-lg shadow-primary/20'
                                    : 'bg-white border border-slate-200 hover:border-primary'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Вечер */}
                      {availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 17 && hour < 20;
                      }).length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Вечер</h4>
                          <div className="grid grid-cols-3 max-[480px]:grid-cols-2 gap-2">
                            {availableSlots.filter(slot => {
                              const hour = parseInt(slot.split(':')[0]);
                              return hour >= 17 && hour < 20;
                            }).map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => toggleTimeSlot(slot)}
                                className={`py-3 max-[480px]:py-2 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                                  blockTimeForm.selectedTimes.includes(slot)
                                    ? 'gradient-bg text-white shadow-lg shadow-primary/20'
                                    : 'bg-white border border-slate-200 hover:border-primary'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableSlots.length > 0 && (
                        <div className="pt-4 border-t border-slate-200 space-y-3">
                          {blockTimeForm.selectedTimes.length > 0 && (
                            <p className="text-sm font-semibold text-center">
                              Выбрано слотов: <span className="text-primary">{blockTimeForm.selectedTimes.length}</span>
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={selectAllSlots}
                              className="flex-1 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                            >
                              Выбрать все
                            </button>
                            <button
                              type="button"
                              onClick={selectAllSlotsUntilEndOfMonth}
                              disabled={blockTimeForm.selectedTimes.length === 0}
                              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                blockTimeForm.selectedTimes.length === 0
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20'
                              }`}
                            >
                              До конца месяца
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Причина */}
              <div>
                <label className="block text-sm font-bold mb-2">Причина (необязательно)</label>
                <textarea
                  value={blockTimeForm.reason}
                  onChange={(e) => setBlockTimeForm({ ...blockTimeForm, reason: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[80px]"
                  placeholder="Например: Обеденный перерыв, Выходной"
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBlockTimeModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!blockTimeForm.master || !blockTimeForm.date || blockTimeForm.selectedTimes.length === 0}
                  className={`flex-1 gradient-bg px-6 py-3 rounded-xl text-white font-bold transition-opacity ${
                    !blockTimeForm.master || !blockTimeForm.date || blockTimeForm.selectedTimes.length === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:opacity-90'
                  }`}
                >
                  Сохранить ({blockTimeForm.selectedTimes.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-light rounded-3xl p-8 max-[480px]:p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl max-[480px]:text-xl font-black">Статистика за месяц</h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className="size-10 max-[480px]:size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined max-[480px]:text-lg">close</span>
              </button>
            </div>

            {/* Переключатель режима */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={() => setStatsViewMode('bookings')}
                className={`flex-1 p-4 max-[480px]:p-3 rounded-2xl font-bold transition-all ${
                  statsViewMode === 'bookings'
                    ? 'gradient-bg text-white shadow-lg shadow-primary/20'
                    : 'bg-white border-2 border-slate-200 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined max-[480px]:text-lg">event</span>
                  <span className="text-sm sm:text-base">Записи по дням</span>
                </div>
              </button>
              <button
                onClick={() => setStatsViewMode('revenue')}
                className={`flex-1 p-4 max-[480px]:p-3 rounded-2xl font-bold transition-all ${
                  statsViewMode === 'revenue'
                    ? 'gradient-bg text-white shadow-lg shadow-primary/20'
                    : 'bg-white border-2 border-slate-200 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined max-[480px]:text-lg">payments</span>
                  <span className="text-sm sm:text-base">Доход по дням</span>
                </div>
              </button>
            </div>

            {/* Переключатель мастера */}
            <div className="flex gap-2 mb-8 justify-center flex-wrap">
              <button
                onClick={() => setStatsMasterFilter('all')}
                className={`px-6 py-2 max-[480px]:px-4 max-[480px]:py-1.5 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                  statsMasterFilter === 'all'
                    ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                    : 'bg-white border border-slate-200 hover:border-primary'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setStatsMasterFilter('Лиза')}
                className={`px-6 py-2 max-[480px]:px-4 max-[480px]:py-1.5 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                  statsMasterFilter === 'Лиза'
                    ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                    : 'bg-white border border-slate-200 hover:border-primary'
                }`}
              >
                Лиза
              </button>
              <button
                onClick={() => setStatsMasterFilter('Женя')}
                className={`px-6 py-2 max-[480px]:px-4 max-[480px]:py-1.5 rounded-xl text-sm max-[480px]:text-xs font-semibold transition-all ${
                  statsMasterFilter === 'Женя'
                    ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                    : 'bg-white border border-slate-200 hover:border-primary'
                }`}
              >
                Женя
              </button>
            </div>

            {/* График */}
            <div className="glass rounded-2xl p-6 max-[480px]:p-4">
              <h3 className="text-lg max-[480px]:text-base font-bold mb-6">
                {statsViewMode === 'bookings' ? 'Количество записей' : 'Доход в рублях'}
              </h3>
              <div className="h-80 max-[480px]:h-64">
                <Line
                  data={{
                    labels: getChartData().map(d => d.label),
                    datasets: [
                      {
                        label: statsViewMode === 'bookings' ? 'Записей' : 'Доход (₽)',
                        data: getChartData().map(d => d.value),
                        borderColor: 'rgb(147, 51, 234)',
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: 'rgb(147, 51, 234)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14,
                          weight: 'bold',
                        },
                        bodyFont: {
                          size: 13,
                        },
                        callbacks: {
                          label: function(context) {
                            const value = context.parsed.y;
                            if (value === null) return '';
                            if (statsViewMode === 'revenue') {
                              return `${value.toLocaleString()} ₽`;
                            }
                            return `${value} ${value === 1 ? 'запись' : 'записей'}`;
                          }
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            if (statsViewMode === 'revenue') {
                              return value.toLocaleString() + ' ₽';
                            }
                            return value;
                          },
                          font: {
                            size: 12,
                          },
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                      },
                      x: {
                        ticks: {
                          font: {
                            size: 11,
                          },
                          maxRotation: 0,
                          autoSkip: true,
                          maxTicksLimit: 15,
                        },
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
              
              {/* Итоги */}
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-[480px]:gap-2">
                <div className="text-center">
                  <p className="text-xs max-[480px]:text-[10px] text-slate-400 uppercase tracking-widest mb-1">Всего</p>
                  <p className="text-2xl max-[480px]:text-lg font-black text-gradient">
                    {statsViewMode === 'bookings'
                      ? getChartData().reduce((sum, d) => sum + d.value, 0)
                      : `${getChartData().reduce((sum, d) => sum + d.value, 0).toLocaleString()} ₽`
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs max-[480px]:text-[10px] text-slate-400 uppercase tracking-widest mb-1">Среднее</p>
                  <p className="text-2xl max-[480px]:text-lg font-black text-gradient">
                    {statsViewMode === 'bookings'
                      ? Math.round(getChartData().reduce((sum, d) => sum + d.value, 0) / getChartData().length)
                      : `${Math.round(getChartData().reduce((sum, d) => sum + d.value, 0) / getChartData().length).toLocaleString()} ₽`
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs max-[480px]:text-[10px] text-slate-400 uppercase tracking-widest mb-1">Максимум</p>
                  <p className="text-2xl max-[480px]:text-lg font-black text-gradient">
                    {statsViewMode === 'bookings'
                      ? Math.max(...getChartData().map(d => d.value))
                      : `${Math.max(...getChartData().map(d => d.value)).toLocaleString()} ₽`
                    }
                  </p>
                </div>
              </div>
            </div>
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
