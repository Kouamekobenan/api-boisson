import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../interface/product-repository.intrerface';
import { ProductDto } from '../dtos/product-dto.dto';
import { ProductEntity } from 'src/products/domain/entities/product.entity';

@Injectable()
export class CreatePrductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(
    supplierId: string,
    dataProduct: ProductDto,
  ): Promise<ProductEntity> {
    try {
      if (dataProduct.price < 0) {
        throw new BadGatewayException('le prix ne pas être inferieur a zéro!');
      }
      if (dataProduct.purchasePrice > dataProduct.price) {
        throw new BadGatewayException(
          "Le prix d'achat doit être inferieur au prix de vente...! ",
        );
      }
      return this.productRepository.createProduct(supplierId, dataProduct);
    } catch (error) {
      throw new BadGatewayException(`error use-case: ${error.message}`);
    }
  }
}
