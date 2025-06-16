import { Decimal } from '@prisma/client/runtime/library';
import { ProductEntity } from '../entities/product.entity';
import { Prisma, Product as productPrisma } from '@prisma/client';
import { ProductDto } from 'src/products/application/dtos/product-dto.dto';
import { UpdateProductDto } from 'src/products/application/dtos/update-dto.product-dto';
import { ProductByDto } from 'src/products/application/dtos/product-by-dto';

export class ProductMapper {
  private static readonly isUndefined = 'pas de description';

  toEntity(product: productPrisma): ProductEntity {
    return new ProductEntity(
      product.id,
      product.name,
      product.description ?? ProductMapper.isUndefined,
      product.criticalStockThreshold,
      product.price.toNumber(),
      product.purchasePrice.toNumber(),
      product.stock,
      product.supplierId,
      product.categoryProductId,
      product.createdAt,
      product.updatedAt,
    );
  }
  toPersistence(productDto: ProductDto): Prisma.ProductCreateInput {
    return {
      name: productDto.name,
      description: productDto.description,
      price: new Decimal(productDto.price),
      purchasePrice: new Decimal(productDto.purchasePrice),
      stock: productDto.stock,
      criticalStockThreshold: productDto.criticalStockThreshold,
      supplier: { connect: { id: productDto.supplierId } },
      ...(productDto.categoryProductId && {
        categoryProduct: {
          connect: { id: productDto.categoryProductId },
        },
      }),
    };
  }
  toUpdate(products: UpdateProductDto): any {
    const productData: any = {};
    if (products.name) {
      productData.name = products.name;
    }
    if (products.description) {
      productData.description = products.description;
    }
    if (products.price) {
      productData.price = products.price;
    }
    if (products.purchasePrice) {
      productData.purchasePrice = products.purchasePrice;
    }
    if (products.stock) {
      productData.stock = products.stock;
    }
    if (products.criticalStockThreshold !== undefined) {
      productData.criticalStockThreshold = products.criticalStockThreshold;
    }
    if (products.suplierId) {
      productData.suplierId = products.suplierId;
    }
    if (products.stock) {
      productData.stock = products.stock;
    }
    if (products.categoryProductId) {
      productData.categoryProductId = products.categoryProductId;
    }
    return productData;
  }

  toAddBy(products: ProductByDto): any {
    const productData: any = {};

    if (products.stock) {
      productData.stock = products.stock;
    }
    return productData;
  }
}
