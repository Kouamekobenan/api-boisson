-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
