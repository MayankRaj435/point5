/*
  Warnings:

  - You are about to drop the column `slogan` on the `PortfolioCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `PortfolioCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `PortfolioCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `PortfolioCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PortfolioCard" DROP COLUMN "slogan",
ADD COLUMN     "accentColor" TEXT,
ADD COLUMN     "backgroundGradient" TEXT,
ADD COLUMN     "deliverables" TEXT[],
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tagline" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioCard_slug_key" ON "PortfolioCard"("slug");
