-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "deliveryId" TEXT;

-- CreateTable
CREATE TABLE "_DeliveryProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeliveryProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DeliveryProducts_B_index" ON "_DeliveryProducts"("B");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryProducts" ADD CONSTRAINT "_DeliveryProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryProducts" ADD CONSTRAINT "_DeliveryProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
