import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/promotions — возвращает активную акцию (для фронта)
export async function GET() {
  try {
    const promotion = await prisma.promotion.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(promotion);
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
