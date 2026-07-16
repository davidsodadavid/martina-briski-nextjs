-- CreateTable
CREATE TABLE "Practice" (
    "id" TEXT NOT NULL DEFAULT 'practice',
    "name" TEXT NOT NULL DEFAULT 'Practice',
    "items" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);
