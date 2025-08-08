import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICreditPaymentRepository } from '../domain/interfaces/creditPayment-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreditPaymentMapper } from '../domain/mappers/creditPayment.mapper';
import { CreateCreditPaymentDto } from '../application/dtos/create-creditPayment.dto';
import { CreditPayment } from '../domain/entities/creditPayment.entity';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';
import { UpdateCreditPaymentDto } from '../application/dtos/update-creditPayment';
@Injectable()
export class CreditPaymentRepository implements ICreditPaymentRepository {
  private readonly logger = new Logger(CreditPaymentRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CreditPaymentMapper,
  ) {}
  async create(dto: CreateCreditPaymentDto): Promise<CreditPayment> {
    try {
      const creditPayment = this.mapper.toPersistence(dto);

      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Create the payment
        const createCreditPayment = await tx.creditPayment.create({
          data: creditPayment,
        });

        // 2. Update the sale (increment amountPaid, decrement dueAmount)
        const updatedSale = await tx.directSale.update({
          where: { id: dto.directSaleId },
          data: {
            dueAmount: {
              decrement: dto.amount,
            },
            amountPaid: {
              increment: dto.amount,
            },
          },
        });

        // 3. Si la dette est soldée, isCredit => false
        //  -Number(dto.amount);
        if (Number(updatedSale.dueAmount)<= 0) {
          await tx.directSale.update({
            where: { id: dto.directSaleId },
            data: {
              isCredit: false,
            },
          });
        }

        this.logger.log(`Updated dueAmount: ${updatedSale.dueAmount}`);
        return this.mapper.toEntity(createCreditPayment);
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to create creditPayment ${error.message}`);
      throw new BadRequestException(`Failed to create creditPayment`, {
        cause: error,
        description: error.message,
      });
    }
  }

  async findById(id: string): Promise<CreditPayment> {
    try {
      const creditPayment = await this.prisma.creditPayment.findUnique({
        where: { id },
        include: {
          directSale: true,
        },
      });
      if (!creditPayment) {
        throw new NotFoundException(`CreditPayment with ID: ${id} not exist!`);
      }
      return this.mapper.toEntity(creditPayment);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve creaditPayment with ID:${id}, ${error.message}`,
      );
      throw new BadRequestException(
        `Failled to retrieve creditPayment with ID:${id}, `,
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
  ): Promise<PaginatedResponseRepository<CreditPayment>> {
    try {
      const skip = (page - 1) * limit;
      const [creaditPayments, total] = await Promise.all([
        this.prisma.creditPayment.findMany({
          include: {
            directSale: {
              select: { amountPaid: true, dueAmount: true, totalPrice: true },
            },
          },
          skip,
          take: limit,
          orderBy: { paidAt: 'desc' },
        }),
        this.prisma.creditPayment.count(),
      ]);
      const creditPaymentall = creaditPayments.map((creditPayment) =>
        this.mapper.toEntity(creditPayment),
      );
      return {
        data: creditPaymentall,
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Failled to retrieve creditPayment ${error.message}`);
      throw new BadRequestException(`Failled to retrieve creditPayment :`, {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      const creditPayment = await this.prisma.creditPayment.delete({
        where: { id },
      });
      if (!creditPayment) {
        throw new NotFoundException(`CreditPayment by ID:${id} not found`);
      }
    } catch (error) {
      this.logger.error('Failled to delete creditPayment', error.message);
      throw new BadRequestException('Failled to delete creditPayment', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(
    id: string,
    dto: UpdateCreditPaymentDto,
  ): Promise<CreditPayment> {
    try {
      const creditPayment = this.mapper.toUpdate(dto);
      const result = await this.prisma.$transaction(async (tx) => {
        const credit = await tx.creditPayment.findUnique({ where: { id } });
        if (!credit) {
          this.logger.error('Credit introuvable');
          throw new NotFoundException(`Credit not found`);
        }

        const amountDifference = Number(dto.amount) - Number(credit.amount);

        const creditPaymentUpdate = await tx.creditPayment.update({
          where: { id },
          data: creditPayment,
        });

        if (amountDifference !== 0) {
          await tx.directSale.update({
            where: { id: credit.directSaleId },
            data: {
              dueAmount:
                amountDifference > 0
                  ? { decrement: amountDifference }
                  : { increment: Math.abs(amountDifference) },
              amountPaid:
                amountDifference > 0
                  ? { increment: amountDifference }
                  : { decrement: Math.abs(amountDifference) },
            },
          });
        }

        return this.mapper.toEntity(creditPaymentUpdate);
      });

      return result;
    } catch (error) {
      this.logger.error('Failled to update creditPayment', error.stack);
      throw new BadRequestException('Failled to update creditPayment ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
