-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_telegram" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_telegram_key" ON "User"("id_telegram");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
