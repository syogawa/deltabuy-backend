/*
  Warnings:

  - A unique constraint covering the columns `[user_id,product_id]` on the table `product_views` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Favorite_user_id_hidden_idx" ON "Favorite"("user_id", "hidden");

-- CreateIndex
CREATE UNIQUE INDEX "product_views_user_id_product_id_key" ON "product_views"("user_id", "product_id");
