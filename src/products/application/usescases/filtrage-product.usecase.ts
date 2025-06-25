import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IProductRepository } from '../interface/product-repository.intrerface';
import { FilterProductDto } from '../dtos/filtrage-product.dto';
import { ProductEntity } from 'src/products/domain/entities/product.entity';

@Injectable()
export class FiterProductUseCase {
  private readonly logger = new Logger(FiterProductUseCase.name);
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(input: FilterProductDto, page?: number, limit?: number) {
    try {
      const products = await this.productRepository.filter(input, page, limit);
      this.logger.log('data filters!:', JSON.stringify(products));
      return products;
    } catch (error) {
      this.logger.error('Failed to filter product!:', error);
      throw new BadRequestException('Failed retrieve to product:', {
        cause: error,
        description: error.message,
      });
    }
  }
}
