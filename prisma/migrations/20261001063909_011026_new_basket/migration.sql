/*
  Warnings:

  - You are about to drop the column `created_at` on the `Basket` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Basket` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Basket` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Basket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Basket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Basket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_user_id_fkey";

-- AlterTable
ALTER TABLE "Basket" DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "sale_price" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Basket_userId_hidden_idx" ON "Basket"("userId", "hidden");

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
