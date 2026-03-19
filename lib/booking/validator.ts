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
  clientPhone?: string;  // Теперь необязательное для VK бронирований
  vkProfile?: string;    // VK профиль (vk.com/id123456 или vk.com/username)
  vkUserId?: number;     // ID пользователя ВК для уведомлений
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
 * Валидирует формат VK профиля
 * Принимает форматы: vk.com/id123456, vk.com/username
 * 
 * @param vkProfile - Ссылка на VK профиль
 * @returns true если формат валиден
 */
function validateVKProfile(vkProfile: string): boolean {
  // Поддерживаемые форматы:
  // vk.com/id123456 (числовой ID)
  // vk.com/username (имя пользователя)
  const vkProfileRegex = /^vk\.com\/(id\d+|[a-zA-Z0-9_]+)$/;
  return vkProfileRegex.test(vkProfile);
}

/**
 * Валидирует данные бронирования
 * 
 * Проверки:
 * - Все обязательные поля заполнены
 * - Дата в формате YYYY-MM-DD
 * - Время в формате HH:mm
 * - Контактные данные: либо телефон, либо VK профиль
 * - Дата не в прошлом (кроме админа)
 * 
 * @param data - Данные бронирования
 * @param isAdmin - Является ли пользователь админом (пропускает ограничения)
 * @returns Результат валидации с списком ошибок
 * 
 * @example
 * // Обычное бронирование с телефоном
 * const result1 = validateBooking({
 *   service: 'Маникюр',
 *   master: 'Лиза',
 *   date: '2024-01-15',
 *   time: '14:00',
 *   clientName: 'Иван Иванов',
 *   clientPhone: '+79991234567'
 * });
 * 
 * // VK бронирование
 * const result2 = validateBooking({
 *   service: 'Маникюр',
 *   master: 'Лиза',
 *   date: '2024-01-15',
 *   time: '14:00',
 *   clientName: 'Иван Иванов',
 *   vkProfile: 'vk.com/id123456',
 *   vkUserId: 123456
 * });
 */
export function validateBooking(data: BookingData, isAdmin: boolean = false): ValidationResult {
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

  // Проверка контактных данных - должен быть указан либо телефон, либо VK профиль
  const hasPhone = data.clientPhone && data.clientPhone.trim() !== '';
  const hasVKProfile = data.vkProfile && data.vkProfile.trim() !== '';

  if (!hasPhone && !hasVKProfile) {
    errors.push('Необходимо указать либо телефон, либо VK профиль');
  }

  if (hasPhone && hasVKProfile) {
    errors.push('Нельзя указывать одновременно телефон и VK профиль');
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
    // Проверка, что дата не в прошлом (только для не-админов)
    if (!isAdmin) {
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
  }

  // Валидация формата времени
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(data.time)) {
    errors.push('Неверный формат времени. Используйте HH:mm');
  }

  // Валидация телефона (если указан)
  if (hasPhone && !isValidPhone(data.clientPhone!)) {
    errors.push('Неверный формат телефона. Используйте российский формат (+7XXXXXXXXXX)');
  }

  // Валидация VK профиля (если указан)
  if (hasVKProfile && !validateVKProfile(data.vkProfile!)) {
    errors.push('Неверный формат VK профиля. Используйте формат vk.com/id123456 или vk.com/username');
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
 * @param isAdmin - Является ли пользователь админом (пропускает блокировки)
 * @returns true если слот доступен, false если занят
 * 
 * @example
 * const available = await checkSlotAvailability({
 *   service: 'Маникюр',
 *   master: 'Лиза',
 *   date: '2024-01-15',
 *   time: '14:00',
 *   clientName: 'Иван Иванов',
 *   clientPhone: '+79991234567'
 * }, 90);
 * // true или false
 */
export async function checkSlotAvailability(
  data: BookingData,
  serviceDuration: number,
  isAdmin: boolean = false
): Promise<boolean> {
  // Проверяем, не заблокирован ли этот слот (только для не-админов)
  if (!isAdmin) {
    const blockedSlot = await prisma.blockedSlot.findFirst({
      where: {
        master: data.master,
        date: data.date,
        time: data.time
      }
    });

    if (blockedSlot) {
      return false; // Слот заблокирован
    }
  }

  // Получаем все существующие бронирования на эту дату
  const existingBookings = await prisma.booking.findMany({
    where: { date: data.date }
  });

  // Для мастера Женя (не-админ): если на эту дату уже есть запись — день занят
  if (!isAdmin && data.master === 'Женя') {
    const zhenyaBookingsOnDate = existingBookings.filter(b => b.master === 'Женя');
    if (zhenyaBookingsOnDate.length > 0) {
      return false;
    }
  }

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
 * @param isAdmin - Является ли пользователь админом (пропускает ограничения)
 * @returns Результат валидации
 */
export async function validateBookingWithAvailability(
  data: BookingData,
  serviceDuration: number,
  isAdmin: boolean = false
): Promise<ValidationResult> {
  // Сначала валидируем данные
  const validation = validateBooking(data, isAdmin);
  
  if (!validation.valid) {
    return validation;
  }

  // Затем проверяем доступность
  const available = await checkSlotAvailability(data, serviceDuration, isAdmin);
  
  if (!available) {
    return {
      valid: false,
      errors: ['Выбранный временной слот уже занят']
    };
  }

  return { valid: true, errors: [] };
}
