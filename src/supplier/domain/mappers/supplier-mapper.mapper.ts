import { SupplierDto } from 'src/supplier/application/dtos/supplier-dto.dto';
import { SupplierEntity } from '../entities/supplier.entity';
import { Prisma, Supplier as PrismaSpplier } from '@prisma/client';
import { UpdateSupplierDto } from 'src/supplier/application/dtos/update-dto.dto';

export class SupplierMapper {
  toReceive(supplierData: PrismaSpplier): SupplierEntity {
    return new SupplierEntity(
      supplierData.id,
      supplierData.name,
      supplierData.tenantId,
      supplierData.email,
      supplierData.phone,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }
  toSend(data: SupplierDto): Prisma.SupplierCreateInput {
    return {
      name: data.name,
      tenant: { connect: { id: data.tenantId } },
      email: data.email,
      phone: data.phone,
    };
  }

  toUpdate(data: UpdateSupplierDto): any {
    const supplierData: any = {};
    if (data.name) {
      supplierData.name = data.name;
    }
    if (data.email) {
      supplierData.email = data.email;
    }
    if (data.phone) {
      supplierData.phone = data.phone;
    }
    return supplierData;
  }
}
