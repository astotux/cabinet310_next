"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ru } from "date-fns/locale";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  serviceId: number;
  master: string;
  onSlotSelect: (date: string, time: string) => void;
}

export default function BookingCalendar({
  serviceId,
  master,
  onSlotSelect,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Загрузка доступных слотов при выборе даты
  useEffect(() => {
    if (selectedDate && serviceId && master) {
      fetchAvailableSlots();
    }
  }, [selectedDate, serviceId, master]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      // Форматируем дату вручную, чтобы избежать проблем с часовыми поясами
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch(
        `/api/availability?service=${serviceId}&master=${encodeURIComponent(
          master
        )}&date=${dateStr}`
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки доступных слотов");
      }

      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setError("Не удалось загрузить доступные слоты. Попробуйте позже.");
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Создаем дату в полдень локального времени, чтобы избежать проблем с часовыми поясами
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      setSelectedDate(localDate);
    } else {
      setSelectedDate(undefined);
    }
    setSelectedTime(null); // Сбрасываем выбранное время при смене даты
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      // Форматируем дату вручную, чтобы избежать проблем с часовыми поясами
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      onSlotSelect(dateStr, time);
    }
  };

  // Группировка слотов по времени суток
  const groupSlotsByPeriod = () => {
    const now = new Date();
    const isToday = selectedDate && 
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    // Фильтруем слоты, убирая те, что в ближайшие 3 часа
    const filteredSlots = availableSlots.map(slot => {
      if (!isToday) return slot; // Если не сегодня, все слоты доступны

      // Парсим время слота
      const [hours, minutes] = slot.time.split(':').map(Number);
      const slotDateTime = new Date(selectedDate);
      slotDateTime.setHours(hours, minutes, 0, 0);

      // Проверяем, не попадает ли слот в ближайшие 3 часа
      const threeHoursFromNow = new Date();
      threeHoursFromNow.setHours(threeHoursFromNow.getHours() + 3);

      if (slotDateTime <= threeHoursFromNow) {
        return { ...slot, available: false };
      }

      return slot;
    });

    const morning = filteredSlots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour >= 9 && hour < 12;
    });

    const afternoon = filteredSlots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour >= 12 && hour < 17;
    });

    const evening = filteredSlots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour >= 17 && hour <= 20;
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupSlotsByPeriod();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Максимальная дата для бронирования (45 дней от сегодня)
  const maxBookingDate = new Date();
  maxBookingDate.setDate(maxBookingDate.getDate() + 45);
  maxBookingDate.setHours(0, 0, 0, 0);

  // Минимальное время для бронирования (текущее время + 3 часа)
  const minBookingTime = new Date();
  minBookingTime.setHours(minBookingTime.getHours() + 3);

  // Функция для рендеринга дней календаря
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Получаем день недели первого дня месяца (0 = воскресенье, 1 = понедельник, ...)
    let firstDayOfWeek = getDay(monthStart);
    // Конвертируем в формат где понедельник = 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const calendarDays = [];

    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    // Добавляем дни текущего месяца
    days.forEach((day) => {
      const dayDate = new Date(day);
      dayDate.setHours(0, 0, 0, 0);
      const isPast = dayDate < today;
      const isBeyondLimit = dayDate > maxBookingDate;
      const isDisabled = isPast || isBeyondLimit;
      const isSelected = selectedDate && 
        dayDate.getTime() === new Date(selectedDate).setHours(0, 0, 0, 0);

      calendarDays.push(
        <button
          key={day.toISOString()}
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-colors ${
            isSelected
              ? "calendar-day-selected"
              : isDisabled
              ? "text-slate-300 cursor-not-allowed"
              : "hover:bg-white cursor-pointer"
          }`}
        >
          {format(day, "d")}
        </button>
      );
    });

    return calendarDays;
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 max-[480px]:p-6 max-[320px]:p-5 md:p-12 shadow-2xl shadow-primary/5 grid grid-cols-1 lg:grid-cols-12 gap-12 max-[480px]:gap-8 max-[320px]:gap-6 min-h-[600px] relative overflow-hidden">
      {/* Декоративные звезды */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden z-20"
        aria-hidden="true"
      >
        <img
          loading="lazy"
          src="/star.svg"
          alt=""
          className="absolute left-2 top-20 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-30"
        />
        <img
          loading="lazy"
          src="/star.svg"
          alt=""
          className="absolute left-2 top-44 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-20 hidden sm:block"
        />
        <img
          loading="lazy"
          src="/star.svg"
          alt=""
          className="absolute right-2 top-14 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-25"
        />
        <img
          loading="lazy"
          src="/star.svg"
          alt=""
          className="absolute right-2 top-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 opacity-20 hidden md:block"
        />
      </div>

      {/* Календарь */}
      <div className="lg:col-span-7">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold capitalize">
            {format(currentMonth, "LLLL yyyy", { locale: ru })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousMonth}
              className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>
            <button
              onClick={handleNextMonth}
              className="size-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Заголовки дней недели */}
        <div className="grid grid-cols-7 gap-2 max-[320px]:gap-1 mb-4">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Пн</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Вт</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Ср</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Чт</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Пт</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Сб</div>
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Вс</div>
        </div>

        {/* Сетка календаря */}
        <div className="grid grid-cols-7 gap-2 max-[320px]:gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Временные слоты */}
      <div className="lg:col-span-5 flex flex-col border-t border-slate-200/50 pt-8 lg:pt-0 lg:border-t-0 lg:border-l lg:border-slate-200/50 pl-0 lg:pl-12">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-1">Доступное время</h3>
          {selectedDate && (
            <p className="text-sm text-slate-500">
              {format(selectedDate, "EEEE, d MMMM", { locale: ru })}
            </p>
          )}
        </div>

        {!selectedDate ? (
          <div className="flex-grow flex items-center justify-center text-slate-400">
            <p>Выберите дату в календаре</p>
          </div>
        ) : loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-slate-500">Загрузка...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchAvailableSlots}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-400">
            <p>Нет доступных слотов на эту дату</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto scrollbar-hide pr-2 space-y-6">
            {morning.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Утро
                </h4>
                <div className="grid grid-cols-3 max-[320px]:grid-cols-2 gap-3 max-[320px]:gap-2">
                  {morning.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "time-slot-selected shadow-lg shadow-primary/20"
                          : slot.available
                          ? "time-button border border-slate-200"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {afternoon.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  День
                </h4>
                <div className="grid grid-cols-3 max-[320px]:grid-cols-2 gap-3 max-[320px]:gap-2">
                  {afternoon.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "time-slot-selected shadow-lg shadow-primary/20"
                          : slot.available
                          ? "time-button border border-slate-200"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {evening.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Вечер
                </h4>
                <div className="grid grid-cols-3 max-[320px]:grid-cols-2 gap-3 max-[320px]:gap-2">
                  {evening.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "time-slot-selected shadow-lg shadow-primary/20"
                          : slot.available
                          ? "time-button border border-slate-200"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
