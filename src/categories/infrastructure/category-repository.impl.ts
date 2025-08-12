import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ICategoryProductRepository } from '../domain/interfaces/category-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryProductMapper } from '../domain/categoryMappers/category-mapper';
import { CategoryProductDto } from '../application/dtos/create-category.dto';
import { CategoryProduct } from '../domain/entities/category.entity';
import { contains } from 'class-validator';

@Injectable()
export class CatetoryProductRepository implements ICategoryProductRepository {
  private readonly logger = new Logger(CatetoryProductRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CategoryProductMapper,
  ) {}
  async create(createDto: CategoryProductDto): Promise<CategoryProduct> {
    try {
      const categoryDto = this.mapper.toPersistence(createDto);
      const createCategory = await this.prisma.categoryProduct.create({
        data: categoryDto,
      });
      this.logger.log(
        'Data to category create:',
        JSON.stringify(createCategory),
      );
      return this.mapper.toEntity(createCategory);
    } catch (error) {
      this.logger.error(
        `Failed to create category ${error.stack}, ${error.message}`,
      );
      throw new BadRequestException('Failed to created category product ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findById(id: string): Promise<CategoryProduct | null> {
    try {
      const category = await this.prisma.categoryProduct.findUnique({
        where: { id },
      });
      return category ? this.mapper.toEntity(category) : null;
    } catch (error) {
      this.logger.error(
        'Failed to retrieve category product by Id',
        error.message,
      );
      throw new BadRequestException('Failed to  retrieve category product', {
        cause: error,
        description: error.message,
      });
    }
  }
  async filter(
    tenantId: string,
    filter: CategoryProductDto,
    limit: number,
    page: number,
  ): Promise<{
    data: CategoryProduct[];
    totalPage: number;
    total: number;
    limit: number;
    page: number;
  }> {
    try {
      const query: any = { tenantId };
      const skip = (page - 1) * limit;
      if (filter.name !== undefined) {
        query.name = { contains: filter.name, mode: 'insensitive' };
      }
      const [categories, total] = await Promise.all([
        this.prisma.categoryProduct.findMany({
          where: query,
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.categoryProduct.count({ where: query }),
      ]);

      const catgoryMap = categories.map((category) =>
        this.mapper.toEntity(category),
      );
      return {
        data: catgoryMap,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to filter category product', error.message);
      throw new BadRequestException('Failed to filter category product', {
        cause: error,
        description: error.message,
      });
    }
  }
  async pagination(
    tenantId: string,
    limit: number,
    page: number,
  ): Promise<{
    data: CategoryProduct[];
    totalPage: number;
    total: number;
    limit: number;
    page: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [categories, total] = await Promise.all([
        this.prisma.categoryProduct.findMany({
          where: { tenantId },
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.categoryProduct.count({ where: { tenantId } }),
      ]);
      const categoryMap = categories.map((category) =>
        this.mapper.toEntity(category),
      );
      return {
        data: categoryMap,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to paginate category product', error.message);
      throw new BadRequestException('Failed to paginate category product', {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.categoryProduct.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failed to delete category product by ID', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(
    id: string,
    updateDto: CategoryProductDto,
  ): Promise<CategoryProduct> {
    try {
      const updateDataDto = this.mapper.toUpdate(updateDto);
      const updateData = await this.prisma.categoryProduct.update({
        where: { id },
        data: updateDataDto,
      });
      return this.mapper.toEntity(updateData);
    } catch (error) {
      throw new BadRequestException('Failed to update category product', {
        cause: error,
        description: error.message,
      });
    }
  }
}
