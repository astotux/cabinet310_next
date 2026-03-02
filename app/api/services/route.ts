import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.price.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка получения услуг" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, description, category, master, duration, price, image } = body;

    if (!service || !category || !master || !duration || !price) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    const newService = await prisma.price.create({
      data: {
        service,
        description: description || "",
        category,
        master,
        duration: parseInt(duration),
        price: parseInt(price),
        image: image || null,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания услуги:', error);
    return NextResponse.json({ error: "Ошибка создания услуги" }, { status: 500 });
  }
}
