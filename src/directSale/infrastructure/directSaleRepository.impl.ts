import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IDirectSaleRepository } from '../domain/interfaces/directSale-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectSaleMapper } from '../domain/mapper/directSalt.mapper';
import { CreateDirectSaleDto } from '../application/dtos/directSale/create-directSale.dto';
import { DirectSale } from '../domain/entities/directSale.entity';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';
@Injectable()
export class DirectSaleRepository implements IDirectSaleRepository {
  private readonly logger = new Logger(DirectSaleRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DirectSaleMapper,
  ) {}
  async create(createDto: CreateDirectSaleDto): Promise<DirectSale> {
    try {
      //  Calculer le montant total des ventes
      const totalPrice = createDto.saleItems.reduce((acc, item) => {
        return acc + item.unitPrice * item.quantity;
      }, 0);
      // Calculer le montant reste à payer
      const dueAmount = totalPrice - createDto.amountPaid;
      const directSaleDto = this.mapper.toPersistence(createDto);
      const result = await this.prisma.$transaction(async (tx) => {
        // Création de la vente

        const createDirectSale = await tx.directSale.create({
          data: {
            ...directSaleDto,
            dueAmount: dueAmount,
            totalPrice: totalPrice,
          },
          include: {
            saleItems: true,
            customer: true,
            seller: true,
          },
        });
        // Mise à jour du stock pour chaque produit vendu
        for (const item of createDto.saleItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
        return createDirectSale;
      });
      return this.mapper.toEntity(result);
    } catch (error) {
      this.logger.error(`Failed to create directSale: ${error.message}`);
      throw new BadRequestException(
        `Failed to create directSale: ${error.message}`,
      );
    }
  }
  async findById(id: string): Promise<DirectSale> {
    try {
      const directeSale = await this.prisma.directSale.findUnique({
        where: { id },
        include: {
          saleItems: true,
          seller: {
            select: { name: true, phone: true },
          },
        },
      });
      if (!directeSale) {
        throw new NotFoundException(`DirecteSale with ID :${id} not exist!`);
      }
      return this.mapper.toEntity(directeSale);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve directeSale with ID:${id}: ${error.message}`,
      );
      throw new BadRequestException(
        `Failled to retrieve directeSale with ID: ${id} :${error.message}`,
      );
    }
  }
  async paginate(
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<DirectSale>> {
    try {
      const skip = (page - 1) * limit;
      const [directeSales, total] = await Promise.all([
        this.prisma.directSale.findMany({
          include: {
            saleItems: true,
            seller: true,
          },
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.directSale.count(),
      ]);
      const directeSaleMap = directeSales.map((directSale) =>
        this.mapper.toEntity(directSale),
      );
      return {
        data: directeSaleMap,
        total,
        totalPages: limit > 1 ? Math.ceil(total / limit) : 1,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve directeSale with pagination :limit:${limit}, page:${page}, ${error.stack}`,
      );
      throw new BadRequestException(
        'Failed to retrieve directeSale with pagination ',
        { cause: error, description: error.message },
      );
    }
  }
  async findAll(): Promise<DirectSale[]> {
    try {
      const directeSales = await this.prisma.directSale.findMany({
        include: { saleItems: true, seller: true },
        orderBy: { createdAt: 'desc' },
      });
      const directeSaleMap = directeSales.map((directeSale) =>
        this.mapper.toEntity(directeSale),
      );
      return directeSaleMap;
    } catch (error) {
      this.logger.error(`Failled to retrieve directeSales`);
      throw new BadRequestException('Failled to retrieve directeSales', {
        cause: error,
        description: error,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
       await this.prisma.directSale.delete({where:{id}})

    } catch (error) {
      throw new BadRequestException(`Failled to delete directe sale with ID:${id}`)
    }
  }
}
