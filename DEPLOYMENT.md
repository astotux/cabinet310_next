# 🚀 Инструкция по развертыванию

## Локальная разработка

### 1. Клонирование и установка
```bash
git clone <repository-url>
cd cabinet310_next
npm install
```

### 2. Настройка базы данных
```bash
# Применить миграции
npx prisma migrate dev

# Создать админа
npm run seed
```

### 3. Запуск dev сервера
```bash
npm run dev
```

Откройте http://localhost:3000

---

## Развертывание на Vercel

### Автоматическое развертывание

1. Подключите репозиторий к Vercel
2. Vercel автоматически определит Next.js проект
3. Настройте переменные окружения (см. ниже)
4. Нажмите Deploy

### Переменные окружения

Добавьте в Vercel:

```env
DATABASE_URL="file:./prisma/dev.db"
```

⚠️ **Важно:** Для продакшена на Vercel рекомендуется использовать внешнюю БД (PostgreSQL, PlanetScale, Turso)

### Миграции на Vercel

Добавьте в `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## Развертывание на VPS (Ubuntu/Debian)

### 1. Установка зависимостей

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2
```

### 2. Клонирование проекта

```bash
cd /var/www
git clone <repository-url> cabinet310
cd cabinet310
npm install
```

### 3. Настройка окружения

```bash
# Создать .env
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env

# Применить миграции
npx prisma migrate deploy
npx prisma generate

# Создать админа
npm run seed
```

### 4. Сборка проекта

```bash
npm run build
```

### 5. Запуск с PM2

```bash
pm2 start npm --name "cabinet310" -- start
pm2 save
pm2 startup
```

### 6. Настройка Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cabinet310 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL с Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Использование PostgreSQL (Рекомендуется для продакшена)

### 1. Обновите schema.prisma

```prisma
datasource db {
  provider = "postgresql"
}
```

### 2. Обновите .env

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### 3. Обновите lib/prisma.ts

Удалите адаптер libSQL и используйте стандартный PrismaClient:

```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### 4. Примените миграции

```bash
npx prisma migrate deploy
```

---

## Использование Turso (SQLite в облаке)

### 1. Создайте БД на Turso

```bash
turso db create cabinet310
turso db show cabinet310
```

### 2. Обновите .env

```env
DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

### 3. Обновите lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
})

const adapter = new PrismaLibSql(libsql)
export const prisma = new PrismaClient({ adapter })
```

---

## Мониторинг и логи

### PM2 команды

```bash
pm2 status              # Статус процессов
pm2 logs cabinet310     # Просмотр логов
pm2 restart cabinet310  # Перезапуск
pm2 stop cabinet310     # Остановка
pm2 delete cabinet310   # Удаление
```

### Просмотр логов Next.js

```bash
pm2 logs cabinet310 --lines 100
```

---

## Обновление проекта

```bash
cd /var/www/cabinet310
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart cabinet310
```

---

## Бэкап базы данных

### SQLite

```bash
# Создать бэкап
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# Восстановить
cp prisma/backup-20260302.db prisma/dev.db
```

### PostgreSQL

```bash
# Создать бэкап
pg_dump -U user database > backup.sql

# Восстановить
psql -U user database < backup.sql
```

---

## Безопасность

### Рекомендации для продакшена:

1. **Хеширование паролей**: Используйте bcrypt для паролей админа
2. **JWT токены**: Замените localStorage на httpOnly cookies
3. **Rate limiting**: Добавьте ограничение запросов
4. **CORS**: Настройте правильные CORS политики
5. **Environment variables**: Никогда не коммитьте .env файлы
6. **HTTPS**: Всегда используйте SSL сертификаты

### Пример добавления bcrypt:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

```typescript
import bcrypt from 'bcrypt';

// При создании админа
const hashedPassword = await bcrypt.hash('admin123', 10);

// При проверке
const isValid = await bcrypt.compare(password, admin.password);
```

---

## Troubleshooting

### Ошибка "PrismaClient is unable to run in this browser environment"

Убедитесь, что Prisma используется только в Server Components или API Routes.

### Ошибка миграций

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Проблемы с портами

```bash
# Найти процесс на порту 3000
lsof -i :3000

# Убить процесс
kill -9 <PID>
```

---

## Полезные ссылки

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [PM2 Docs](https://pm2.keymetrics.io/docs)
