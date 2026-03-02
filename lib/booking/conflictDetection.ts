/**
 * Интерфейс для представления временного интервала бронирования
 */
export interface BookingInterval {
  service: string;
  master: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Проверяет, перекрываются ли два временных интервала
 * 
 * Два интервала перекрываются, если они имеют общие минуты.
 * Если один интервал заканчивается ровно в момент начала другого,
 * они НЕ считаются перекрывающимися.
 * 
 * Формула: (start1 < end2) && (start2 < end1)
 * 
 * @param start1 - Время начала первого интервала
 * @param end1 - Время окончания первого интервала
 * @param start2 - Время начала второго интервала
 * @param end2 - Время окончания второго интервала
 * @returns true если интервалы перекрываются, false иначе
 * 
 * @example
 * // Перекрываются: 10:00-11:30 и 11:00-12:00
 * isOverlapping(
 *   new Date('2024-01-01T10:00'),
 *   new Date('2024-01-01T11:30'),
 *   new Date('2024-01-01T11:00'),
 *   new Date('2024-01-01T12:00')
 * ) // true
 * 
 * @example
 * // Не перекрываются: 10:00-11:00 и 11:00-12:00
 * isOverlapping(
 *   new Date('2024-01-01T10:00'),
 *   new Date('2024-01-01T11:00'),
 *   new Date('2024-01-01T11:00'),
 *   new Date('2024-01-01T12:00')
 * ) // false
 */
export function isOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  // Проверяем, что интервалы валидны
  if (start1 >= end1 || start2 >= end2) {
    throw new Error('Invalid time interval: start time must be before end time');
  }

  // Формула перекрытия: (start1 < end2) && (start2 < end1)
  // Если один интервал заканчивается ровно когда начинается другой - нет перекрытия
  return start1 < end2 && start2 < end1;
}

/**
 * Проверяет, конфликтуют ли две услуги из-за использования общей рабочей зоны
 * 
 * Согласно правилам студии:
 * - Маникюр (Лиза) и Перманент (Женя) используют общую зону и конфликтуют
 * - Маникюр (Лиза) и Ламинирование (Женя) используют разные зоны и НЕ конфликтуют
 * 
 * @param service1 - Название первой услуги
 * @param service2 - Название второй услуги
 * @returns true если услуги конфликтуют из-за общей зоны, false иначе
 * 
 * @example
 * isSharedZoneConflict('Маникюр', 'Перманент') // true
 * isSharedZoneConflict('Перманент', 'Маникюр') // true
 * isSharedZoneConflict('Маникюр', 'Ламинирование') // false
 */
export function isSharedZoneConflict(service1: string, service2: string): boolean {
  // Нормализуем названия услуг (приводим к нижнему регистру для сравнения)
  const s1 = service1.toLowerCase();
  const s2 = service2.toLowerCase();

  // Проверяем, является ли одна услуга Маникюром, а другая Перманентом
  const isManicure1 = s1.includes('маникюр');
  const isManicure2 = s2.includes('маникюр');
  const isPermanent1 = s1.includes('перманент');
  const isPermanent2 = s2.includes('перманент');

  // Конфликт есть, если одна услуга - Маникюр, а другая - Перманент
  return (isManicure1 && isPermanent2) || (isPermanent1 && isManicure2);
}

/**
 * Определяет, конфликтуют ли два бронирования
 * 
 * Правила конфликтов:
 * 1. Если времена не перекрываются - нет конфликта
 * 2. Если один мастер - всегда конфликт (мастер не может быть в двух местах одновременно)
 * 3. Если разные мастера и времена перекрываются:
 *    - Маникюр (Лиза) + Перманент (Женя) = КОНФЛИКТ (общая зона)
 *    - Маникюр (Лиза) + Ламинирование (Женя) = НЕТ КОНФЛИКТА (разные зоны)
 *    - Любые другие комбинации = НЕТ КОНФЛИКТА
 * 
 * @param booking1 - Первое бронирование
 * @param booking2 - Второе бронирование
 * @returns true если бронирования конфликтуют, false иначе
 * 
 * @example
 * // Конфликт: один мастер, перекрывающееся время
 * hasConflict(
 *   { service: 'Маникюр', master: 'Лиза', startTime: ..., endTime: ... },
 *   { service: 'Наращивание', master: 'Лиза', startTime: ..., endTime: ... }
 * ) // true
 * 
 * @example
 * // Конфликт: Маникюр + Перманент, общая зона
 * hasConflict(
 *   { service: 'Маникюр', master: 'Лиза', startTime: ..., endTime: ... },
 *   { service: 'Перманент', master: 'Женя', startTime: ..., endTime: ... }
 * ) // true
 * 
 * @example
 * // Нет конфликта: Маникюр + Ламинирование, разные зоны
 * hasConflict(
 *   { service: 'Маникюр', master: 'Лиза', startTime: ..., endTime: ... },
 *   { service: 'Ламинирование', master: 'Женя', startTime: ..., endTime: ... }
 * ) // false
 */
export function hasConflict(
  booking1: BookingInterval,
  booking2: BookingInterval
): boolean {
  // Шаг 1: Проверяем перекрытие времени
  const timesOverlap = isOverlapping(
    booking1.startTime,
    booking1.endTime,
    booking2.startTime,
    booking2.endTime
  );

  // Если времена не перекрываются - нет конфликта
  if (!timesOverlap) {
    return false;
  }

  // Шаг 2: Если времена перекрываются и один мастер - всегда конфликт
  if (booking1.master === booking2.master) {
    return true;
  }

  // Шаг 3: Разные мастера, времена перекрываются
  // Проверяем конфликт общей зоны (Маникюр + Перманент)
  if (isSharedZoneConflict(booking1.service, booking2.service)) {
    return true;
  }

  // Во всех остальных случаях - нет конфликта
  return false;
}
