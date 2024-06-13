-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "reply_to_comment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reply_to_comment_id_fkey" FOREIGN KEY ("reply_to_comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
