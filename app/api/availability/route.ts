import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, DEFAULT_WORKING_HOURS } from "@/lib/booking/slotGenerator";
import { hasConflict, BookingInterval } from "@/lib/booking/conflictDetection";
import { parse, format } from "date-fns";

// Отключаем кэширование для этого API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/availability
 * 
 * Возвращает список доступных временных слотов для указанной услуги, мастера и даты
 * 
 * Query параметры:
 * - service: ID услуги (number)
 * - master: Имя мастера (string)
 * - date: Дата в формате YYYY-MM-DD (string)
 * 
 * Ответ:
 * {
 *   date: string,
 *   slots: Array<{ time: string, available: boolean }>
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('service');
    const master = searchParams.get('master');
    const dateStr = searchParams.get('date');

    // Валидация параметров
    if (!serviceId || !master || !dateStr) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные параметры: service, master, date' },
        { status: 400 }
      );
    }

    // Валидация формата даты
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: 'Неверный формат даты. Используйте YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Получаем информацию об услуге
    const service = await prisma.price.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Генерируем все возможные временные слоты для даты
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    const allSlots = generateTimeSlots(date, service.duration, DEFAULT_WORKING_HOURS);

    // Получаем все существующие бронирования на эту дату
    const existingBookings = await prisma.booking.findMany({
      where: { date: dateStr }
    });

    // Получаем все заблокированные слоты для этого мастера на эту дату
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        master: master,
        date: dateStr
      }
    });

    // Создаем Set заблокированных времен для быстрой проверки
    const blockedTimes = new Set(blockedSlots.map(slot => slot.time));

    // Получаем информацию о длительности всех услуг
    const serviceIds = [...new Set(existingBookings.map(b => b.service))];
    const services = await prisma.price.findMany({
      where: {
        service: {
          in: serviceIds
        }
      }
    });

    // Создаем карту услуга -> длительность
    const serviceDurationMap = new Map<string, number>();
    services.forEach(s => {
      serviceDurationMap.set(s.service, s.duration);
    });

    // Проверяем каждый слот на конфликты
    const slotsWithAvailability = allSlots.map(timeSlot => {
      // Проверяем, заблокирован ли этот слот
      if (blockedTimes.has(timeSlot)) {
        return {
          time: timeSlot,
          available: false
        };
      }

      // Создаем интервал для нового бронирования
      const slotStart = parse(`${dateStr} ${timeSlot}`, 'yyyy-MM-dd HH:mm', new Date());
      const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);

      const newBooking: BookingInterval = {
        service: service.service,
        master: master,
        startTime: slotStart,
        endTime: slotEnd
      };

      // Проверяем конфликты с существующими бронированиями
      const hasConflictWithExisting = existingBookings.some(existing => {
        const existingDuration = serviceDurationMap.get(existing.service) || 60;
        const existingStart = parse(`${existing.date} ${existing.time}`, 'yyyy-MM-dd HH:mm', new Date());
        const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);

        const existingBooking: BookingInterval = {
          service: existing.service,
          master: existing.master,
          startTime: existingStart,
          endTime: existingEnd
        };

        return hasConflict(newBooking, existingBooking);
      });

      return {
        time: timeSlot,
        available: !hasConflictWithExisting
      };
    });

    return NextResponse.json({
      date: dateStr,
      slots: slotsWithAvailability
    });

  } catch (error) {
    console.error('Ошибка при проверке доступности:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
