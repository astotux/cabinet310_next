import { addMinutes, format, isBefore, isAfter, startOfDay, parse, setHours, setMinutes } from 'date-fns';

/**
 * Интерфейс для рабочих часов студии
 */
export interface WorkingHours {
  start: string; // "HH:mm" формат, например "09:00"
  end: string;   // "HH:mm" формат, например "20:00"
}

/**
 * Рабочие часы студии по умолчанию
 */
export const DEFAULT_WORKING_HOURS: WorkingHours = {
  start: '09:00',
  end: '20:00'
};

/**
 * Добавляет минуты к времени и возвращает новую дату
 * 
 * @param time - Исходное время
 * @param minutes - Количество минут для добавления
 * @returns Новая дата с добавленными минутами
 * 
 * @example
 * const start = new Date('2024-01-01T10:00:00');
 * const end = addMinutesToTime(start, 90);
 * // end = new Date('2024-01-01T11:30:00')
 */
export function addMinutesToTime(time: Date, minutes: number): Date {
  return addMinutes(time, minutes);
}

/**
 * Генерирует список доступных временных слотов для указанной даты
 * 
 * Правила генерации:
 * - Слоты генерируются с шагом 30 минут (09:00, 09:30, 10:00, 10:30, ...)
 * - Услуга должна полностью помещаться в рабочие часы
 * - Слоты не генерируются для прошедших дат
 * - Для текущей даты не генерируются слоты в ближайшие 3 часа
 * 
 * @param date - Дата, для которой генерируются слоты
 * @param serviceDuration - Длительность услуги в минутах
 * @param workingHours - Рабочие часы студии (по умолчанию 09:00-20:00)
 * @returns Массив временных слотов в формате "HH:mm"
 * 
 * @example
 * // Генерация слотов для услуги длительностью 90 минут
 * const slots = generateTimeSlots(
 *   new Date('2024-01-15'),
 *   90,
 *   { start: '09:00', end: '20:00' }
 * );
 * // ['09:00', '09:30', '10:00', '10:30', ..., '18:30']
 * // Слот 19:00 не включен, т.к. услуга закончится в 20:30 (за пределами рабочих часов)
 */
export function generateTimeSlots(
  date: Date,
  serviceDuration: number,
  workingHours: WorkingHours = DEFAULT_WORKING_HOURS
): string[] {
  const slots: string[] = [];
  const now = new Date();
  const targetDate = startOfDay(date);

  // Не генерируем слоты для прошедших дат
  if (isBefore(targetDate, startOfDay(now))) {
    return slots;
  }

  // Парсим рабочие часы
  const [startHour, startMinute] = workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = workingHours.end.split(':').map(Number);

  // Создаем время начала и конца рабочего дня
  let workStart = setMinutes(setHours(targetDate, startHour), startMinute);
  const workEnd = setMinutes(setHours(targetDate, endHour), endMinute);

  // Если это сегодня, начинаем с текущего времени + 3 часа (округленного вверх)
  const isToday = targetDate.getTime() === startOfDay(now).getTime();
  if (isToday) {
    // Добавляем 3 часа к текущему времени (минимальное время для бронирования)
    const minBookingTime = addMinutes(now, 3 * 60);
    
    // Округляем время вверх до следующего получаса
    const minutes = minBookingTime.getMinutes();
    let roundedMinutes = 0;
    
    if (minutes > 30) {
      // Округляем до следующего часа
      roundedMinutes = 0;
      minBookingTime.setHours(minBookingTime.getHours() + 1);
    } else if (minutes > 0) {
      // Округляем до 30 минут
      roundedMinutes = 30;
    }
    
    minBookingTime.setMinutes(roundedMinutes, 0, 0);
    
    // Используем minBookingTime напрямую, если оно позже начала рабочего дня
    if (isAfter(minBookingTime, workStart)) {
      workStart = minBookingTime;
    }
  }

  // Генерируем слоты с шагом 30 минут
  let currentSlot = workStart;
  
  while (isBefore(currentSlot, workEnd) || currentSlot.getTime() === workEnd.getTime()) {
    // Проверяем, что услуга полностью помещается в рабочие часы
    const serviceEnd = addMinutes(currentSlot, serviceDuration);
    
    if (isBefore(serviceEnd, workEnd) || serviceEnd.getTime() === workEnd.getTime()) {
      slots.push(format(currentSlot, 'HH:mm'));
    }
    
    // Переходим к следующему слоту (через 30 минут)
    currentSlot = addMinutes(currentSlot, 30);
  }

  return slots;
}
