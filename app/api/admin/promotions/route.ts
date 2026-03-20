import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — все акции
export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// POST — создать акцию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, text, image, active } = body;
    if (!title || !text) return NextResponse.json({ error: "Заполните заголовок и текст" }, { status: 400 });

    // Если новая акция активна — деактивируем остальные
    if (active) {
      await prisma.promotion.updateMany({ data: { active: false } });
    }

    const promotion = await prisma.promotion.create({
      data: { title, text, image: image || null, active: !!active },
    });
    return NextResponse.json(promotion, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
