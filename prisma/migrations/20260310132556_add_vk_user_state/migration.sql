-- CreateTable
CREATE TABLE "VKUserState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vkUserId" INTEGER NOT NULL,
    "currentState" TEXT NOT NULL,
    "bookingData" TEXT,
    "lastActivity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VKUserState_vkUserId_key" ON "VKUserState"("vkUserId");
