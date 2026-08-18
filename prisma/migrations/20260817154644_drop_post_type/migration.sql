-- Drop the old PostType enum column now that Post.categoryId has been
-- backfilled from it.
ALTER TABLE "Post" DROP COLUMN "type";
DROP TYPE "PostType";
