import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Парсит строку длительности в минуты
 * @param {string} duration - Строка вида "1.5 часа", "45 минут", "2 часа"
 * @returns {number} - Длительность в минутах
 */
function parseDurationToMinutes(duration) {
  if (!duration || typeof duration !== 'string') {
    throw new Error(`Invalid duration: ${duration}`);
  }

  // Парсинг часов: "1 час", "1.5 часа", "2 часа"
  const hourMatch = duration.match(/(\d+\.?\d*)\s*час/i);
  if (hourMatch) {
    return Math.round(parseFloat(hourMatch[1]) * 60);
  }

  // Парсинг минут: "45 минут", "30 минут"
  const minuteMatch = duration.match(/(\d+)\s*минут/i);
  if (minuteMatch) {
    return parseInt(minuteMatch[1], 10);
  }

  throw new Error(`Cannot parse duration: ${duration}`);
}

async function main() {
  console.log('🔄 Начинаем миграцию данных duration...\n');

  try {
    // Получаем все записи Price
    const prices = await prisma.$queryRaw`SELECT id, service, duration FROM Price`;
    
    console.log(`📊 Найдено записей: ${prices.length}\n`);

    if (prices.length === 0) {
      console.log('✅ Нет данных для миграции');
      return;
    }

    // Показываем примеры текущих данных
    console.log('📋 Примеры текущих данных:');
    prices.slice(0, 5).forEach(price => {
      console.log(`  - ${price.service}: "${price.duration}"`);
    });
    console.log('');

    // Конвертируем каждую запись
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const price of prices) {
      try {
        const minutes = parseDurationToMinutes(price.duration);
        console.log(`✓ ${price.service}: "${price.duration}" → ${minutes} минут`);
        
        // Обновляем запись (пока только логируем, реальное обновление будет после миграции схемы)
        successCount++;
      } catch (error) {
        console.error(`✗ ${price.service}: "${price.duration}" - ОШИБКА: ${error.message}`);
        errors.push({ id: price.id, service: price.service, duration: price.duration, error: error.message });
        errorCount++;
      }
    }

    console.log('\n📈 Результаты:');
    console.log(`  ✅ Успешно: ${successCount}`);
    console.log(`  ❌ Ошибок: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n⚠️  Записи с ошибками:');
      errors.forEach(err => {
        console.log(`  - ID ${err.id}: ${err.service} - "${err.duration}" (${err.error})`);
      });
    }

    console.log('\n✅ Анализ завершен. Данные готовы к миграции.');
    
  } catch (error) {
    console.error('❌ Ошибка при миграции:', error);
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
