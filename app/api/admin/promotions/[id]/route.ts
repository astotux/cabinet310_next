import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — обновить / применить акцию
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, text, image, active } = body;

    // Если делаем активной — деактивируем остальные
    if (active) {
      await prisma.promotion.updateMany({ where: { id: { not: id } }, data: { active: false } });
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(text !== undefined && { text }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
      },
    });
    return NextResponse.json(promotion);
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// DELETE — удалить акцию
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.promotion.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
