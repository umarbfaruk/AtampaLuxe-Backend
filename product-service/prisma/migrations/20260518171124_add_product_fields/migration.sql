/*
  Warnings:

  - You are about to drop the column `dimensions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantitySold` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "dimensions",
DROP COLUMN "discountPrice",
DROP COLUMN "images",
DROP COLUMN "quantitySold",
DROP COLUMN "reviewCount",
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;
