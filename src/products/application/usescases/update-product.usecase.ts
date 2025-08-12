import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/products/domain/entities/product.entity';
import { IProductRepository } from '../interface/product-repository.intrerface';
import { UpdateProductDto } from '../dtos/update-dto.product-dto';
@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(
    productId: string,
    productData: UpdateProductDto,
  ): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new BadRequestException('Product does not exist for this tenant');
      }
      if (productData.price < 0) {
        throw new BadRequestException('le prix ne peut être inferieur à zéro');
      }
      return await this.productRepository.updateProcut(
        productId,
        productData,
      );
    } catch (error) {
      throw new BadRequestException(`error use-case: ${error.message}`);
    }
  }
}
