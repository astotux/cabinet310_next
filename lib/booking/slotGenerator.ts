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
 * - Слоты генерируются с шагом 60 минут (09:00, 10:00, 11:00, ...)
 * - Услуга должна полностью помещаться в рабочие часы
 * - Слоты не генерируются для прошедших дат
 * - Для текущей даты не генерируются слоты для прошедших часов
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
 * // ['09:00', '10:00', '11:00', ..., '18:00']
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

  // Если это сегодня, начинаем с текущего часа (округленного вверх)
  const isToday = targetDate.getTime() === startOfDay(now).getTime();
  if (isToday) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Округляем текущее время вверх до следующего часа
    const nextHour = currentMinute > 0 ? currentHour + 1 : currentHour;
    const currentTime = setMinutes(setHours(targetDate, nextHour), 0);
    
    // Если текущее время позже начала рабочего дня, начинаем с текущего времени
    if (isAfter(currentTime, workStart)) {
      workStart = currentTime;
    }
  }

  // Генерируем слоты с шагом 60 минут
  let currentSlot = workStart;
  
  while (isBefore(currentSlot, workEnd) || currentSlot.getTime() === workEnd.getTime()) {
    // Проверяем, что услуга полностью помещается в рабочие часы
    const serviceEnd = addMinutes(currentSlot, serviceDuration);
    
    if (isBefore(serviceEnd, workEnd) || serviceEnd.getTime() === workEnd.getTime()) {
      slots.push(format(currentSlot, 'HH:mm'));
    }
    
    // Переходим к следующему слоту (через 60 минут)
    currentSlot = addMinutes(currentSlot, 60);
  }

  return slots;
}
