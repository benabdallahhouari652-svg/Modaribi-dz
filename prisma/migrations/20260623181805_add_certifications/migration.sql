/*
  Warnings:

  - You are about to drop the column `certifications` on the `users` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuer" TEXT,
    "year" INTEGER,
    "fileUrl" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "bio" TEXT,
    "cv" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "wilaya" TEXT,
    "municipality" TEXT,
    "maritalStatus" TEXT DEFAULT 'SINGLE',
    "title" TEXT,
    "experienceYears" INTEGER,
    "languages" TEXT,
    "ageGroupTarget" TEXT,
    "trainingType" TEXT,
    "availability" TEXT DEFAULT 'AVAILABLE',
    "isContracted" BOOLEAN NOT NULL DEFAULT false,
    "acceptsRemoteWork" BOOLEAN NOT NULL DEFAULT false,
    "acceptsTravel" BOOLEAN NOT NULL DEFAULT false,
    "acceptsWorkOutside" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_users" ("acceptsRemoteWork", "acceptsTravel", "acceptsWorkOutside", "ageGroupTarget", "availability", "avatar", "bio", "createdAt", "cv", "email", "experienceYears", "facebook", "id", "instagram", "isActive", "isContracted", "languages", "linkedin", "maritalStatus", "municipality", "name", "nameArabic", "passwordHash", "phone", "ratingAvg", "ratingCount", "role", "title", "trainingType", "updatedAt", "website", "whatsapp", "wilaya", "youtube") SELECT "acceptsRemoteWork", "acceptsTravel", "acceptsWorkOutside", "ageGroupTarget", "availability", "avatar", "bio", "createdAt", "cv", "email", "experienceYears", "facebook", "id", "instagram", "isActive", "isContracted", "languages", "linkedin", "maritalStatus", "municipality", "name", "nameArabic", "passwordHash", "phone", "ratingAvg", "ratingCount", "role", "title", "trainingType", "updatedAt", "website", "whatsapp", "wilaya", "youtube" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
