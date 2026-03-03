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

async function createAdmin() {
  try {
    console.log('\n🔐 Создание администратора с безопасным хешированием пароля\n');

    const username = await question('Введите логин администратора: ');
    const email = await question('Введите email (необязательно, нажмите Enter для пропуска): ');
    const password = await question('Введите пароль: ');
    const confirmPassword = await question('Подтвердите пароль: ');

    if (!username || !password) {
      console.error('❌ Логин и пароль обязательны!');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('❌ Пароли не совпадают!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Пароль должен содержать минимум 6 символов!');
      process.exit(1);
    }

    // Проверяем, существует ли уже админ с таким username
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      console.error(`❌ Администратор с логином "${username}" уже существует!`);
      process.exit(1);
    }

    // Проверяем email, если он указан
    if (email) {
      const existingEmail = await prisma.admin.findUnique({
        where: { email }
      });

      if (existingEmail) {
        console.error(`❌ Администратор с email "${email}" уже существует!`);
        process.exit(1);
      }
    }

    console.log('\n⏳ Хеширование пароля...');
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем админа
    const admin = await prisma.admin.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
      },
    });

    console.log('\n✅ Администратор успешно создан!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Логин: ${admin.username}`);
    if (admin.email) {
      console.log(`   Email: ${admin.email}`);
    }
    console.log('\n🔒 Пароль безопасно хеширован и сохранен в базе данных.\n');

  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();
