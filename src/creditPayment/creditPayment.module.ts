import {Module } from "@nestjs/common";
import { CreditPaymentRepository } from "./infrastructure/creditPayment-repository.impl";
import { CreditPaymentRepositoryName } from "./domain/interfaces/creditPayment-repository.interface";
import { CreateCreditPaymentUseCase } from "./application/usecases/create-creditPayment.usecase";
import { CreditPaymentMapper } from "./domain/mappers/creditPayment.mapper";
import { CreaditPaymentController } from "./presentation/creditPayment.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FindByIdCreditPaymentUseCase } from "./application/usecases/find-by-id-creditPayment.usecase";
import { PaginateCreditPaymentUseCase } from "./application/usecases/paginate-creditPayment.usecase";
import { DeleteCreditPaymentUseCase } from "./application/usecases/delete-creditPayment.usecase";
import { UpdateCreditPaymentUseCase } from "./application/usecases/update-creditPayment.usecase";

@Module({
  controllers: [CreaditPaymentController],
  providers: [
    {
      provide: CreditPaymentRepositoryName,
      useClass: CreditPaymentRepository,
    },
    PrismaService,
    // Uses cases
    CreateCreditPaymentUseCase,
    FindByIdCreditPaymentUseCase,
    PaginateCreditPaymentUseCase,
    DeleteCreditPaymentUseCase,
    UpdateCreditPaymentUseCase,

    // Mapper
    CreditPaymentMapper,
  ],
  imports: [],
  exports: [],
})
export class CreditPaymentModule {}