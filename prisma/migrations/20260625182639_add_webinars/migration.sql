-- CreateTable
CREATE TABLE "webinars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "titleArabic" TEXT,
    "description" TEXT NOT NULL,
    "presenter" TEXT NOT NULL,
    "presenterBio" TEXT,
    "date" DATETIME NOT NULL,
    "duration" INTEGER,
    "zoomLink" TEXT,
    "videoUrl" TEXT,
    "thumbnail" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "maxAttendees" INTEGER,
    "createdById" TEXT,
    CONSTRAINT "webinars_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
