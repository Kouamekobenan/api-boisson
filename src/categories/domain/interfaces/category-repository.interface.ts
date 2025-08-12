import { CategoryProductDto } from 'src/categories/application/dtos/create-category.dto';
import { CategoryProduct } from '../entities/category.entity';
export const CategoryProductRepositoyName = 'ICategoryProductRepository';
export interface ICategoryProductRepository {
  create(createDto: CategoryProductDto): Promise<CategoryProduct>;
  findById(id: string): Promise<CategoryProduct | null>;
  filter(
    tenantId:string,
    filter: CategoryProductDto,
    limit: number,
    page: number,
  ): Promise<{
    data: CategoryProduct[];
    totalPage: number;
    total: number;
    limit: number;
    page: number;
  }>;
  pagination(
    tenantId:string,
    limit: number,
    page: number,
  ): Promise<{
    data: CategoryProduct[];
    totalPage: number;
    total: number;
    limit: number;
    page: number;
  }>;
  delete(id: string): Promise<void>;
  update(id: string, updateDto: CategoryProductDto): Promise<CategoryProduct>;
}
