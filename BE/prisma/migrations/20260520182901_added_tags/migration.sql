/*
  Warnings:

  - You are about to drop the column `accentColor` on the `PortfolioCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioCard" DROP COLUMN "accentColor",
ADD COLUMN     "tags" TEXT[];
