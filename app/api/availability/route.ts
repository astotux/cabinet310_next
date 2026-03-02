import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CONFLICT_MATRIX } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { service, date, time } = await request.json();

    const conflictingServices = CONFLICT_MATRIX[service] || [];
    
    const existingBookings = await prisma.booking.findMany({
      where: {
        date,
        time,
        service: {
          in: conflictingServices,
        },
      },
    });

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { available: false, reason: "Конфликт с другой услугой" },
        { status: 200 }
      );
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка проверки доступности" },
      { status: 500 }
    );
  }
}
