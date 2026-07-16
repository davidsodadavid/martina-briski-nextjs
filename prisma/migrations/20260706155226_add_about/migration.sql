-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "name" TEXT NOT NULL DEFAULT 'O meni',
    "thumbnail" TEXT,
    "steps" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);
