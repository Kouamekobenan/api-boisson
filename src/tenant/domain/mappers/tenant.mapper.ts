import { CreateTenantDto } from 'src/tenant/application/dtos/create-tenant.dto';
import { Tenant } from '../entities/tenant.entity';
import { Prisma, Tenant as TenantModel } from '@prisma/client';
import { UpdateTenantDto } from 'src/tenant/application/dtos/update-tenant';
export class TenantMapper {
  toEntity(tenant: TenantModel): Tenant {
    return new Tenant(
      tenant.id,
      tenant.name,
      tenant.createdAt,
      tenant.updatedAt,
    );
  }
  toPersistence(createDto: CreateTenantDto): Prisma.TenantCreateInput {
    return {
      name: createDto.name,
    };
  }
  toUpdate(updateDto: UpdateTenantDto): Prisma.TenantUpdateInput {
    const tenantData: Prisma.TenantUpdateInput = {};
    if (updateDto.name !== undefined) {
      tenantData.name = updateDto.name;
    }
    return tenantData;
  }
}
