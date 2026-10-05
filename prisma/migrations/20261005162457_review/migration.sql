-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_dealId_key" ON "Review"("dealId");

-- CreateIndex
CREATE INDEX "Review_productId_hidden_idx" ON "Review"("productId", "hidden");

-- CreateIndex
CREATE INDEX "Review_authorId_idx" ON "Review"("authorId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
