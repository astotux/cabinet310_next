# 📡 API Documentation

## Базовый URL
```
http://localhost:3000/api
```

---

## 🔓 Публичные Endpoints

### 1. Проверка доступности времени

**POST** `/api/availability`

Проверяет, доступно ли выбранное время для бронирования с учетом конфликтов между услугами.

**Request Body:**
```json
{
  "service": "Маникюр",
  "date": "2026-03-15",
  "time": "14:00"
}
```

**Response (200):**
```json
{
  "available": true
}
```

**Response (200) - Конфликт:**
```json
{
  "available": false,
  "reason": "Конфликт с другой услугой"
}
```

**Пример использования:**
```javascript
const checkAvailability = async (service, date, time) => {
  const response = await fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service, date, time })
  });
  
  const data = await response.json();
  return data.available;
};
```

---

### 2. Создание записи

**POST** `/api/bookings`

Создает новую запись на услугу.

**Request Body:**
```json
{
  "service": "Маникюр",
  "master": "Мастер А",
  "date": "2026-03-15",
  "time": "14:00",
  "clientName": "Анна Иванова",
  "clientPhone": "+79991234567"
}
```

**Response (201):**
```json
{
  "id": 1,
  "service": "Маникюр",
  "master": "Мастер А",
  "date": "2026-03-15",
  "time": "14:00",
  "clientName": "Анна Иванова",
  "clientPhone": "+79991234567",
  "createdAt": "2026-03-02T12:00:00.000Z"
}
```

**Пример использования:**
```javascript
const createBooking = async (bookingData) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  
  if (response.ok) {
    const booking = await response.json();
    console.log('Запись создана:', booking);
  }
};
```

---

### 3. Получить одобренные отзывы

**GET** `/api/reviews`

Возвращает список одобренных отзывов.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Мария",
    "rating": 5,
    "text": "Отличная работа мастера!",
    "approved": true,
    "createdAt": "2026-03-01T10:00:00.000Z"
  }
]
```

**Пример использования:**
```javascript
const fetchReviews = async () => {
  const response = await fetch('/api/reviews');
  const reviews = await response.json();
  return reviews;
};
```

---

### 4. Отправить отзыв

**POST** `/api/reviews`

Отправляет новый отзыв на модерацию.

**Request Body:**
```json
{
  "name": "Елена",
  "rating": 5,
  "text": "Прекрасный сервис и профессиональные мастера!"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Елена",
  "rating": 5,
  "text": "Прекрасный сервис и профессиональные мастера!",
  "approved": false,
  "createdAt": "2026-03-02T12:30:00.000Z"
}
```

**Пример использования:**
```javascript
const submitReview = async (name, rating, text) => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, text })
  });
  
  if (response.ok) {
    alert('Отзыв отправлен на модерацию!');
  }
};
```

---

## 🔐 Админ Endpoints

### 5. Авторизация админа

**POST** `/api/admin/login`

Авторизует администратора.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "admin-token-1"
}
```

**Response (401):**
```json
{
  "error": "Неверные данные"
}
```

**Пример использования:**
```javascript
const adminLogin = async (username, password) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('adminToken', token);
    return true;
  }
  return false;
};
```

---

### 6. Получить все записи

**GET** `/api/bookings`

Возвращает все записи (требуется авторизация).

**Response (200):**
```json
[
  {
    "id": 1,
    "service": "Маникюр",
    "master": "Мастер А",
    "date": "2026-03-15",
    "time": "14:00",
    "clientName": "Анна Иванова",
    "clientPhone": "+79991234567",
    "createdAt": "2026-03-02T12:00:00.000Z"
  }
]
```

---

### 7. Удалить запись

**DELETE** `/api/bookings/[id]`

Удаляет запись по ID.

**Response (200):**
```json
{
  "success": true
}
```

**Пример использования:**
```javascript
const deleteBooking = async (id) => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    console.log('Запись удалена');
  }
};
```

---

### 8. Получить все отзывы (включая неодобренные)

**GET** `/api/admin/reviews`

Возвращает все отзывы для модерации.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Мария",
    "rating": 5,
    "text": "Отличная работа!",
    "approved": true,
    "createdAt": "2026-03-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Елена",
    "rating": 5,
    "text": "Прекрасный сервис!",
    "approved": false,
    "createdAt": "2026-03-02T12:30:00.000Z"
  }
]
```

---

### 9. Одобрить отзыв

**PATCH** `/api/admin/reviews/[id]`

Одобряет отзыв для публикации.

**Request Body:**
```json
{
  "approved": true
}
```

**Response (200):**
```json
{
  "id": 2,
  "name": "Елена",
  "rating": 5,
  "text": "Прекрасный сервис!",
  "approved": true,
  "createdAt": "2026-03-02T12:30:00.000Z"
}
```

**Пример использования:**
```javascript
const approveReview = async (id) => {
  const response = await fetch(`/api/admin/reviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved: true })
  });
  
  if (response.ok) {
    console.log('Отзыв одобрен');
  }
};
```

---

## 🔄 Логика конфликтов

### Матрица конфликтов услуг

| Услуга | Конфликтует с |
|--------|---------------|
| Маникюр | Перманент |
| Перманент | Маникюр, Ламинирование, Перманент |
| Ламинирование | Перманент, Ламинирование |

### Как это работает:

1. Клиент выбирает услугу, дату и время
2. API проверяет существующие записи на это время
3. Если найдена запись с конфликтующей услугой → возвращает `available: false`
4. Если конфликтов нет → возвращает `available: true`

**Пример:**
- Если на 14:00 уже записан "Перманент"
- То "Маникюр" на 14:00 будет недоступен
- Но "Ламинирование" на 14:00 будет доступно (если нет других конфликтов)

---

## 📊 Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс создан |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 404 | Не найдено |
| 500 | Ошибка сервера |

---

## 🧪 Тестирование API

### С помощью curl

```bash
# Проверка доступности
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -d '{"service":"Маникюр","date":"2026-03-15","time":"14:00"}'

# Создание записи
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "service":"Маникюр",
    "master":"Мастер А",
    "date":"2026-03-15",
    "time":"14:00",
    "clientName":"Тест",
    "clientPhone":"+79991234567"
  }'

# Получить отзывы
curl http://localhost:3000/api/reviews
```

### С помощью Postman

1. Импортируйте коллекцию endpoints
2. Установите базовый URL: `http://localhost:3000/api`
3. Для админ endpoints добавьте токен в localStorage

---

## 🔧 Расширение API

### Добавление нового endpoint

1. Создайте файл в `app/api/your-endpoint/route.ts`
2. Экспортируйте функции GET, POST, PUT, DELETE
3. Используйте Prisma для работы с БД

**Пример:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.yourModel.findMany();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await prisma.yourModel.create({ data: body });
  return NextResponse.json(result, { status: 201 });
}
```
