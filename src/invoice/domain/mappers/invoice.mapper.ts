import { UpdateInvoiceDto } from 'src/invoice/application/dtos/update-invoice.dto';
import { Invoice } from '../entities/invoice.entity';
import { Invoice as InvoiceEntity, Prisma } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoice/application/dtos/create-invoice.dto';
export class InvoiceMapper {
  toEntity(prismaModel: InvoiceEntity): Invoice {
    return new Invoice(
      prismaModel.id,
      prismaModel.orderId,
      prismaModel.totalPrice.toNumber(),
      prismaModel.createdAt,
      prismaModel.updatedAt,
    );
  }
  toPersistence(createDto: CreateInvoiceDto): Prisma.InvoiceCreateInput {
    return {
      order: { connect: { id: createDto.orderId } },
      totalPrice: createDto.totalPrice,
    };
  }
  toUpdate(updateDto: UpdateInvoiceDto): Prisma.InvoiceUpdateInput {
    const dataUpdate: Prisma.InvoiceUpdateInput = {};
    if (updateDto.totalPrice !== undefined) {
      dataUpdate.totalPrice = updateDto.totalPrice;
    }
    return dataUpdate;
  }
}
