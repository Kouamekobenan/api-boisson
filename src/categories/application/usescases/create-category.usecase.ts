import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ICategoryProductRepository } from 'src/categories/domain/interfaces/category-repository.interface';
import { CategoryProductDto } from '../dtos/create-category.dto';
import { CategoryProduct } from 'src/categories/domain/entities/category.entity';

@Injectable()
export class CreateCategoryProductUseCase {
  private readonly logger = new Logger(CreateCategoryProductUseCase.name);
  constructor(
    @Inject('ICategoryProductRepository')
    private readonly categoryRepository: ICategoryProductRepository,
  ) {}
  async execute(createDto: CategoryProductDto): Promise<CategoryProduct> {
    try {
      const category = await this.categoryRepository.create(createDto);
      return category;
    } catch (error) {
      this.logger.error('Failed to create categorie', error.stack);
      throw new BadRequestException('Failed to created category product', {
        cause: error,
        description: error,
      });
    }
  }
}
