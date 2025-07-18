-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryProductId" TEXT;

-- CreateTable
CREATE TABLE "CategoryProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryProduct_name_key" ON "CategoryProduct"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryProductId_fkey" FOREIGN KEY ("categoryProductId") REFERENCES "CategoryProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
