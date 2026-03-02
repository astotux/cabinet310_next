/*
  Warnings:

  - You are about to alter the column `duration` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Создаем временную таблицу с новой структурой
CREATE TABLE "new_Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "master" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Конвертируем данные из старой таблицы в новую
-- Обрабатываем различные форматы: "1 час", "1.5 часа", "45 минут"
INSERT INTO "new_Price" ("id", "service", "description", "category", "master", "duration", "price", "image", "createdAt")
SELECT 
    "id",
    "service",
    "description",
    "category",
    "master",
    CASE
        -- Если содержит "час" - умножаем на 60
        WHEN "duration" LIKE '%час%' THEN 
            CAST(ROUND(CAST(REPLACE(REPLACE(REPLACE("duration", ' часа', ''), ' час', ''), ' часов', '') AS REAL) * 60) AS INTEGER)
        -- Если содержит "минут" - берем число как есть
        WHEN "duration" LIKE '%минут%' THEN 
            CAST(REPLACE(REPLACE("duration", ' минут', ''), ' минуты', '') AS INTEGER)
        -- По умолчанию - пытаемся преобразовать в число (если уже число)
        ELSE CAST("duration" AS INTEGER)
    END as "duration",
    "price",
    "image",
    "createdAt"
FROM "Price";

-- Удаляем старую таблицу
DROP TABLE "Price";

-- Переименовываем новую таблицу
ALTER TABLE "new_Price" RENAME TO "Price";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

