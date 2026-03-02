import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, master, date, time, clientName, clientPhone } = body;

    const booking = await prisma.booking.create({
      data: {
        service,
        master,
        date,
        time,
        clientName,
        clientPhone,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка создания записи" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения записей" },
      { status: 500 }
    );
  }
}
