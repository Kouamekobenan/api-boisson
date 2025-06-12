/*
  Warnings:

  - You are about to drop the `_DeliveryProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DeliveryProducts" DROP CONSTRAINT "_DeliveryProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeliveryProducts" DROP CONSTRAINT "_DeliveryProducts_B_fkey";

-- DropTable
DROP TABLE "_DeliveryProducts";

-- CreateTable
CREATE TABLE "DeliveryProduct" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryProduct_deliveryId_productId_key" ON "DeliveryProduct"("deliveryId", "productId");

-- AddForeignKey
ALTER TABLE "DeliveryProduct" ADD CONSTRAINT "DeliveryProduct_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryProduct" ADD CONSTRAINT "DeliveryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
