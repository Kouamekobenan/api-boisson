import { CreateCustomerDto } from 'src/customer/application/dtos/create-customer.dto';
import { Customer } from '../entities/customer.entity';
import {
  Prisma,
  Customer as prismaEntity,
  DirectSale as PrismaDirecteSale,
} from '@prisma/client';
import { UpdateCustomerDto } from 'src/customer/application/dtos/update-customer.dto';
import { DirectSale } from 'src/directSale/domain/entities/directSale.entity';
export class CustomerMapper {
  toEntity(prismaModel: any): Customer {
    return new Customer(
      prismaModel.id,
      prismaModel.name,
      prismaModel.phone,
      prismaModel.email,
      prismaModel.address,
      prismaModel.tenantId,
      prismaModel.sales,
      prismaModel.createdAt,
      prismaModel.updatedAt,
    );
  }
  toPersistence(dto: CreateCustomerDto): Prisma.CustomerCreateInput {
    return {
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      tenant:{connect:{id:dto.tenantId}}
    };
  }
  toUpdate(dto: UpdateCustomerDto): Prisma.CustomerUpdateInput {
    const dataUpdate: Prisma.CustomerUpdateInput = {};
    if (dto.name !== undefined) {
      dataUpdate.name = dto.name;
    }
    if (dto.phone !== undefined) {
      dataUpdate.phone = dto.phone;
    }
    if (dto.email !== undefined) {
      dataUpdate.email = dto.email;
    }
    if (dto.address !== undefined) {
      dataUpdate.address = dto.address;
    }
    return dataUpdate;
  }
}
