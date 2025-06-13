import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';

@Injectable()
export class DeleteCategoryProductUseCase {
  private logger = new Logger(DeleteCategoryProductUseCase.name);
  constructor(
    @Inject(CategoryProductRepositoyName)
    private readonly categoryRepository: ICategoryProductRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID :${id} not found`);
      }
      await this.categoryRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete category with ID:${id} ${error.stack}`,
      );
      throw new BadRequestException('Failed to delete category product ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
