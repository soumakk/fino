-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'CHEQUE', 'EMI', 'CRYPTO', 'OTHER');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH';
