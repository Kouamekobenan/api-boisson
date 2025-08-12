import { CategoryProductDto } from 'src/categories/application/dtos/create-category.dto';
import { CategoryProduct } from '../entities/category.entity';
import {
  CategoryProduct as CategoryPrismaEntity,
  Prisma,
} from '@prisma/client';
export class CategoryProductMapper {
  toEntity(prismaModel: CategoryPrismaEntity): CategoryProduct {
    return new CategoryProduct(
      prismaModel.id,
      prismaModel.name,
      prismaModel.tenantId,
      prismaModel.createdAt,
      prismaModel.updatedAt,
    );
  }
  toPersistence(
    createDto: CategoryProductDto,
  ): Prisma.CategoryProductCreateInput {
    return {
      name: createDto.name,
      tenant: { connect: { id: createDto.tenantId } },
    };
  }
  toUpdate(updateDto: CategoryProductDto): Prisma.CategoryProductUpdateInput {
    const categoryData: Prisma.CategoryProductUpdateInput = {};
    if (updateDto.name !== undefined) {
      categoryData.name = updateDto.name;
    }
    return categoryData;
  }
}
