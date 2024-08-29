/*
  Warnings:

  - Added the required column `investorId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_userId_fkey";

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "investorId" INTEGER NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InvestingUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "InvestingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StartupInvestors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestingUser_email_key" ON "InvestingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_StartupInvestors_AB_unique" ON "_StartupInvestors"("A", "B");

-- CreateIndex
CREATE INDEX "_StartupInvestors_B_index" ON "_StartupInvestors"("B");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "InvestingUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StartupInvestors" ADD CONSTRAINT "_StartupInvestors_A_fkey" FOREIGN KEY ("A") REFERENCES "InvestingUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StartupInvestors" ADD CONSTRAINT "_StartupInvestors_B_fkey" FOREIGN KEY ("B") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
