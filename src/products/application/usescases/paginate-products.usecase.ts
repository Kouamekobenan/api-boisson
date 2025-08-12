import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../interface/product-repository.intrerface';
import { ProductEntity } from 'src/products/domain/entities/product.entity';

@Injectable()
export class PaginateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(tenantId: string, limit: number, page: number) {
    try {
      const products = await this.productRepository.paginate(
        tenantId,
        limit,
        page,
      );
      return products;
    } catch (error) {
      throw new BadRequestException('Failed to paginate products', {
        cause: error,
        description: error.message,
      });
    }
  }
}
