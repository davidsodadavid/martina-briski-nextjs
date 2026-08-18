-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" TEXT NOT NULL DEFAULT 'contact',
    "heroPhoto" TEXT,
    "label" TEXT,
    "heading" TEXT,
    "text" TEXT,
    "email" TEXT,
    "mapAddress" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);
