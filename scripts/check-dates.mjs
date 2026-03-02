import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'desc' },
    take: 5,
    select: {
      id: true,
      date: true,
      time: true,
      service: true,
      master: true,
      clientName: true,
    },
  });

  console.log('Последние 5 записей:');
  bookings.forEach(booking => {
    console.log(`ID: ${booking.id}, Дата: ${booking.date}, Время: ${booking.time}, Услуга: ${booking.service}, Мастер: ${booking.master}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
