/*
  Warnings:

  - A unique constraint covering the columns `[product_id,position]` on the table `product_image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_product_id_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product_image" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Category_id_hidden_idx" ON "Category"("id", "hidden");

-- CreateIndex
CREATE INDEX "Category_parent_id_hidden_idx" ON "Category"("parent_id", "hidden");

-- CreateIndex
CREATE INDEX "product_image_product_id_idx" ON "product_image"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_product_id_position_key" ON "product_image"("product_id", "position");

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
