import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IProductRepository } from '../interface/product-repository.intrerface';
import { ProductDto } from '../dtos/product-dto.dto';
import { ProductEntity } from 'src/products/domain/entities/product.entity';
import {
  CategoryProductRepositoyName,
  ICategoryProductRepository,
} from 'src/categories/domain/interfaces/category-repository.interface';

@Injectable()
export class CreatePrductUseCase {
  private readonly logger = new Logger(CreatePrductUseCase.name);
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject(CategoryProductRepositoyName)
    private readonly categoryRepository: ICategoryProductRepository,
  ) {}
  async execute(dataProduct: ProductDto): Promise<ProductEntity> {
    try {
      if (!dataProduct.categoryProductId) {
        throw new BadRequestException('categoryProductId est requis');
      }
      const category = await this.categoryRepository.findById(
        dataProduct.categoryProductId,
      );
      if (!category?.getId()) {
        throw new NotFoundException(
          `Category not found in table categry! :${dataProduct.categoryProductId}`,
        );
      }
      if (dataProduct.price < 0) {
        throw new ConflictException('le prix ne pas être inferieur a zéro!');
      }
      if (dataProduct.purchasePrice > dataProduct.price) {
        throw new ConflictException(
          "Le prix d'achat doit être inferieur au prix de vente...! ",
        );
      }
      return this.productRepository.createProduct(dataProduct);
    } catch (error) {
      this.logger.error('Failed to create product ', error.stack);
      throw new BadGatewayException(`error use-case: ${error.message}`);
    }
  }
}
