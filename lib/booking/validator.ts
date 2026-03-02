import { parse, isBefore, startOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { hasConflict, BookingInterval } from './conflictDetection';

/**
 * Интерфейс данных бронирования
 */
export interface BookingData {
  service: string;
  master: string;
  date: string;       // YYYY-MM-DD формат
  time: string;       // HH:mm формат
  clientName: string;
  clientPhone: string;
}

/**
 * Результат валидации
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Валидирует формат российского телефона
 * Принимает форматы: +7XXXXXXXXXX, 8XXXXXXXXXX, 7XXXXXXXXXX
 * 
 * @param phone - Номер телефона
 * @returns true если формат валиден
 */
function isValidPhone(phone: string): boolean {
  // Удаляем все пробелы, дефисы и скобки
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Проверяем российские форматы
  const phoneRegex = /^(\+7|8|7)\d{10}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Валидирует данные бронирования
 * 
 * Проверки:
 * - Все обязательные поля заполнены
 * - Дата в формате YYYY-MM-DD
 * - Время в формате HH:mm
 * - Телефон в валидном формате
 * - Дата не в прошлом
 * 
 * @param data - Данные бронирования
 * @returns Результат валидации с списком ошибок
 * 
 * @example
 * const result = validateBooking({
 *   service: 'Маникюр',
 *   master: 'Мастер А',
 *   date: '2024-01-15',
 *   time: '14:00',
 *   clientName: 'Иван Иванов',
 *   clientPhone: '+79991234567'
 * });
 * // { valid: true, errors: [] }
 */
export function validateBooking(data: BookingData): ValidationResult {
  const errors: string[] = [];

  // Проверка обязательных полей
  if (!data.service || data.service.trim() === '') {
    errors.push('Не указана услуга');
  }

  if (!data.master || data.master.trim() === '') {
    errors.push('Не указан мастер');
  }

  if (!data.date || data.date.trim() === '') {
    errors.push('Не указана дата');
  }

  if (!data.time || data.time.trim() === '') {
    errors.push('Не указано время');
  }

  if (!data.clientName || data.clientName.trim() === '') {
    errors.push('Не указано имя клиента');
  }

  if (!data.clientPhone || data.clientPhone.trim() === '') {
    errors.push('Не указан телефон клиента');
  }

  // Если есть критические ошибки, возвращаем результат
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Валидация формата даты
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    errors.push('Неверный формат даты. Используйте YYYY-MM-DD');
  } else {
    // Проверка, что дата не в прошлом
    try {
      const bookingDate = parse(data.date, 'yyyy-MM-dd', new Date());
      const today = startOfDay(new Date());
      
      if (isBefore(bookingDate, today)) {
        errors.push('Нельзя создать бронирование на прошедшую дату');
      }
    } catch (error) {
      errors.push('Некорректная дата');
    }
  }

  // Валидация формата времени
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(data.time)) {
    errors.push('Неверный формат времени. Используйте HH:mm');
  }

  // Валидация телефона
  if (!isValidPhone(data.clientPhone)) {
    errors.push('Неверный формат телефона. Используйте российский формат (+7XXXXXXXXXX)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Проверяет доступность временного слота для бронирования
 * 
 * Загружает все существующие бронирования и проверяет конфликты
 * с использованием Conflict Detection Engine
 * 
 * @param data - Данные бронирования
 * @param serviceDuration - Длительность услуги в минутах
 * @returns true если слот доступен, false если занят
 * 
 * @example
 * const available = await checkSlotAvailability({
 *   service: 'Маникюр',
 *   master: 'Мастер А',
 *   date: '2024-01-15',
 *   time: '14:00',
 *   clientName: 'Иван Иванов',
 *   clientPhone: '+79991234567'
 * }, 90);
 * // true или false
 */
export async function checkSlotAvailability(
  data: BookingData,
  serviceDuration: number
): Promise<boolean> {
  // Получаем все существующие бронирования на эту дату
  const existingBookings = await prisma.booking.findMany({
    where: { date: data.date }
  });

  // Если нет существующих бронирований - слот доступен
  if (existingBookings.length === 0) {
    return true;
  }

  // Создаем интервал для нового бронирования
  const newStart = parse(`${data.date} ${data.time}`, 'yyyy-MM-dd HH:mm', new Date());
  const newEnd = new Date(newStart.getTime() + serviceDuration * 60000);

  const newBooking: BookingInterval = {
    service: data.service,
    master: data.master,
    startTime: newStart,
    endTime: newEnd
  };

  // Получаем информацию о длительности всех услуг
  const serviceNames = [...new Set(existingBookings.map((b: { service: string }) => b.service))];
  const services = await prisma.price.findMany({
    where: {
      service: {
        in: serviceNames
      }
    }
  });

  // Создаем карту услуга -> длительность
  const serviceDurationMap = new Map<string, number>();
  services.forEach((s: { service: string; duration: number }) => {
    serviceDurationMap.set(s.service, s.duration);
  });

  // Проверяем конфликты с каждым существующим бронированием
  for (const existing of existingBookings) {
    const existingDuration = serviceDurationMap.get(existing.service) || 60;
    const existingStart = parse(`${existing.date} ${existing.time}`, 'yyyy-MM-dd HH:mm', new Date());
    const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);

    const existingBooking: BookingInterval = {
      service: existing.service,
      master: existing.master,
      startTime: existingStart,
      endTime: existingEnd
    };

    // Если есть конфликт - слот недоступен
    if (hasConflict(newBooking, existingBooking)) {
      return false;
    }
  }

  // Если конфликтов нет - слот доступен
  return true;
}

/**
 * Полная валидация бронирования с проверкой доступности
 * 
 * @param data - Данные бронирования
 * @param serviceDuration - Длительность услуги в минутах
 * @returns Результат валидации
 */
export async function validateBookingWithAvailability(
  data: BookingData,
  serviceDuration: number
): Promise<ValidationResult> {
  // Сначала валидируем данные
  const validation = validateBooking(data);
  
  if (!validation.valid) {
    return validation;
  }

  // Затем проверяем доступность
  const available = await checkSlotAvailability(data, serviceDuration);
  
  if (!available) {
    return {
      valid: false,
      errors: ['Выбранный временной слот уже занят']
    };
  }

  return { valid: true, errors: [] };
}
