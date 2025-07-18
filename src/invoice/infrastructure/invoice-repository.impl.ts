import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IInvoiceRepository } from '../domain/interfaces/invoice-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceMapper } from '../domain/mappers/invoice.mapper';
import { CreateInvoiceDto } from '../application/dtos/create-invoice.dto';
import { Invoice } from '../domain/entities/invoice.entity';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  private readonly logger = new Logger(InvoiceRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: InvoiceMapper,
  ) {}
  async create(createDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const dataDto = this.mapper.toPersistence(createDto);
      const createInvoice = await this.prisma.invoice.create({
        data: dataDto,
      });
      return this.mapper.toEntity(createInvoice);
    } catch (error) {
      this.logger.error(`Failed to create invoice ${error.stack}`);
      throw new BadRequestException('Failed to create invoice', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findById(id: string): Promise<Invoice | null> {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id },
      });
      return invoice ? this.mapper.toEntity(invoice) : null;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve invoice', {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.invoice.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Failed to delete invoice', error.stack);
      throw new BadRequestException('Failed to delete to inoice', {
        cause: error,
        description: error.message,
      });
    }
  }
  async getAll(): Promise<Invoice[]> {
    try {
      const invoices = await this.prisma.invoice.findMany();
      const allInvoices = invoices.map((data) => this.mapper.toEntity(data));
      return allInvoices;
    } catch (error) {
      this.logger.error('Failed to retrieve all invoices', error.stack);
      throw new BadRequestException('Failed to retrieve all invoices', {
        cause: error,
        description: error.message,
      });
    }
  }
  async paginate(
    page: number,
    limit: number,
  ): Promise<{
    data: Invoice[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [invoices, total] = await Promise.all([
        this.prisma.invoice.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.invoice.count(),
      ]);
      const allInvoices = invoices.map((invoice) =>
        this.mapper.toEntity(invoice),
      );
      return {
        data: allInvoices,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failled to paginate invoice ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async generate(orderId: string): Promise<Invoice> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          invoice: true,
        },
      });
      if (!order) throw new NotFoundException('Commande introuvable');
      if (order.invoice) throw new ConflictException('Facture déjà générée');

      const totalPrice = order.orderItems.reduce(
        (sum, item) => sum + item.totalPrice.toNumber(),
        0,
      );
      const createDto = await this.prisma.invoice.create({
        data: { orderId, totalPrice },
      });
      return this.mapper.toEntity(createDto);
    } catch (error) {
      this.logger.error(`Failled to generate invoice ${error.message}`);
      throw new BadRequestException(`Failled to generate invoice`, {
        cause: error,
        description: error.message,
      });
    }
  }
}
