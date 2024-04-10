-- AddForeignKey
ALTER TABLE "LayoutView" ADD CONSTRAINT "LayoutView_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
