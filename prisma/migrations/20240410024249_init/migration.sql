/*
  Warnings:

  - A unique constraint covering the columns `[userId,layoutId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Bookmark_userId_layoutId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_layoutId_key" ON "Bookmark"("userId", "layoutId");
