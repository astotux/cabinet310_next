import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBookingWithAvailability, BookingData } from "@/lib/booking/validator";
import { notifyNewBooking, notifyNewVKBooking } from "@/lib/vkNotifications";
import { vkNotificationService } from "@/lib/vk-bot/notification-service";
import { isAdminFromHeaders } from "@/lib/auth";

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
 *   clientPhone?: string,  // Для обычных записей
 *   vkProfile?: string,    // Для VK записей (vk.com/id123456)
 *   vkUserId?: number,     // ID пользователя ВК
 *   comment?: string,
 *   customPrice?: number,
 *   skipNotification?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      service, 
      master, 
      date, 
      time, 
      clientName, 
      clientPhone, 
      vkProfile,
      vkUserId,
      comment, 
      customPrice, 
      skipNotification 
    } = body;

    // Проверяем, является ли пользователь админом
    const isAdmin = await isAdminFromHeaders(request.headers);

    const bookingData: BookingData = {
      service,
      master,
      date,
      time,
      clientName,
      clientPhone: clientPhone || undefined,
      vkProfile: vkProfile || undefined,
      vkUserId: vkUserId || undefined,
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
    // Передаем флаг isAdmin для пропуска ограничений
    const validation = await validateBookingWithAvailability(
      bookingData,
      serviceInfo.duration,
      isAdmin
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
          clientPhone: clientPhone || null,
          vkProfile: vkProfile || null,
          vkUserId: vkUserId || null,
          comment: comment || null,
          customPrice: customPrice ? parseInt(customPrice) : null,
        } as any,
      });
    }, {
      maxWait: 10000, // Максимальное время ожидания начала транзакции
      timeout: 10000, // Максимальное время выполнения транзакции
    });

    // Отправляем уведомление в VK (асинхронно, не блокируем ответ)
    // Пропускаем уведомление если skipNotification = true (создание админом)
    if (!skipNotification) {
      if (vkProfile && vkUserId) {
        // Уведомление администраторам о VK бронировании
        notifyNewVKBooking({
          service,
          master,
          date,
          time,
          clientName,
          vkProfile,
          vkUserId,
          comment,
        }).catch(err => console.error('Failed to send VK admin notification:', err));
        
        // Подтверждение пользователю ВК
        vkNotificationService.sendBookingConfirmation({
          vkUserId,
          clientName,
          service,
          date,
          time,
          type: 'confirmation'
        }).catch(err => console.error('Failed to send VK user confirmation:', err));
      } else if (clientPhone) {
        // Обычное уведомление
        notifyNewBooking({
          service,
          master,
          date,
          time,
          clientName,
          clientPhone,
          comment,
        }).catch(err => console.error('Failed to send VK notification:', err));
      }
    }

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
