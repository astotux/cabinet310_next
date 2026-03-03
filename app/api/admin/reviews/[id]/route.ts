import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { approved } = await request.json();
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const review = await prisma.review.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка обновления отзыва" },
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

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка удаления отзыва" },
      { status: 500 }
    );
  }
}
