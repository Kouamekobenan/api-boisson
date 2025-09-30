import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ITenantRepository } from '../domain/interfaces/tenant-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantMapper } from '../domain/mappers/tenant.mapper';
import { CreateTenantDto } from '../application/dtos/create-tenant.dto';
import { Tenant } from '../domain/entities/tenant.entity';
import { UpdateTenantDto } from '../application/dtos/update-tenant';
import { UserDto } from 'src/auth/users/application/dtos/user.dto';
import { User } from 'src/auth/users/domain/entities/user.entity';
@Injectable()
export class TenantRepository implements ITenantRepository {
  private readonly logger = new Logger(TenantRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: TenantMapper,
  ) {}
  async create(dto: CreateTenantDto): Promise<Tenant> {
    try {
      const tenantDto = this.mapper.toPersistence(dto);
      const newTenant = await this.prisma.tenant.create({
        data: tenantDto,
      });
      return this.mapper.toEntity(newTenant);
    } catch (error) {
      this.logger.error('Failled to create tenant', error.stack);
      throw new BadRequestException('Failed to create tenant ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.tenant.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Failled to delete tenant', error.stack);
      throw new BadRequestException('Failled to  delete tenant', error.message);
    }
  }
  async findById(id: string): Promise<Tenant | null> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id },
      });
      return tenant ? this.mapper.toEntity(tenant) : null;
    } catch (error) {
      throw new BadRequestException('Failled to retrieve tenant with ID', {
        cause: error,
        description: error.message,
      });
    }
  }
  async update(id: string, updateDto: UpdateTenantDto): Promise<Tenant> {
    try {
      const tenant = this.mapper.toUpdate(updateDto);
      const updateNew = await this.prisma.tenant.update({
        where: { id },
        data: tenant,
      });
      return this.mapper.toEntity(updateNew);
    } catch (error) {
      this.logger.error('Failled to update tenant', error);
      throw new BadRequestException('Failled to update tenant', error);
    }
  }
  async findAll(): Promise<Tenant[]> {
    const tenants = await this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return tenants.map((item) => this.mapper.toEntity(item));
  }
  async createEspace(user: UserDto, name: string): Promise<Tenant> {
    return this.prisma.$transaction(async (tx) => {
      const tenants = await tx.tenant.create({ data: { name } });
      const users = await tx.user.create({
        data: {
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
          tenant: { connect: { id: tenants.id } },
        },
      });
      return this.mapper.toEntity(tenants);

    }); 
  }
}
