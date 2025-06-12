import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductMapper } from '../domain/mapper/product-mapper.mapper';
import { IProductRepository } from '../application/interface/product-repository.intrerface';
import { ProductDto } from '../application/dtos/product-dto.dto';
import { ProductEntity } from '../domain/entities/product.entity';
import { FilterProductDto } from '../application/dtos/filtrage-product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ProductMapper,
  ) {}
  async createProduct(
    supplierId: string,
    data: ProductDto,
  ): Promise<ProductEntity> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new BadGatewayException(`supplier dos'nt exist: ${supplierId}`);
    }
    try {
      const dataTosend = this.mapper.toSend(data);
      const newProduct = await this.prisma.product.create({
        data: {
          ...dataTosend,
          supplier: {
            connect: { id: supplierId },
          },
        },
      });
      return this.mapper.toReceive(newProduct);
    } catch (error) {
      console.error(`error: repository: ${error.message}`);
      throw new BadGatewayException(`error repo:${error}`);
    }
  }
  // FIND ALL PRODUCT
  async findAllProduct(): Promise<ProductEntity[]> {
    try {
      const products = await this.prisma.product.findMany();
      const productToreceive = products.map((product) =>
        this.mapper.toReceive(product),
      );
      return productToreceive;
    } catch (error) {
      throw new BadGatewayException(
        `error durring to find alls products: repo: ${error.message}`,
      );
    }
  }
  async updateProcut(
    productId: string,
    productData: ProductDto,
  ): Promise<ProductEntity> {
    try {
      const productToUpdate = this.mapper.toUpdate(productData);
      const updateProducts = await this.prisma.product.update({
        where: { id: productId },
        data: { ...productToUpdate },
      });

      return this.mapper.toReceive(updateProducts);
    } catch (err) {
      throw new BadGatewayException(`error on repository: ${err.message}`);
    }
  }

  // PRODUCT BY ID
  async findById(productId: string): Promise<ProductEntity | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new BadGatewayException('ID Invalid!');
      }
      return this.mapper.toReceive(product);
    } catch (error) {
      throw new BadGatewayException(`error repository: ${error}`);
    }
  }

  // DELETE PRODUCT
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.prisma.stockMovement.deleteMany({ where: { productId } });
      await this.prisma.deliveryProduct.deleteMany({ where: { productId } });
      await this.prisma.orderItem.deleteMany({ where: { productId } });
      await this.prisma.product.delete({
        where: { id: productId },
      });
    } catch (error) {
      throw new BadGatewayException(`error on repository:${error.message}`);
    }
  }

  async byProduct(productId: string, quantity: number): Promise<ProductEntity> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Cet id: ${productId} n\'exist pas!`);
      }

      //  Faire l'approvisionnement du produit
      const updateStock = await this.prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock + quantity },
      });
      //   Modifie le mouvement du stock
      await this.prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'ENTRY',
          quantity: quantity,
        },
      });

      return this.mapper.toReceive(updateStock);
    } catch (error) {
      throw new BadRequestException(`L\'approvisionnement n\'a pas puis passé`);
    }
  }
  async filter(
    filter: FilterProductDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    try {
      const query: any = {};
      if (filter.name) {
        query.name = { contains: filter.name, mode: 'insensitive' };
      }
      if (filter.supplierId) {
        query.supplierId = filter.supplierId;
      }
      if (filter.minPrice || filter.maxPrice) {
        query.price = {};
        if (filter.minPrice) query.price.gte = filter.minPrice;
        if (filter.maxPrice) query.price.lte = filter.maxPrice;
      }
      if (filter.inStock === true) {
        query.stock = { gt: 0 };
      }
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.product.findMany({
          where: query,
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where: query }),
      ]);
      const prod = data.map((d) => this.mapper.toReceive(d));
      return { products: prod, total: total };
    } catch (error) {
      throw new BadRequestException(
        'Failed to filter the products and pagination',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
  async paginate(
    limit: number,
    page: number,
  ): Promise<{
    data: ProductEntity[];
    page: number;
    total: number;
    totalPage: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count(),
      ]);
      const prod = products.map((d) => this.mapper.toReceive(d));
      return {
        data: prod,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to paginate products', error.message);
      throw new BadRequestException('Failed to paginate products', {
        cause: error,
        description: error.message,
      });
    }
  }
}
