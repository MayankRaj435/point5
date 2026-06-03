/*
  Warnings:

  - You are about to drop the `ContactInquiry` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('BRANDING', 'SOCIAL_MEDIA_MANAGEMENT', 'DIGITAL_MARKETING', 'BRAND_PRODUCT_SHOOTS', 'WEDDING', 'EVENT_PHOTOGRAPHY_VIDEOGRAPHY', 'WEBSITE_DEVELOPMENT_MANAGEMENT');

-- DropTable
DROP TABLE "ContactInquiry";

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "subject" TEXT NOT NULL,
    "projectInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioCard" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "industryTag" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "accentColor" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioCard_pkey" PRIMARY KEY ("id")
);
