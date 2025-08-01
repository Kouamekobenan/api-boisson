import { DirectSale } from '../entities/directSale.entity';
import {
  Prisma,
  DirectSale as PrismaEntity,
  DirectSaleItem as PrismaItem,
} from '@prisma/client';
import { DirectSaleItem } from '../entities/directSaleItem.entity';
import { CreateDirectSaleDto } from 'src/directSale/application/dtos/directSale/create-directSale.dto';
import { DirectSaleItemDto } from 'src/directSale/application/dtos/directSaleItem/create-directSale.dto';
export class DirectSaleMapper {
  toEntity(
    prismaModel: PrismaEntity & { saleItems?: PrismaItem[] },
  ): DirectSale {
    const saleItems = (prismaModel.saleItems || []).map(
      (item) =>
        new DirectSaleItem(
          item.id,
          item.directSaleId,
          item.productId,
          Number(item.quantity),
          Number(item.unitPrice),
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
      saleItems,
      prismaModel.createdAt,
      prismaModel.updatedAt,
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
      // dueAmount: createDto.dueAmount,
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
