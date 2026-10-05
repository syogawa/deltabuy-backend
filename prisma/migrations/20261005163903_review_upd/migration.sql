/*
  Warnings:

  - You are about to drop the column `authorId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Review_authorId_idx";

-- DropIndex
DROP INDEX "Review_productId_hidden_idx";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "productId",
DROP COLUMN "updatedAt",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Review_product_id_hidden_idx" ON "Review"("product_id", "hidden");

-- CreateIndex
CREATE INDEX "Review_author_id_idx" ON "Review"("author_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
