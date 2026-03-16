import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBookingWithAvailability, BookingData } from "@/lib/booking/validator";
import { isAdminFromHeaders } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    
    const { service, master, date, time, clientName, clientPhone, comment, customPrice, adminNote } = body;

    // Проверяем, является ли пользователь админом
    const isAdmin = await isAdminFromHeaders(request.headers);

    // Если изменяются критические поля (дата, время, услуга, мастер), валидируем
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Запись не найдена" },
        { status: 404 }
      );
    }

    // Проверяем, изменились ли критические поля
    const criticalFieldsChanged = 
      existingBooking.service !== service ||
      existingBooking.master !== master ||
      existingBooking.date !== date ||
      existingBooking.time !== time;

    if (criticalFieldsChanged) {
      // Валидируем новые данные
      const bookingData: BookingData = {
        service,
        master,
        date,
        time,
        clientName,
        clientPhone: clientPhone || undefined,
        vkProfile: (existingBooking as any).vkProfile || undefined,
        vkUserId: (existingBooking as any).vkUserId || undefined,
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

      // Валидируем с учетом статуса админа
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
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        service,
        master,
        date,
        time,
        clientName,
        clientPhone,
        comment: comment || null,
        adminNote: adminNote !== undefined ? (adminNote || null) : undefined,
        customPrice: customPrice ? parseInt(customPrice) : null,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    return NextResponse.json(
      { error: "Ошибка обновления записи" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка удаления записи" },
      { status: 500 }
    );
  }
}
