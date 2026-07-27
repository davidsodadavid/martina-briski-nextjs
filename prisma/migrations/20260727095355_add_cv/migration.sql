-- CreateTable
CREATE TABLE "Cv" (
    "id" TEXT NOT NULL DEFAULT 'cv',
    "title" TEXT NOT NULL DEFAULT 'Martina Briški',
    "subtitle" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);
