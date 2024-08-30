-- AlterTable
ALTER TABLE "Patent" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Patent" ADD CONSTRAINT "Patent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
