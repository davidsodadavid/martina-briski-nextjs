-- Add alt text column and make url unique so it can be looked up by URL
-- from public pages that only store a raw image URL string.
ALTER TABLE "Media" ADD COLUMN "alt" TEXT;
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");
