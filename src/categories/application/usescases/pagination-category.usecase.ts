import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';

@Injectable()
export class PaginateCategoryProductUseCase {
    private readonly logger=new Logger(PaginateCategoryProductUseCase.name)
  constructor(
    @Inject(CategoryProductRepositoyName)
    private readonly categoryProductRepository: ICategoryProductRepository,
  ) {}
  async execute(limit: number, page: number) {
    try {
      return await this.categoryProductRepository.pagination(limit, page);
    } catch (error) {
      throw new BadRequestException('Failed to pagination category product', {
        cause: error,
        description: error.message,
      });
    }
  }
}
