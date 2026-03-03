import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewReview } from "@/lib/vkNotifications";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      include: {
        photos: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения отзывов" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, text, service, photos = [] } = body;

    console.log('Creating review:', { name, rating, text, service, photosCount: photos.length });

    const review = await prisma.review.create({
      data: {
        name,
        rating,
        text,
        service: service || null,
        approved: false,
        photos: {
          create: photos.filter((url: string) => url).map((url: string) => ({ imageUrl: url })),
        },
      },
      include: {
        photos: true,
      },
    });

    // Отправляем уведомление в VK (асинхронно, не блокируем ответ)
    notifyNewReview({
      name,
      rating,
      text,
      service: service || undefined,
    }).catch(err => console.error('Failed to send VK notification:', err));

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: "Ошибка создания отзыва", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
