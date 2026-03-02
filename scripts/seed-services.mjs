import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const services = [
    {
      service: 'Перманент бровей',
      description: 'Пудровое напыление',
      category: 'Перманент',
      master: 'Женя',
      duration: '2 часа',
      price: 5000,
    },
    {
      service: 'Перманент губ',
      description: 'Акварельная техника',
      category: 'Перманент',
      master: 'Женя',
      duration: '2.5 часа',
      price: 6500,
    },
    {
      service: 'Маникюр',
      description: 'Покрытие гель-лак',
      category: 'Маникюр',
      master: 'Лиза',
      duration: '1.5 часа',
      price: 2500,
    },
    {
      service: 'Наращивание ногтей',
      description: 'Гелевое наращивание',
      category: 'Маникюр',
      master: 'Лиза',
      duration: '2 часа',
      price: 3500,
    },
    {
      service: 'Ламинирование ресниц',
      description: 'С ботоксом',
      category: 'Ламинирование',
      master: 'Женя',
      duration: '1 час',
      price: 2000,
    },
  ];

  for (const service of services) {
    await prisma.price.create({ data: service });
  }

  console.log('✅ Services seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
