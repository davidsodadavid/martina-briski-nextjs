-- CreateTable
CREATE TABLE "BlogSettings" (
    "id" TEXT NOT NULL DEFAULT 'blog',
    "coverImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogSettings_pkey" PRIMARY KEY ("id")
);
