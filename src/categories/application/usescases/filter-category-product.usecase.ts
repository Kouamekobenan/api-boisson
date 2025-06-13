import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';
import { CategoryProductDto } from '../dtos/create-category.dto';

@Injectable()
export class FilterCategoryProductUseCase {
  constructor(
    @Inject(CategoryProductRepositoyName)
    private readonly categoryRepository: ICategoryProductRepository,
  ) {}
  async execute(filter: CategoryProductDto, limit: number, page: number) {
    try {
      const filters = await this.categoryRepository.filter(filter, limit, page);
      return filters;
    } catch (error) {
      throw new BadRequestException('Failed to filter category product', {
        cause: error,
        description: error,
      });
    }
  }
}
