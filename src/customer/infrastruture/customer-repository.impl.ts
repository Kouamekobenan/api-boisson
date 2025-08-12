import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICustomerRepository } from '../domain/interfaces/customer-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerMapper } from '../domain/mapper/customer.mapper';
import { CreateCustomerDto } from '../application/dtos/create-customer.dto';
import { Customer } from '../domain/entities/customer.entity';
import { UpdateCustomerDto } from '../application/dtos/update-customer.dto';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  private readonly logger = new Logger(CustomerRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CustomerMapper,
  ) {}
  async create(dto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.mapper.toPersistence(dto);
      const createCustomer = await this.prisma.customer.create({
        data: customer,
      });
      return this.mapper.toEntity(createCustomer);
    } catch (error) {
      this.logger.error('Failled to create customer', error.stack);
      throw new BadRequestException('Failled to create customer', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findById(id: string): Promise<Customer> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          sales: true,
        },
      });
      if (!customer) {
        throw new NotFoundException(`ID: ${id} by not found`);
      }
      return this.mapper.toEntity(customer);
    } catch (error) {
      this.logger.error('Failled to retrieve customer', error.message);
      throw new BadRequestException('Failled to retrieve customer', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(id: string, updateDto: UpdateCustomerDto): Promise<Customer> {
    try {
      const customer = this.mapper.toUpdate(updateDto);
      const updateCustomer = await this.prisma.customer.update({
        where: { id },
        data: customer,
      });
      return this.mapper.toEntity(updateCustomer);
    } catch (error) {
      this.logger.error(`Failled to update customer ${error.message}`);
      throw new BadRequestException(
        `Failled to update customer ${error.message}`,
      );
    }
  }
  async deleteCustomer(id: string): Promise<void> {
    try {
      await this.prisma.customer.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Failled to delete customer', error.message);
      throw new BadRequestException('Failled to delete customer', {
        cause: error,
      });
    }
  }
  async paginate(
    tenantId: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<Customer>> {
    try {
      const skip = (page - 1) * limit;
      const [cutomers, total] = await Promise.all([
        this.prisma.customer.findMany({
          where: { tenantId },
          include: {
            sales: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.customer.count(),
      ]);
      const customerMap = cutomers.map((customer) =>
        this.mapper.toEntity(customer),
      );
      return {
        data: customerMap,
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failled to retrieve customer', error.message);
      throw new BadRequestException('Failled to retrieve customer', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findAll(tenantId: string): Promise<Customer[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });

      return customers.map((customer) => this.mapper.toEntity(customer));
    } catch (error) {
      throw new BadRequestException('Failled to retrieve customers');
    }
  }
}
