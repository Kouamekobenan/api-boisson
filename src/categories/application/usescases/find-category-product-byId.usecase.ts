import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategoryProduct } from 'src/categories/domain/entities/category.entity';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';

@Injectable()
export class FindCategoryProductByIdUseCase {
  private readonly logger = new Logger(FindCategoryProductByIdUseCase.name);
  constructor(
    @Inject(CategoryProductRepositoyName)
    private categoryProductRepository: ICategoryProductRepository,
  ) {}
  async execute(id: string): Promise<CategoryProduct | null> {
    try {
        const category = await this.categoryProductRepository.findById(id);
        if (!category) {
            throw new NotFoundException(`Category not found :${id}`)
        }
      return category;
    } catch (error) {
      this.logger.error('Failed to retrieve to category', error.message);
      throw new BadRequestException('Failed to retrieve category', {
        cause: error,
        description: error.message,
      });
    }
  }
}
