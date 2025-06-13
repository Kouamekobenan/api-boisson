import { Injectable, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductController } from './presentation/product.controller';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductMapper } from './domain/mapper/product-mapper.mapper';
import { CreatePrductUseCase } from './application/usescases/create-product.use-case';
import { FindAllProductUseCase } from './application/usescases/find-all-product-usecase.use-case';
import { UpdateProductUseCase } from './application/usescases/update-product.usecase';
import { DeleteProductUseCase } from './application/usescases/delete-product.use-case';
import { ByProductUseCase } from './application/usescases/by-to-product.usecase';
import { FiterProductUseCase } from './application/usescases/filtrage-product.usecase';
import { PaginateProductUseCase } from './application/usescases/paginate-products.usecase';
import { CategoryProductRepositoyName } from 'src/categories/domain/interfaces/category-repository.interface';
import { CatetoryProductRepository } from 'src/categories/infrastructure/category-repository.impl';
import { CategoryProductMapper } from 'src/categories/domain/categoryMappers/category-mapper';
@Module({
  imports: [],

  controllers: [ProductController],
  providers: [
    // serviece
    PrismaService,

    // use cases
    CreatePrductUseCase,
    FindAllProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ByProductUseCase,
    FiterProductUseCase,
    PaginateProductUseCase,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: CategoryProductRepositoyName,
      useClass: CatetoryProductRepository,
    },
    //   mappers
    ProductMapper,
    CategoryProductMapper,
  ],
  exports: [],
})
export class ProductModule {}
