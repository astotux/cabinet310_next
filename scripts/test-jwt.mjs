/**
 * Тестовый скрипт для проверки JWT токенов
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

console.log('\n🔍 Тест JWT токенов\n');
console.log('JWT_SECRET:', JWT_SECRET);

// Создаем тестовый токен
const testPayload = {
  adminId: 1,
  username: 'test'
};

console.log('\n1. Генерация токена...');
const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '7d' });
console.log('✅ Токен создан:', token.substring(0, 50) + '...');

// Проверяем токен
console.log('\n2. Проверка токена...');
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Токен валиден!');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.error('❌ Ошибка проверки токена:', error.message);
}

// Если передан токен в аргументах, проверяем его
const tokenToTest = process.argv[2];
if (tokenToTest) {
  console.log('\n3. Проверка переданного токена...');
  try {
    const decoded = jwt.verify(tokenToTest, JWT_SECRET);
    console.log('✅ Токен валиден!');
    console.log('Decoded payload:', decoded);
  } catch (error) {
    console.error('❌ Ошибка проверки токена:', error.message);
  }
}

console.log('\n');
