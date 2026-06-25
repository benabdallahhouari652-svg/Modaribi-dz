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
    "certifications" TEXT,
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
INSERT INTO "new_users" ("acceptsRemoteWork", "acceptsTravel", "acceptsWorkOutside", "ageGroupTarget", "availability", "avatar", "bio", "certifications", "createdAt", "email", "experienceYears", "facebook", "id", "instagram", "isActive", "languages", "linkedin", "municipality", "name", "nameArabic", "passwordHash", "phone", "ratingAvg", "ratingCount", "role", "title", "trainingType", "updatedAt", "website", "whatsapp", "wilaya", "youtube") SELECT "acceptsRemoteWork", "acceptsTravel", "acceptsWorkOutside", "ageGroupTarget", "availability", "avatar", "bio", "certifications", "createdAt", "email", "experienceYears", "facebook", "id", "instagram", "isActive", "languages", "linkedin", "municipality", "name", "nameArabic", "passwordHash", "phone", "ratingAvg", "ratingCount", "role", "title", "trainingType", "updatedAt", "website", "whatsapp", "wilaya", "youtube" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
