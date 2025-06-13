import { Module } from '@nestjs/common';
import { CategoryProductController } from './presentation/category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryProductMapper } from './domain/categoryMappers/category-mapper';
import { CreateCategoryProductUseCase } from './application/usescases/create-category.usecase';
import { CategoryProductRepositoyName } from './domain/interfaces/category-repository.interface';
import { CatetoryProductRepository } from './infrastructure/category-repository.impl';
import { FindCategoryProductByIdUseCase } from './application/usescases/find-category-product-byId.usecase';
import { FilterCategoryProductUseCase } from './application/usescases/filter-category-product.usecase';
import { PaginateCategoryProductUseCase } from './application/usescases/pagination-category.usecase';
import { DeleteCategoryProductUseCase } from './application/usescases/delete-category-product.usecase';
import { UpdateCategoryProductUseCase } from './application/usescases/update-category-product.usecase';
@Module({
  controllers: [CategoryProductController],
  imports: [],
  providers: [
    // prismaservice
    PrismaService,
    // mappers
    CategoryProductMapper,
    {
      provide: CategoryProductRepositoyName,
      useClass: CatetoryProductRepository,
    },
    // use-cases
    CreateCategoryProductUseCase,
    FindCategoryProductByIdUseCase,
    FilterCategoryProductUseCase,
    PaginateCategoryProductUseCase,
    DeleteCategoryProductUseCase,
    UpdateCategoryProductUseCase,
  ],
  exports: [CategoryProductMapper],
})
export class CategoryProductModule {}
