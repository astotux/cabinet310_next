import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updatePassword() {
  try {
    console.log('\n🔐 Обновление пароля администратора\n');

    const username = await question('Введите логин администратора: ');
    
    if (!username) {
      console.error('❌ Логин обязателен!');
      process.exit(1);
    }

    // Проверяем существование админа
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      console.error(`❌ Администратор с логином "${username}" не найден!`);
      process.exit(1);
    }

    const newPassword = await question('Введите новый пароль: ');
    const confirmPassword = await question('Подтвердите новый пароль: ');

    if (!newPassword) {
      console.error('❌ Пароль обязателен!');
      process.exit(1);
    }

    if (newPassword !== confirmPassword) {
      console.error('❌ Пароли не совпадают!');
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.error('❌ Пароль должен содержать минимум 6 символов!');
      process.exit(1);
    }

    console.log('\n⏳ Хеширование нового пароля...');
    
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword },
    });

    console.log('\n✅ Пароль успешно обновлен!');
    console.log(`   Логин: ${username}`);
    console.log('\n🔒 Новый пароль безопасно хеширован и сохранен в базе данных.\n');

  } catch (error) {
    console.error('❌ Ошибка при обновлении пароля:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

updatePassword();
