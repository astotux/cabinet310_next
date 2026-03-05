import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBookingWithAvailability, BookingData } from "@/lib/booking/validator";
import { notifyNewBooking } from "@/lib/vkNotifications";

/**
 * POST /api/bookings
 * 
 * Создает новое бронирование с валидацией и проверкой доступности
 * 
 * Body:
 * {
 *   service: string,
 *   master: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:mm),
 *   clientName: string,
 *   clientPhone: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, master, date, time, clientName, clientPhone, comment, customPrice } = body;

    const bookingData: BookingData = {
      service,
      master,
      date,
      time,
      clientName,
      clientPhone,
    };

    // Получаем информацию об услуге для определения длительности
    const serviceInfo = await prisma.price.findFirst({
      where: { service: service }
    });

    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Валидируем данные и проверяем доступность ДО транзакции
    const validation = await validateBookingWithAvailability(
      bookingData,
      serviceInfo.duration
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: validation.errors.some(e => e.includes('занят')) ? 409 : 400 }
      );
    }

    // Используем транзакцию только для создания записи
    // Увеличиваем timeout до 10 секунд на случай медленной БД
    const booking = await prisma.$transaction(async (tx) => {
      // Финальная проверка доступности (защита от race condition)
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          date,
          time,
          master,
        }
      });

      if (conflictingBooking) {
        throw new Error('Слот уже занят');
      }

      // Создаем бронирование
      return await tx.booking.create({
        data: {
          service,
          master,
          date,
          time,
          clientName,
          clientPhone,
          comment: comment || null,
          customPrice: customPrice ? parseInt(customPrice) : null,
        },
      });
    }, {
      maxWait: 10000, // Максимальное время ожидания начала транзакции
      timeout: 10000, // Максимальное время выполнения транзакции
    });

    // Отправляем уведомление в VK (асинхронно, не блокируем ответ)
    notifyNewBooking({
      service,
      master,
      date,
      time,
      clientName,
      clientPhone,
      comment,
    }).catch(err => console.error('Failed to send VK notification:', err));

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    
    // Обрабатываем ошибку занятого слота
    if (error instanceof Error && error.message === 'Слот уже занят') {
      return NextResponse.json(
        { error: "Выбранное время уже занято. Пожалуйста, выберите другое время." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * 
 * Возвращает список всех бронирований
 */
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    return NextResponse.json(
      { error: "Ошибка получения записей" },
      { status: 500 }
    );
  }
}
