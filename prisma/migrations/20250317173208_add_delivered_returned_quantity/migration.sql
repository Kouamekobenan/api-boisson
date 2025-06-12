-- AlterTable
ALTER TABLE "DeliveryProduct" ADD COLUMN     "deliveredQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "returnedQuantity" INTEGER NOT NULL DEFAULT 0;
