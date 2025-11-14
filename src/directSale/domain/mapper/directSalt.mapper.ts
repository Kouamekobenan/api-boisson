import { DirectSale } from '../entities/directSale.entity';
import {
  Prisma,
} from '@prisma/client';
import { DirectSaleItem } from '../entities/directSaleItem.entity';
import { CreateDirectSaleDto } from 'src/directSale/application/dtos/directSale/create-directSale.dto';
import { DirectSaleItemDto } from 'src/directSale/application/dtos/directSaleItem/create-directSale.dto';
import { Customer } from 'src/customer/domain/entities/customer.entity';
export class DirectSaleMapper {
  toEntity(
    prismaModel: any & {
      saleItems?: any[];
      customer?: Customer | null;
    },
  ): DirectSale {
    const saleItems = (prismaModel.saleItems || []).map(
      (item) =>
        new DirectSaleItem(
          item.id,
          item.directSaleId,
          item.productId,
          Number(item.quantity),
          Number(item.unitPrice),
          item.product?.name,
        ),
    );
    return new DirectSale(
      prismaModel.id,
      prismaModel.sellerId,
      prismaModel.customerId,
      Number(prismaModel.totalPrice),
      prismaModel.isCredit,
      Number(prismaModel.amountPaid),
      Number(prismaModel.dueAmount),
      prismaModel.tenantId,
      saleItems,
      prismaModel.createdAt,
      prismaModel.updatedAt,
      prismaModel.customer ?? undefined,
    );
  }
  toPersistence(createDto: CreateDirectSaleDto): Prisma.DirectSaleCreateInput {
    return {
      seller: { connect: { id: createDto.sellerId } },
      ...(createDto.customerId && {
        customer: { connect: { id: createDto.customerId } },
      }),
      totalPrice: createDto.totalPrice,
      isCredit: createDto.isCredit,
      amountPaid: createDto.amountPaid,
      tenant: { connect: { id: createDto.tenantId } },
      saleItems: {
        create: createDto.saleItems.map((item: DirectSaleItemDto) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      },
    };
  }
}
