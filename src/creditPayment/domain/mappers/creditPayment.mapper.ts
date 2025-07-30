import { CreateCreditPaymentDto } from 'src/creditPayment/application/dtos/create-creditPayment.dto';
import { CreditPayment } from '../entities/creditPayment.entity';
import { Prisma, CreditPayment as PrismaEntity } from '@prisma/client';
import { UpdateCreditPaymentDto } from 'src/creditPayment/application/dtos/update-creditPayment';

export class CreditPaymentMapper {
  toEntity(modelPrisma: PrismaEntity): CreditPayment {
    return new CreditPayment(
      modelPrisma.id,
      modelPrisma.directSaleId,
      Number(modelPrisma.amount),
      modelPrisma.paidAt,
    );
  }
  toPersistence(dto: CreateCreditPaymentDto): Prisma.CreditPaymentCreateInput {
    return {
      directSale: { connect: { id: dto.directSaleId } },
      amount: dto.amount,
    };
  }
  toUpdate(dto: UpdateCreditPaymentDto): Prisma.CreditPaymentUpdateInput {
    const createPaymentUpdate: Prisma.CreditPaymentUpdateInput = {};
    if (dto.directSaleId !== undefined) {
      createPaymentUpdate.directSale = { connect: { id: dto.directSaleId } };
    }
    if (dto.amount !== undefined) {
      createPaymentUpdate.amount = dto.amount;
    }
    return createPaymentUpdate;
  }
}
