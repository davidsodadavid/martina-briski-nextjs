-- CreateTable
CREATE TABLE "EbookDownload" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookDownload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EbookDownload" ADD CONSTRAINT "EbookDownload_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
