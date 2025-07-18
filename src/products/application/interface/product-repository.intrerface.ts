import { ProductEntity } from 'src/products/domain/entities/product.entity';
import { ProductDto } from '../dtos/product-dto.dto';
import { FilterProductDto } from '../dtos/filtrage-product.dto';
import { UpdateProductDto } from '../dtos/update-dto.product-dto';
export interface IProductRepository {
  createProduct(data: ProductDto): Promise<ProductEntity>;
  provisioning(
    productId: string,
    products: {supplierId?:string, stock?:number},
  ): Promise<ProductEntity>;
  findAllProduct(): Promise<ProductEntity[]>;
  updateProcut(
    productId: string,
    productData: UpdateProductDto,
  ): Promise<ProductEntity>;
  findById(productId: string): Promise<ProductEntity | null>;
  deleteProduct(productId: string): Promise<void>;
  filter(
    input: FilterProductDto,
    page?: number,
    limit?: number,
  ): Promise<{
    products: ProductEntity[];
    page: number;
    total: number;
    totalPage: number;
    limit: number;
  }>;
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
  lower(
    page: number,
    limit: number,
  ): Promise<{
    data: ProductEntity[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
}
