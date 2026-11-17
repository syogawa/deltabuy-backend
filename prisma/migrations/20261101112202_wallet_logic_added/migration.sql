-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'EARNING', 'REFUND', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DealStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "DealStatus" ADD VALUE 'DISPUTED';

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "holdBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'RUB',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" SERIAL NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance_after" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "external_id" TEXT,
    "deal_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_user_id_key" ON "wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transaction_external_id_key" ON "wallet_transaction"("external_id");

-- CreateIndex
CREATE INDEX "wallet_transaction_wallet_id_created_at_idx" ON "wallet_transaction"("wallet_id", "created_at");

-- CreateIndex
CREATE INDEX "wallet_transaction_deal_id_idx" ON "wallet_transaction"("deal_id");

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
