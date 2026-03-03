/**
 * Простой скрипт для генерации хеша пароля
 * Использование: node scripts/hash-password.mjs "ваш_пароль"
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Ошибка: Пароль не указан!');
  console.log('\nИспользование:');
  console.log('  node scripts/hash-password.mjs "ваш_пароль"\n');
  console.log('Пример:');
  console.log('  node scripts/hash-password.mjs "mySecurePassword123"\n');
  process.exit(1);
}

async function hashPassword() {
  try {
    console.log('\n⏳ Генерация хеша пароля...\n');
    
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ Хеш успешно сгенерирован!\n');
    console.log('Скопируйте этот хеш:\n');
    console.log(hash);
    console.log('\n📝 Теперь обновите пароль в базе данных:');
    console.log('\n1. Откройте Prisma Studio:');
    console.log('   npx prisma studio\n');
    console.log('2. Перейдите в таблицу Admin');
    console.log('3. Найдите вашего администратора');
    console.log('4. Вставьте скопированный хеш в поле password');
    console.log('5. Сохраните изменения\n');
    
  } catch (error) {
    console.error('❌ Ошибка при генерации хеша:', error);
    process.exit(1);
  }
}

hashPassword();
