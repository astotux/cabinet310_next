# 🧪 Тест авторизации

## Шаги для проверки:

1. Откройте http://localhost:3000/admin/login
2. Введите данные:
   - Логин: `admin`
   - Пароль: `admin123`
3. Нажмите "Войти"
4. Вы должны быть перенаправлены на `/admin`

## Что происходит при входе:

1. ✅ Отправляется POST запрос на `/api/admin/login`
2. ✅ Сервер проверяет данные в базе SQLite
3. ✅ При успехе устанавливается httpOnly cookie `adminToken`
4. ✅ Токен также сохраняется в localStorage
5. ✅ Происходит редирект на `/admin`
6. ✅ Middleware проверяет cookie и пропускает на страницу

## Если не работает:

### Проверьте консоль браузера (F12):
```javascript
// Должен быть токен
localStorage.getItem('adminToken')
```

### Проверьте cookies (F12 → Application → Cookies):
- Должен быть cookie `adminToken`

### Проверьте Network (F12 → Network):
- POST `/api/admin/login` должен вернуть 200
- Response должен содержать `{ token: "admin-token-1", success: true }`

### Если база пустая:
```bash
npm run seed
```

### Если проблемы с Prisma:
```bash
npx prisma generate
npx prisma migrate reset --force
npm run seed
```

## Выход из системы:

1. На странице `/admin` нажмите кнопку "Выйти"
2. Cookie будет удален
3. Вы будете перенаправлены на `/admin/login`

## Безопасность (для продакшена):

⚠️ Текущая реализация использует простую проверку пароля.

Для продакшена добавьте:
1. Хеширование паролей (bcrypt)
2. JWT токены вместо простых строк
3. CSRF защиту
4. Rate limiting
5. HTTPS обязательно
