# 🐛 Отладка проблем со входом

## ✅ ИСПРАВЛЕНО: Edge Runtime Compatibility

Проблема с `crypto` модулем в Edge Runtime была исправлена.
Теперь используется библиотека `jose`, совместимая с Edge Runtime.

## Что нужно сделать

### 1. Перезапустите dev сервер

```bash
# Остановите текущий сервер (Ctrl+C)
# Запустите заново
npm run dev
```

### 2. Попробуйте войти

Теперь вход должен работать корректно!

Вы должны увидеть в консоли логи:
- `[Login] Attempting login for: ваш_логин`
- `[Login] Admin found, verifying password...`
- `[Login] Password valid, generating token...`
- `[Login] Token generated, setting cookie...`
- `[Login] Login successful for: ваш_логин`
- `[Login] Success, redirecting to /admin`

### 4. Проверьте Network

На вкладке Network найдите запрос `login`:
- Статус должен быть 200
- В Response должен быть `{"token":"...", "success":true}`
- В Headers → Set-Cookie должна быть установка `adminToken`

### 5. Проверьте Cookies

В DevTools → Application → Cookies → localhost:
- Должна быть cookie `adminToken`
- Значение должно быть длинной строкой (JWT токен)

### 6. Проверьте консоль сервера

В терминале где запущен `npm run dev` должны быть логи:
- `[Login] Attempting login for: ...`
- `[Login] Login successful for: ...`
- `[Middleware] Valid token for admin: ...`

## Возможные проблемы

### Проблема: "Invalid token" в middleware

**Причина:** JWT_SECRET не совпадает или токен поврежден

**Решение:**
```bash
# Проверьте JWT_SECRET в .env
cat .env | grep JWT_SECRET

# Тест JWT
npm run test-jwt
```

### Проблема: Cookie не устанавливается

**Причина:** Проблемы с SameSite или Secure

**Решение:** Уже исправлено - используется `sameSite: 'lax'`

### Проблема: Пароль не подходит

**Причина:** Пароль в БД не хеширован или хеш неверный

**Решение:**
```bash
# Сгенерируйте новый хеш
npm run hash-password "ваш_пароль"

# Обновите в БД через Prisma Studio
npm run db:studio
```

### Проблема: Редирект не работает

**Причина:** Middleware блокирует доступ

**Решение:** Проверьте логи middleware в консоли сервера

## Тестовые команды

```bash
# Тест JWT токенов
npm run test-jwt

# Генерация хеша пароля
npm run hash-password "test123"

# Открыть БД
npm run db:studio
```

## Что проверить в БД

1. Откройте `npm run db:studio`
2. Таблица Admin
3. Проверьте:
   - `username` - ваш логин
   - `password` - должен начинаться с `$2a$` или `$2b$`
   - `email` - если используете для входа

## Если ничего не помогает

1. Очистите все cookies в браузере
2. Очистите localStorage
3. Перезапустите dev сервер
4. Создайте нового админа с новым паролем:
   ```bash
   npm run hash-password "newpassword123"
   # Обновите в БД через Prisma Studio
   ```
