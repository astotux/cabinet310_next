# Requirements Document

## Introduction

Система бронирования времени для студии красоты "Кабинет 310" требует переработки для корректного учета конфликтов времени между мастерами и услугами. Текущая реализация не учитывает правильную логику конфликтов, что приводит к возможности двойного бронирования и некорректному отображению доступных временных слотов.

Новая система должна:
- Использовать современный UI с календарем и списком временных слотов
- Корректно определять конфликты между услугами разных мастеров
- Хранить длительность услуг в числовом формате для точных вычислений
- Предоставлять API для проверки доступности с учетом всех правил конфликтов

## Glossary

- **Booking_System**: Система бронирования времени для студии красоты
- **Time_Slot**: Временной интервал, доступный для бронирования (например, 14:00)
- **Service**: Услуга, предоставляемая студией (Маникюр, Перманент, Ламинирование)
- **Master**: Специалист, выполняющий услугу (Мастер А, Мастер Б)
- **Conflict**: Ситуация, когда две услуги не могут выполняться одновременно
- **Duration**: Длительность услуги в минутах
- **Availability_API**: API-эндпоинт для проверки доступности временных слотов
- **Calendar_UI**: Интерфейс календаря для выбора даты
- **Price_Model**: Модель данных, хранящая информацию об услугах и ценах
- **Booking_Model**: Модель данных, хранящая информацию о бронированиях
- **Shared_Zone**: Общая рабочая зона, которая может использоваться только одним мастером одновременно

## Requirements

### Requirement 1: Calendar UI Implementation

**User Story:** Как клиент, я хочу видеть календарь с доступными датами и временными слотами, чтобы удобно выбрать время для визита.

#### Acceptance Criteria

1. THE Booking_System SHALL display a calendar interface matching the design from slide2.html
2. WHEN a user selects a date, THE Booking_System SHALL display available Time_Slots for that date
3. THE Booking_System SHALL group Time_Slots by time of day (morning, afternoon, evening)
4. WHEN a user selects a Time_Slot, THE Booking_System SHALL highlight it with gradient styling
5. THE Booking_System SHALL display navigation controls to switch between months

### Requirement 2: Duration Data Model Redesign

**User Story:** Как разработчик, я хочу хранить длительность услуг в числовом формате, чтобы точно вычислять занятое время и проверять конфликты.

#### Acceptance Criteria

1. THE Price_Model SHALL store Duration as an integer representing minutes
2. WHEN migrating existing data, THE Booking_System SHALL convert string durations (e.g., "1.5 часа") to integer minutes (e.g., 90)
3. THE Booking_System SHALL calculate end time of a booking by adding Duration to start time
4. FOR ALL Duration values, THE Booking_System SHALL accept only positive integers greater than zero

### Requirement 3: Conflict Detection for Manicure and Permanent

**User Story:** Как система, я хочу предотвращать одновременное бронирование Маникюра и Перманента, чтобы избежать конфликта использования общей зоны.

#### Acceptance Criteria

1. WHEN a Manicure booking exists for Master A, THE Availability_API SHALL mark overlapping Time_Slots as unavailable for Permanent service by Master B
2. WHEN a Permanent booking exists for Master B, THE Availability_API SHALL mark overlapping Time_Slots as unavailable for Manicure service by Master A
3. THE Booking_System SHALL calculate overlap by comparing start and end times of both services
4. IF Service A ends at time T and Service B starts at time T, THEN THE Booking_System SHALL consider them non-overlapping

### Requirement 4: Parallel Execution for Manicure and Lamination

**User Story:** Как система, я хочу разрешать одновременное выполнение Маникюра и Ламинирования, чтобы максимизировать использование студии.

#### Acceptance Criteria

1. WHEN a Manicure booking exists for Master A, THE Availability_API SHALL keep overlapping Time_Slots available for Lamination service by Master B
2. WHEN a Lamination booking exists for Master B, THE Availability_API SHALL keep overlapping Time_Slots available for Manicure service by Master A
3. THE Booking_System SHALL allow creating bookings for these services at the same time

### Requirement 5: Master Availability Enforcement

**User Story:** Как система, я хочу предотвращать двойное бронирование одного мастера, чтобы мастер не был назначен на две услуги одновременно.

#### Acceptance Criteria

1. WHEN a booking exists for a specific Master, THE Availability_API SHALL mark all overlapping Time_Slots as unavailable for that Master
2. THE Booking_System SHALL check Master availability regardless of service type
3. WHEN Master B has a Permanent booking, THE Availability_API SHALL mark overlapping Time_Slots as unavailable for Lamination by Master B
4. WHEN Master B has a Lamination booking, THE Availability_API SHALL mark overlapping Time_Slots as unavailable for Permanent by Master B

### Requirement 6: Availability API Implementation

**User Story:** Как фронтенд-разработчик, я хочу использовать API для получения доступных временных слотов, чтобы отображать их пользователю.

#### Acceptance Criteria

1. THE Availability_API SHALL accept parameters: service, master, date
2. WHEN called, THE Availability_API SHALL return a list of available Time_Slots for the specified date
3. THE Availability_API SHALL apply all conflict rules before returning results
4. THE Availability_API SHALL return Time_Slots in chronological order
5. WHEN no Time_Slots are available, THE Availability_API SHALL return an empty array
6. THE Availability_API SHALL respond within 500 milliseconds for any valid request

### Requirement 7: Time Slot Calculation

**User Story:** Как система, я хочу генерировать временные слоты с учетом рабочих часов студии, чтобы предлагать только реалистичные варианты бронирования.

#### Acceptance Criteria

1. THE Booking_System SHALL generate Time_Slots from 09:00 to 20:00 in 1-hour increments
2. WHEN calculating availability, THE Booking_System SHALL ensure the entire service Duration fits within working hours
3. IF a service Duration is 90 minutes and starts at 19:30, THEN THE Booking_System SHALL mark this Time_Slot as unavailable
4. THE Booking_System SHALL not generate Time_Slots for past dates

### Requirement 8: Booking Data Integrity

**User Story:** Как администратор, я хочу, чтобы все бронирования содержали полную информацию, чтобы избежать ошибок в расписании.

#### Acceptance Criteria

1. THE Booking_Model SHALL store service, master, date, time, clientName, clientPhone
2. WHEN creating a booking, THE Booking_System SHALL validate that all required fields are present
3. THE Booking_System SHALL validate that the selected Time_Slot is still available before confirming
4. IF a Time_Slot becomes unavailable during booking process, THEN THE Booking_System SHALL return an error message to the user

### Requirement 9: Conflict Matrix Implementation

**User Story:** Как разработчик, я хочу иметь централизованную логику конфликтов, чтобы легко поддерживать и расширять правила бронирования.

#### Acceptance Criteria

1. THE Booking_System SHALL implement a conflict detection function that accepts two bookings as parameters
2. THE Booking_System SHALL return true if bookings conflict, false otherwise
3. THE Booking_System SHALL apply the following rules:
   - Manicure (Master A) conflicts with Permanent (Master B) when times overlap
   - Manicure (Master A) does not conflict with Lamination (Master B)
   - Any service by the same Master conflicts with any other service by that Master when times overlap
4. THE Booking_System SHALL use this function in Availability_API to filter Time_Slots

### Requirement 10: UI State Management

**User Story:** Как пользователь, я хочу видеть обновленный список доступных слотов при выборе даты, чтобы понимать, какие варианты мне доступны.

#### Acceptance Criteria

1. WHEN a user selects a date in Calendar_UI, THE Booking_System SHALL fetch available Time_Slots from Availability_API
2. THE Booking_System SHALL display a loading indicator while fetching Time_Slots
3. WHEN Time_Slots are loaded, THE Booking_System SHALL render them grouped by time of day
4. IF an error occurs during fetching, THEN THE Booking_System SHALL display an error message to the user
5. THE Booking_System SHALL disable Time_Slot selection until data is loaded
