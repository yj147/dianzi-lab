-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "price" DECIMAL(10,2);
