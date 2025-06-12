import { Decimal } from '@prisma/client/runtime/library';
import { ProductEntity } from '../entities/product.entity';
import { Product as productPrisma } from '@prisma/client';
import { ProductDto } from 'src/products/application/dtos/product-dto.dto';
import { UpdateProductDto } from 'src/products/application/dtos/update-dto.product-dto';
import { ProductByDto } from 'src/products/application/dtos/product-by-dto';

export class ProductMapper {
  private static readonly isUndefined = 'pas de description';

  toReceive(product: productPrisma): ProductEntity {
    return new ProductEntity(
      product.id,
      product.name,
      product.description ?? ProductMapper.isUndefined,
      product.price.toNumber(),
      product.purchasePrice.toNumber(),
      product.stock,
      product.supplierId,
      product.createdAt,
      product.updatedAt,
    );
  }

  toSend(productDto: ProductDto): any {
    return {
      name: productDto.name,
      description: productDto.description,
      price: new Decimal(productDto.price),
      purchasePrice: new Decimal(productDto.purchasePrice),
      stock: productDto.stock,
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
