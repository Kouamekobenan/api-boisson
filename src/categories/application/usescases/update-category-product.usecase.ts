import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategoryProductDto } from '../dtos/create-category.dto';
import { CategoryProduct } from 'src/categories/domain/entities/category.entity';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';
@Injectable()
export class UpdateCategoryProductUseCase {
  private readonly logger = new Logger(UpdateCategoryProductUseCase.name);
  constructor(
    @Inject(CategoryProductRepositoyName)
    private readonly categoryRepo: ICategoryProductRepository,
  ) {}
  async execute(
    id: string,
    updateDto: CategoryProductDto,
  ): Promise<CategoryProduct> {
    try {
      const category = await this.categoryRepo.findById(id);
      if (!category) {
        throw new NotFoundException('Category not found!');
      }
      return await this.categoryRepo.update(id, updateDto);
    } catch (error) {
      this.logger.error('Failed to update category product', error.message);
      throw new BadRequestException('Failed to update category product', {
        cause: error,
        description: error,
      });
    }
  }
}
