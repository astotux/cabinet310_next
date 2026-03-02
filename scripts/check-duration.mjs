import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Проверка данных после миграции...\n');

  try {
    const prices = await prisma.price.findMany({
      select: {
        id: true,
        service: true,
        duration: true,
        master: true
      }
    });

    console.log(`📊 Всего записей: ${prices.length}\n`);

    if (prices.length === 0) {
      console.log('⚠️  База данных пуста');
      return;
    }

    console.log('📋 Данные после миграции:');
    console.log('─'.repeat(70));
    prices.forEach(price => {
      console.log(`ID: ${price.id} | ${price.service} (${price.master}) | ${price.duration} минут`);
    });
    console.log('─'.repeat(70));

    // Проверяем, что все значения - числа
    const allValid = prices.every(p => typeof p.duration === 'number' && p.duration > 0);
    
    if (allValid) {
      console.log('\n✅ Все значения duration корректно сконвертированы в минуты!');
    } else {
      console.log('\n❌ Обнаружены некорректные значения duration');
    }

    // Статистика
    const stats = {
      min: Math.min(...prices.map(p => p.duration)),
      max: Math.max(...prices.map(p => p.duration)),
      avg: Math.round(prices.reduce((sum, p) => sum + p.duration, 0) / prices.length)
    };

    console.log('\n📈 Статистика:');
    console.log(`  Минимум: ${stats.min} минут`);
    console.log(`  Максимум: ${stats.max} минут`);
    console.log(`  Среднее: ${stats.avg} минут`);

  } catch (error) {
    console.error('❌ Ошибка:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
