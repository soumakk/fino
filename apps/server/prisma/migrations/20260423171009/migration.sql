/*
  Warnings:

  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `type` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EXPENSE', 'INCOME');

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "isDefault" SET DEFAULT false;

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked" SET DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "type" "TransactionType" NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
