/*
  Warnings:

  - A unique constraint covering the columns `[viewer_id,layoutId]` on the table `LayoutView` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LayoutView_viewer_id_layoutId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "LayoutView_viewer_id_layoutId_key" ON "LayoutView"("viewer_id", "layoutId");
