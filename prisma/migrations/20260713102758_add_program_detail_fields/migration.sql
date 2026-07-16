-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "description" TEXT,
ADD COLUMN     "galleryImage" TEXT,
ADD COLUMN     "pdfFilename" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
