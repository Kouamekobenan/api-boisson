import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/products/domain/entities/product.entity';
import { IProductRepository } from '../interface/product-repository.intrerface';

@Injectable()
export class LowerStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(page:number, limit:number) {
    try {
      return await this.productRepository.lower(page,limit);
    } catch (error) {
      throw new BadRequestException('Failed to stock lower ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
