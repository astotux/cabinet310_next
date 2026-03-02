# Technical Design Document

## Overview

Система бронирования времени для студии красоты "Кабинет 310" требует полной переработки логики определения конфликтов и управления временными слотами. Текущая реализация имеет критические недостатки:

- Длительность услуг хранится в строковом формате ("1.5 часа"), что делает невозможным точные вычисления
- Отсутствует корректная логика определения конфликтов между услугами разных мастеров
- Нет современного UI для выбора даты и времени
- Отсутствует API для проверки доступности временных слотов

Новая система будет построена на следующих принципах:

**Технологический стек:**
- Next.js 14 с App Router (существующий)
- TypeScript для типобезопасности
- Prisma ORM с SQLite (существующий)
- React Hook Form для управления формами
- date-fns для работы с датами и временем
- react-day-picker для календарного UI
- fast-check для property-based тестирования

**Ключевые улучшения:**
- Миграция модели данных для хранения длительности в минутах (integer)
- Централизованная функция определения конфликтов с четкими правилами
- REST API эндпоинт для проверки доступности временных слотов
- Современный календарный интерфейс с группировкой слотов по времени суток
- Валидация доступности перед подтверждением бронирования

## Architecture

### System Components

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Calendar UI Component]
        Form[Booking Form]
    end
    
    subgraph "API Layer"
        AvailAPI[/api/availability]
        BookAPI[/api/bookings]
        ServAPI[/api/services]
    end
    
    subgraph "Business Logic Layer"
        ConflictEngine[Conflict Detection Engine]
        SlotGen[Time Slot Generator]
        Validator[Booking Validator]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        DB[(SQLite Database)]
    end
    
    UI --> AvailAPI
    Form --> BookAPI
    Form --> ServAPI
    
    AvailAPI --> SlotGen
    AvailAPI --> ConflictEngine
    BookAPI --> Validator
    BookAPI --> ConflictEngine
    
    SlotGen --> Prisma
    ConflictEngine --> Prisma
    Validator --> Prisma
    
    Prisma --> DB
```

### Data Flow

**Сценарий 1: Проверка доступности**
1. Пользователь выбирает услугу и мастера
2. Пользователь выбирает дату в календаре
3. UI отправляет GET запрос к `/api/availability?service={id}&master={name}&date={YYYY-MM-DD}`
4. API генерирует все возможные временные слоты для выбранной даты (09:00-20:00)
5. API загружает все существующие бронирования на эту дату
6. Conflict Detection Engine фильтрует слоты, применяя правила конфликтов
7. API возвращает список доступных слотов
8. UI отображает слоты, сгруппированные по времени суток

**Сценарий 2: Создание бронирования**
1. Пользователь выбирает временной слот и заполняет контактные данные
2. UI отправляет POST запрос к `/api/bookings`
3. Booking Validator проверяет, что слот все еще доступен (race condition protection)
4. Если доступен - создается запись в БД
5. Если недоступен - возвращается ошибка 409 Conflict
6. UI показывает результат пользователю

### Conflict Detection Rules

Система использует матрицу конфликтов для определения, могут ли две услуги выполняться одновременно:

| Услуга 1 (Мастер) | Услуга 2 (Мастер) | Конфликт? | Причина |
|-------------------|-------------------|-----------|---------|
| Маникюр (А) | Перманент (Б) | ✅ Да | Общая рабочая зона |
| Маникюр (А) | Ламинирование (Б) | ❌ Нет | Разные зоны |
| Перманент (Б) | Ламинирование (Б) | ✅ Да | Один мастер |
| Любая (X) | Любая (X) | ✅ Да | Один мастер |

**Правила определения перекрытия времени:**
- Две услуги перекрываются, если их временные интервалы имеют общие минуты
- Если услуга A заканчивается ровно в момент начала услуги B, они НЕ перекрываются
- Формула: `(start1 < end2) && (start2 < end1)`

## Components and Interfaces

### 1. Calendar UI Component

**Расположение:** `app/booking/components/BookingCalendar.tsx`

**Ответственность:**
- Отображение календаря для выбора даты
- Отображение доступных временных слотов
- Управление состоянием выбора
- Группировка слотов по времени суток (утро: 09:00-12:00, день: 12:00-17:00, вечер: 17:00-20:00)

**Props Interface:**
```typescript
interface BookingCalendarProps {
  serviceId: number;
  master: string;
  onSlotSelect: (date: string, time: string) => void;
}
```

**State:**
```typescript
interface CalendarState {
  selectedDate: Date | undefined;
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
}

interface TimeSlot {
  time: string; // "HH:mm" format
  available: boolean;
}
```

**Библиотека:** react-day-picker v8 - легковесная, гибкая, с хорошей поддержкой TypeScript

### 2. Availability API Endpoint

**Расположение:** `app/api/availability/route.ts`

**HTTP Method:** GET

**Query Parameters:**
```typescript
interface AvailabilityQuery {
  service: string;    // ID услуги
  master: string;     // Имя мастера
  date: string;       // YYYY-MM-DD формат
}
```

**Response:**
```typescript
interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  time: string;       // "HH:mm" формат
  available: boolean;
}
```

**Error Responses:**
- 400 Bad Request - невалидные параметры
- 404 Not Found - услуга не найдена
- 500 Internal Server Error - ошибка сервера

### 3. Conflict Detection Engine

**Расположение:** `lib/booking/conflictDetection.ts`

**Основная функция:**
```typescript
interface BookingInterval {
  service: string;
  master: string;
  startTime: Date;
  endTime: Date;
}

function hasConflict(
  booking1: BookingInterval,
  booking2: BookingInterval
): boolean
```

**Логика:**
1. Проверка перекрытия времени: `(start1 < end2) && (start2 < end1)`
2. Если времена не перекрываются - нет конфликта
3. Если перекрываются и один мастер - конфликт
4. Если перекрываются, разные мастера, и одна из услуг "Маникюр", а другая "Перманент" - конфликт
5. Иначе - нет конфликта

**Вспомогательные функции:**
```typescript
function isOverlapping(start1: Date, end1: Date, start2: Date, end2: Date): boolean

function isSharedZoneConflict(service1: string, service2: string): boolean
```

### 4. Time Slot Generator

**Расположение:** `lib/booking/slotGenerator.ts`

**Основная функция:**
```typescript
function generateTimeSlots(
  date: Date,
  serviceDuration: number, // в минутах
  workingHours: { start: string; end: string }
): string[]
```

**Логика:**
- Генерирует слоты с шагом 60 минут (09:00, 10:00, 11:00, ...)
- Проверяет, что услуга полностью помещается в рабочие часы
- Не генерирует слоты для прошедших дат
- Возвращает массив строк в формате "HH:mm"

### 5. Booking Validator

**Расположение:** `lib/booking/validator.ts`

**Основная функция:**
```typescript
interface BookingData {
  service: string;
  master: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

async function validateBooking(data: BookingData): Promise<ValidationResult>

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

**Проверки:**
- Все обязательные поля заполнены
- Дата не в прошлом
- Время в формате HH:mm
- Телефон в валидном формате
- Выбранный слот все еще доступен (проверка через Conflict Detection Engine)

## Data Models

### Обновленная Prisma Schema

```prisma
model Price {
  id          Int      @id @default(autoincrement())
  service     String
  description String?
  category    String
  master      String
  duration    Int      // ИЗМЕНЕНО: было String, стало Int (минуты)
  price       Int
  image       String?
  createdAt   DateTime @default(now())
}

model Booking {
  id          Int      @id @default(autoincrement())
  service     String
  master      String
  date        String   // YYYY-MM-DD формат
  time        String   // HH:mm формат
  clientName  String
  clientPhone String
  createdAt   DateTime @default(now())
}
```

### Миграция данных

**Файл миграции:** `prisma/migrations/YYYYMMDDHHMMSS_convert_duration_to_minutes/migration.sql`

**Стратегия:**
1. Создать временную колонку `duration_minutes` типа INTEGER
2. Конвертировать существующие данные:
   - "1 час" → 60
   - "1.5 часа" → 90
   - "2 часа" → 120
   - "45 минут" → 45
3. Удалить старую колонку `duration`
4. Переименовать `duration_minutes` в `duration`

**Функция конвертации:**
```typescript
function parseDurationToMinutes(duration: string): number {
  // Парсинг строк вида "1.5 часа", "45 минут"
  const hourMatch = duration.match(/(\d+\.?\d*)\s*час/);
  const minuteMatch = duration.match(/(\d+)\s*минут/);
  
  if (hourMatch) {
    return Math.round(parseFloat(hourMatch[1]) * 60);
  }
  if (minuteMatch) {
    return parseInt(minuteMatch[1]);
  }
  
  throw new Error(`Cannot parse duration: ${duration}`);
}
```

### TypeScript Types

```typescript
// Типы для работы с услугами
interface Service {
  id: number;
  service: string;
  description: string | null;
  category: string;
  master: string;
  duration: number; // минуты
  price: number;
  image: string | null;
  createdAt: Date;
}

// Типы для работы с бронированиями
interface Booking {
  id: number;
  service: string;
  master: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clientName: string;
  clientPhone: string;
  createdAt: Date;
}

// Вспомогательные типы
interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingInterval {
  service: string;
  master: string;
  startTime: Date;
  endTime: Date;
}

interface WorkingHours {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

После анализа acceptance criteria были выявлены следующие избыточности:

**Объединенные свойства:**
- 3.1 и 3.2 (Manicure-Permanent конфликты) объединены в одно симметричное свойство
- 4.1 и 4.2 (Manicure-Lamination отсутствие конфликтов) объединены в одно симметричное свойство
- 5.3 и 5.4 являются примерами общего свойства 5.1 и не требуют отдельных property-тестов
- 10.3 дублирует 1.3 и будет покрыто одним свойством

**Исключенные свойства:**
- 6.3 и 9.6 - это требования к интеграции, а не отдельные тестируемые свойства
- 1.1 и 1.4 - визуальные требования, не поддающиеся автоматизированному тестированию
- 6.6 - требование производительности, не функциональная корректность

### Property 1: Duration Storage Type Validation

*For any* service record in the Price model, the duration field must be stored as a positive integer greater than zero representing minutes.

**Validates: Requirements 2.1, 2.4**

### Property 2: Duration String Conversion

*For any* valid duration string (e.g., "1.5 часа", "45 минут", "2 часа"), the migration function must convert it to the correct integer value in minutes.

**Validates: Requirements 2.2**

### Property 3: End Time Calculation

*For any* booking with a start time and service duration, the calculated end time must equal the start time plus the duration in minutes.

**Validates: Requirements 2.3**

### Property 4: Time Overlap Detection

*For any* two time intervals, the overlap detection function must correctly identify whether they overlap, treating intervals as non-overlapping when one ends exactly when the other begins.

**Validates: Requirements 3.3**

### Property 5: Manicure-Permanent Conflict Detection

*For any* Manicure booking by Master A and any Permanent booking by Master B, if their time intervals overlap, the conflict detection function must return true (conflict exists).

**Validates: Requirements 3.1, 3.2, 9.3**

### Property 6: Manicure-Lamination Non-Conflict

*For any* Manicure booking by Master A and any Lamination booking by Master B, the conflict detection function must return false (no conflict), regardless of time overlap.

**Validates: Requirements 4.1, 4.2, 4.3, 9.4**

### Property 7: Same Master Conflict

*For any* two bookings assigned to the same master with overlapping time intervals, the conflict detection function must return true (conflict exists), regardless of service types.

**Validates: Requirements 5.1, 5.2, 9.5**

### Property 8: Availability API Response Structure

*For any* valid availability API request (service, master, date), the response must contain a list of time slots in chronological order.

**Validates: Requirements 6.2, 6.4**

### Property 9: Time Slot Generation Range

*For any* date, the time slot generator must produce slots starting at 09:00 and ending no later than 20:00, with 1-hour increments.

**Validates: Requirements 7.1**

### Property 10: Service Duration Fits Working Hours

*For any* time slot and service duration, if the service would extend beyond working hours (20:00), the slot must be marked as unavailable.

**Validates: Requirements 7.2**

### Property 11: Past Date Exclusion

*For any* date in the past, the time slot generator must not produce any time slots.

**Validates: Requirements 7.4**

### Property 12: Booking Data Completeness

*For any* booking record, all required fields (service, master, date, time, clientName, clientPhone) must be present and non-empty.

**Validates: Requirements 8.1, 8.2**

### Property 13: Availability Revalidation Before Booking

*For any* booking creation request, the system must revalidate that the selected time slot is still available before confirming the booking.

**Validates: Requirements 8.3**

### Property 14: Time Slot Grouping

*For any* list of time slots, they must be correctly grouped into morning (09:00-12:00), afternoon (12:00-17:00), and evening (17:00-20:00) categories.

**Validates: Requirements 1.3, 10.3**

### Property 15: UI State During Fetch

*For any* date selection in the calendar UI, the system must display a loading indicator while fetching slots and disable slot selection until data is loaded.

**Validates: Requirements 10.2, 10.5**

### Property 16: Error Handling in UI

*For any* error that occurs during time slot fetching, the system must display an error message to the user.

**Validates: Requirements 10.4**

## Error Handling

### API Error Responses

**Availability API (`/api/availability`):**
- 400 Bad Request: Отсутствуют обязательные параметры или невалидный формат даты
- 404 Not Found: Услуга с указанным ID не найдена
- 500 Internal Server Error: Ошибка при работе с базой данных или внутренняя ошибка сервера

**Booking API (`/api/bookings`):**
- 400 Bad Request: Невалидные данные бронирования (отсутствуют поля, неверный формат)
- 409 Conflict: Выбранный временной слот уже недоступен (race condition)
- 500 Internal Server Error: Ошибка при создании записи в БД

### Client-Side Error Handling

**Сетевые ошибки:**
```typescript
try {
  const response = await fetch('/api/availability?...');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  // обработка данных
} catch (error) {
  // Показать пользователю сообщение об ошибке
  setError('Не удалось загрузить доступные слоты. Попробуйте позже.');
}
```

**Валидация на клиенте:**
- Проверка заполнения всех обязательных полей перед отправкой
- Валидация формата телефона (российский формат)
- Проверка, что выбрана дата и время
- Блокировка повторной отправки формы (debounce)

### Database Error Handling

**Prisma Errors:**
- `PrismaClientKnownRequestError`: Обработка известных ошибок (unique constraint, foreign key)
- `PrismaClientUnknownRequestError`: Логирование и возврат 500
- `PrismaClientInitializationError`: Критическая ошибка, требует перезапуска

**Транзакции:**
Для операций создания бронирования использовать Prisma транзакции для обеспечения атомарности:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Проверить доступность
  // 2. Создать бронирование
  // Если любой шаг падает - откатить всё
});
```

## Testing Strategy

### Dual Testing Approach

Система будет тестироваться с использованием двух взаимодополняющих подходов:

**Unit Tests (Vitest):**
- Конкретные примеры и граничные случаи
- Интеграционные точки между компонентами
- Специфические сценарии ошибок
- Примеры: тест на конкретную дату, тест на пустой массив слотов, тест на конкретный конфликт

**Property-Based Tests (fast-check):**
- Универсальные свойства, которые должны выполняться для всех входных данных
- Автоматическая генерация тестовых случаев
- Обнаружение граничных случаев, о которых мы не подумали
- Минимум 100 итераций на каждый property-тест

### Property-Based Testing Configuration

**Библиотека:** fast-check (https://github.com/dubzzz/fast-check)
- Зрелая библиотека для JavaScript/TypeScript
- Отличная интеграция с Vitest
- Поддержка shrinking (упрощение failing примеров)
- Богатый набор встроенных генераторов

**Конфигурация тестов:**
```typescript
import { test } from 'vitest';
import * as fc from 'fast-check';

test('Feature: booking-time-system-redesign, Property 1: Duration Storage Type Validation', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 480 }), // duration в минутах
      (duration) => {
        // Тест свойства
        expect(typeof duration).toBe('number');
        expect(duration).toBeGreaterThan(0);
        expect(Number.isInteger(duration)).toBe(true);
      }
    ),
    { numRuns: 100 } // минимум 100 итераций
  );
});
```

**Кастомные генераторы:**
```typescript
// Генератор временных слотов
const timeSlotArbitrary = fc.integer({ min: 9, max: 19 }).map(hour => 
  `${hour.toString().padStart(2, '0')}:00`
);

// Генератор дат
const dateArbitrary = fc.date({ 
  min: new Date('2024-01-01'), 
  max: new Date('2025-12-31') 
});

// Генератор бронирований
const bookingArbitrary = fc.record({
  service: fc.constantFrom('Маникюр', 'Перманент', 'Ламинирование'),
  master: fc.constantFrom('Мастер А', 'Мастер Б'),
  date: dateArbitrary,
  time: timeSlotArbitrary,
  duration: fc.integer({ min: 30, max: 180 })
});
```

### Test Coverage Goals

**Unit Tests:**
- Покрытие всех API эндпоинтов
- Тесты на все error responses
- Тесты на валидацию входных данных
- Тесты на UI компоненты (React Testing Library)
- Минимальное покрытие: 80% строк кода

**Property Tests:**
- Каждое свойство из раздела Correctness Properties должно иметь соответствующий property-based тест
- Тесты должны быть помечены комментарием с номером свойства
- Формат тега: `Feature: booking-time-system-redesign, Property {N}: {property_title}`

**Integration Tests:**
- End-to-end тест полного flow бронирования
- Тест на race condition (параллельные запросы на одно время)
- Тест миграции данных (старый формат → новый формат)

### Test Organization

```
tests/
├── unit/
│   ├── api/
│   │   ├── availability.test.ts
│   │   └── bookings.test.ts
│   ├── lib/
│   │   ├── conflictDetection.test.ts
│   │   ├── slotGenerator.test.ts
│   │   └── validator.test.ts
│   └── components/
│       └── BookingCalendar.test.tsx
├── property/
│   ├── duration.property.test.ts
│   ├── conflicts.property.test.ts
│   ├── slots.property.test.ts
│   └── validation.property.test.ts
└── integration/
    ├── booking-flow.test.ts
    └── migration.test.ts
```

### Example Property Test

```typescript
import { test, expect } from 'vitest';
import * as fc from 'fast-check';
import { hasConflict } from '@/lib/booking/conflictDetection';

test('Feature: booking-time-system-redesign, Property 7: Same Master Conflict', () => {
  fc.assert(
    fc.property(
      fc.record({
        master: fc.constantFrom('Мастер А', 'Мастер Б'),
        service1: fc.constantFrom('Маникюр', 'Перманент', 'Ламинирование'),
        service2: fc.constantFrom('Маникюр', 'Перманент', 'Ламинирование'),
        startTime1: fc.date(),
        duration1: fc.integer({ min: 30, max: 180 }),
        startTime2: fc.date(),
        duration2: fc.integer({ min: 30, max: 180 })
      }),
      ({ master, service1, service2, startTime1, duration1, startTime2, duration2 }) => {
        const endTime1 = new Date(startTime1.getTime() + duration1 * 60000);
        const endTime2 = new Date(startTime2.getTime() + duration2 * 60000);
        
        const booking1 = { service: service1, master, startTime: startTime1, endTime: endTime1 };
        const booking2 = { service: service2, master, startTime: startTime2, endTime: endTime2 };
        
        const overlaps = (startTime1 < endTime2) && (startTime2 < endTime1);
        const conflict = hasConflict(booking1, booking2);
        
        // Если времена перекрываются и один мастер - должен быть конфликт
        if (overlaps) {
          expect(conflict).toBe(true);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

