-- CreateTable
CREATE TABLE "LayoutView" (
    "id" SERIAL NOT NULL,
    "viewer_id" TEXT NOT NULL,
    "layoutId" INTEGER NOT NULL,

    CONSTRAINT "LayoutView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LayoutView_viewer_id_layoutId_idx" ON "LayoutView"("viewer_id", "layoutId");
