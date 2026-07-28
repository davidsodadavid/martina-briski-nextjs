-- CreateTable
CREATE TABLE "FreeContentSettings" (
    "id" TEXT NOT NULL DEFAULT 'free-content',
    "coverImage" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeContentSettings_pkey" PRIMARY KEY ("id")
);
