/*
  Warnings:

  - You are about to drop the column `user_id` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the `Basket` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `buyer_id` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_at_purchase` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_snapshot` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_productId_fkey";

-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_userId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_user_id_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "user_id",
ADD COLUMN     "buyer_id" INTEGER NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "price_at_purchase" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "product_snapshot" JSONB NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Basket";

-- CreateTable
CREATE TABLE "basket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "basket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "basket_user_id_hidden_idx" ON "basket"("user_id", "hidden");

-- CreateIndex
CREATE UNIQUE INDEX "basket_user_id_product_id_key" ON "basket"("user_id", "product_id");

-- CreateIndex
CREATE INDEX "Deal_buyer_id_idx" ON "Deal"("buyer_id");

-- CreateIndex
CREATE INDEX "Deal_product_id_idx" ON "Deal"("product_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basket" ADD CONSTRAINT "basket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basket" ADD CONSTRAINT "basket_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
