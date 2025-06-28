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
import { UpdateProductDto } from '../application/dtos/update-dto.product-dto';
import { ProvisionningDto } from '../application/dtos/provisionning-product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ProductMapper,
  ) {}
  async createProduct(data: ProductDto): Promise<ProductEntity> {
    try {
      const dataTosend = this.mapper.toPersistence(data);
      const newProduct = await this.prisma.product.create({
        data: dataTosend,
      });
      return this.mapper.toEntity(newProduct);
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
        this.mapper.toEntity(product),
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
    productData: ProvisionningDto,
  ): Promise<ProductEntity> {
    try {
      const productToUpdate = this.mapper.toProvisioning(productData);
      const updateProducts = await this.prisma.product.update({
        where: { id: productId },
        data: productToUpdate,
      });

      return this.mapper.toEntity(updateProducts);
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
      return this.mapper.toEntity(product);
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

  async provisioning(
    productId: string,
    products: { supplierId: string; stock: number },
  ): Promise<ProductEntity> {
    try {
      // Recupere le stock actuel en base
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        throw new NotFoundException('Produit non trouvé');
      }
      //  Faire l'approvisionnement du produit
      const updateStock = await this.prisma.product.update({
        where: { id: productId },
        data: { stock: existingProduct.stock + products.stock, supplierId:products.supplierId },
      });
      //   Modifie le mouvement du stock
      await this.prisma.stockMovement.create({
        data: {
          productId: existingProduct.id,
          type: 'ENTRY',
          quantity: products.stock,
        },
      });

      return this.mapper.toEntity(updateStock);
    } catch (error) {
      throw new BadRequestException(`L\'approvisionnement n\'a pas puis passé`);
    }
  }
  async filter(
    filter: FilterProductDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    products: ProductEntity[];
    page: number;
    total: number;
    totalPage: number;
    limit: number;
  }> {
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
      const prod = data.map((d) => this.mapper.toEntity(d));
      return {
        products: prod,
        total: total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
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
      const prod = products.map((d) => this.mapper.toEntity(d));
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
  async lower(
    page: number,
    limit: number,
  ): Promise<{
    data: ProductEntity[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const stockThreshold = 10;

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            stock: {
              lt: stockThreshold,
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({
          where: {
            stock: {
              lt: stockThreshold,
            },
          },
        }),
      ]);
      const data = products.map((p) => this.mapper.toEntity(p));
      return {
        data,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        'Échec de la récupération du stock critique',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
}
