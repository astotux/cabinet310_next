# Кабинет 310 — Система записи и управления студией

Проект на Next.js 14+ (App Router) с системой бронирования, админ-панелью и отзывами.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных
```bash
# Применить миграции
npx prisma migrate dev

# Создать админа (логин: admin, пароль: admin123)
npm run seed
```

### 3. Запуск проекта
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📂 Структура проекта

```
├── app/
│   ├── page.tsx              # Главная страница
│   ├── booking/page.tsx      # Система бронирования (Stepper)
│   ├── reviews/page.tsx      # Страница отзывов
│   ├── contacts/page.tsx     # Контакты
│   ├── admin/
│   │   ├── login/page.tsx    # Вход в админку
│   │   └── page.tsx          # Админ-панель
│   └── api/
│       ├── availability/     # Проверка доступности времени
│       ├── bookings/         # CRUD записей
│       ├── reviews/          # Публичные отзывы
│       └── admin/            # Админ API
├── components/
│   └── Header.tsx            # Навигация
├── lib/
│   └── prisma.ts             # Prisma Client
└── prisma/
    ├── schema.prisma         # Схема БД
    └── dev.db                # SQLite база
```

## ⚙️ Логика бронирования (Conflict Matrix)

Система автоматически проверяет конфликты между услугами:

| Услуга | Мастер | Конфликтует с |
|--------|--------|---------------|
| Маникюр | А | Перманент (общая зона) |
| Перманент | Б | Все услуги (мастер занят) |
| Ламинирование | Б | Перманент (мастер занят) |

API `/api/availability` проверяет конфликты перед бронированием.

## 🔐 Админ-панель

**URL:** `/admin/login`

**Данные для входа:**
- Логин: `admin`
- Пароль: `admin123`

**Возможности:**
- Управление записями
- Модерация отзывов
- Просмотр статистики

## 🛠 Технологии

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite + Prisma ORM
- **Styling:** Tailwind CSS
- **TypeScript:** Полная типизация

## 📝 API Endpoints

### Публичные
- `POST /api/bookings` - Создать запись
- `POST /api/availability` - Проверить доступность
- `GET /api/reviews` - Получить одобренные отзывы
- `POST /api/reviews` - Отправить отзыв

### Админ
- `POST /api/admin/login` - Авторизация
- `GET /api/bookings` - Все записи
- `DELETE /api/bookings/[id]` - Удалить запись
- `GET /api/admin/reviews` - Все отзывы
- `PATCH /api/admin/reviews/[id]` - Одобрить отзыв

## 🎨 Особенности дизайна

- Glassmorphism эффекты
- Градиентные анимации
- Адаптивный дизайн (mobile-first)
- Плавающая навигация на мобильных
- Темная тема (опционально)

## 📱 Маршруты

- `/` - Главная
- `/booking` - Бронирование (3-шаговый Stepper)
- `/reviews` - Отзывы с формой
- `/contacts` - Контакты
- `/admin/login` - Вход в админку
- `/admin` - Панель управления

## 🔧 Команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сервера
npm run seed         # Создать админа
npx prisma studio    # Открыть Prisma Studio
```

## 📦 Зависимости

- `next` - React фреймворк
- `@prisma/client` - ORM клиент
- `@prisma/adapter-libsql` - SQLite адаптер для Prisma 7
- `@libsql/client` - libSQL клиент
- `react` & `react-dom` - UI библиотека
- `tailwindcss` - CSS фреймворк
- `typescript` - Типизация

## 🚨 Важно

1. База данных SQLite находится в `prisma/dev.db`
2. Для продакшена рекомендуется использовать PostgreSQL
3. Пароли в продакшене должны быть захешированы (bcrypt)
4. Добавьте JWT для безопасной авторизации админа

## 📄 Лицензия

MIT
