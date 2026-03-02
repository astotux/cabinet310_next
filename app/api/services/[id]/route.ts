import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { service, description, category, master, duration, price, image } = body;
    const { id } = await params;

    const updated = await prisma.price.update({
      where: { id: parseInt(id) },
      data: {
        service,
        description,
        category,
        master,
        duration: parseInt(duration),
        price: parseInt(price),
        image,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Ошибка обновления услуги:', error);
    return NextResponse.json({ error: "Ошибка обновления услуги" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.price.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка удаления услуги" }, { status: 500 });
  }
}
