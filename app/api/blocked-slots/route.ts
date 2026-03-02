import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - получить все заблокированные слоты
export async function GET() {
  try {
    const blockedSlots = await prisma.blockedSlot.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blockedSlots);
  } catch (error) {
    console.error('Ошибка получения заблокированных слотов:', error);
    return NextResponse.json(
      { error: "Ошибка получения заблокированных слотов" },
      { status: 500 }
    );
  }
}

// POST - создать заблокированный слот
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { master, date, time, reason } = body;

    // Проверяем обязательные поля
    if (!master || !date || !time) {
      return NextResponse.json(
        { error: "Мастер, дата и время обязательны" },
        { status: 400 }
      );
    }

    // Проверяем, не заблокирован ли уже этот слот
    const existingBlock = await prisma.blockedSlot.findFirst({
      where: { master, date, time }
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: "Этот слот уже заблокирован" },
        { status: 409 }
      );
    }

    // Создаем блокировку
    const blockedSlot = await prisma.blockedSlot.create({
      data: { master, date, time, reason: reason || null },
    });

    return NextResponse.json(blockedSlot, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания блокировки:', error);
    return NextResponse.json(
      { error: "Ошибка создания блокировки" },
      { status: 500 }
    );
  }
}

// DELETE - удалить заблокированный слот
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID обязателен" },
        { status: 400 }
      );
    }

    await prisma.blockedSlot.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления блокировки:', error);
    return NextResponse.json(
      { error: "Ошибка удаления блокировки" },
      { status: 500 }
    );
  }
}
