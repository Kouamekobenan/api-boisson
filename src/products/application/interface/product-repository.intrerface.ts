import { ProductEntity } from 'src/products/domain/entities/product.entity';
import { ProductDto } from '../dtos/product-dto.dto';
import { ProductByDto } from '../dtos/product-by-dto';
import { FilterProductDto } from '../dtos/filtrage-product.dto';
export interface IProductRepository {
  createProduct(data: ProductDto): Promise<ProductEntity>;
  byProduct(productId: string, quantity: number): Promise<ProductEntity>;
  findAllProduct(): Promise<ProductEntity[]>;
  updateProcut(
    productId: string,
    productData: ProductByDto,
  ): Promise<ProductEntity>;
  findById(productId: string): Promise<ProductEntity | null>;
  deleteProduct(productId: string): Promise<void>;
  filter(
    input: FilterProductDto,
    page?: number,
    limit?: number,
  ): Promise<{ products: ProductEntity[]; total: number }>;
  paginate(
    limit: number,
    page: number,
  ): Promise<{
    data: ProductEntity[];
    page: number;
    total: number;
    totalPage: number;
    limit: number;
  }>;
  lower(): Promise<ProductEntity[]>;
}
