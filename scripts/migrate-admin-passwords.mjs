/**
 * Скрипт для миграции существующих админов с открытыми паролями на хешированные
 * ВНИМАНИЕ: Этот скрипт нужно запустить ОДИН РАЗ после обновления системы безопасности
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function migratePasswords() {
  try {
    console.log('\n🔐 Миграция паролей администраторов...\n');

    // Получаем всех админов
    const admins = await prisma.admin.findMany();

    if (admins.length === 0) {
      console.log('ℹ️  Администраторы не найдены в базе данных.');
      console.log('   Используйте: npm run create-admin для создания нового администратора.\n');
      return;
    }

    console.log(`Найдено администраторов: ${admins.length}\n`);

    for (const admin of admins) {
      // Проверяем, не хеширован ли уже пароль (bcrypt хеши начинаются с $2a$, $2b$ или $2y$)
      if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$') || admin.password.startsWith('$2y$')) {
        console.log(`✓ ${admin.username} - пароль уже хеширован, пропускаем`);
        continue;
      }

      // Хешируем открытый пароль
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      // Обновляем в базе
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      });

      console.log(`✓ ${admin.username} - пароль успешно хеширован`);
    }

    console.log('\n✅ Миграция завершена успешно!\n');
    console.log('⚠️  ВАЖНО: Сохраните ваши пароли в безопасном месте.');
    console.log('   Восстановить пароли из хешей невозможно!\n');

  } catch (error) {
    console.error('❌ Ошибка при миграции паролей:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migratePasswords();
