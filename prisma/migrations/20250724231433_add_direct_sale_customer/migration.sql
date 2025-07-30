-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CUSTOMER';

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "directSaleId" TEXT;

-- CreateTable
CREATE TABLE "DirectSale" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT,
    "customerId" TEXT,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "isCredit" BOOLEAN NOT NULL DEFAULT false,
    "amountPaid" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectSaleItem" (
    "id" TEXT NOT NULL,
    "directSaleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DirectSaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPayment" (
    "id" TEXT NOT NULL,
    "directSaleId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_directSaleId_fkey" FOREIGN KEY ("directSaleId") REFERENCES "DirectSale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSale" ADD CONSTRAINT "DirectSale_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSale" ADD CONSTRAINT "DirectSale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSaleItem" ADD CONSTRAINT "DirectSaleItem_directSaleId_fkey" FOREIGN KEY ("directSaleId") REFERENCES "DirectSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSaleItem" ADD CONSTRAINT "DirectSaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditPayment" ADD CONSTRAINT "CreditPayment_directSaleId_fkey" FOREIGN KEY ("directSaleId") REFERENCES "DirectSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
