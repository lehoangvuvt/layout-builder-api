-- DropIndex
DROP INDEX "Bookmark_userId_layoutId_key";

-- CreateIndex
CREATE INDEX "Bookmark_userId_layoutId_idx" ON "Bookmark"("userId", "layoutId");
