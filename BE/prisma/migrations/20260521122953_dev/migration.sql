/*
  Warnings:

  - You are about to drop the column `accentColor` on the `PortfolioCard` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundGradient` on the `PortfolioCard` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `PortfolioCard` table. All the data in the column will be lost.
  - You are about to drop the column `industryTag` on the `PortfolioCard` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `PortfolioCard` table. All the data in the column will be lost.
  - Added the required column `category` to the `PortfolioCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `PortfolioCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PortfolioCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PortfolioCard" DROP COLUMN "accentColor",
DROP COLUMN "backgroundGradient",
DROP COLUMN "companyName",
DROP COLUMN "industryTag",
DROP COLUMN "logoUrl",
ADD COLUMN     "accent" TEXT,
ADD COLUMN     "bg" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
