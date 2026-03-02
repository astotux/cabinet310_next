/*
  Warnings:

  - Added the required column `category` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "master" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Price" ("createdAt", "description", "duration", "id", "image", "master", "price", "service", "category") 
SELECT "createdAt", "description", "duration", "id", "image", "master", "price", "service",
  CASE 
    WHEN "service" LIKE '%Перманент%' THEN 'Перманент'
    WHEN "service" LIKE '%Маникюр%' OR "service" LIKE '%Наращивание%' THEN 'Маникюр'
    WHEN "service" LIKE '%Ламинирование%' THEN 'Ламинирование'
    ELSE 'Перманент'
  END
FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
