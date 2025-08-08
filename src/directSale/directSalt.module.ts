import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectSaleController } from './presentation/directSale.controller';
import { DirectSaleMapper } from './domain/mapper/directSalt.mapper';
import { DirectSaleRepository } from './infrastructure/directSaleRepository.impl';
import { DirectSaleRepositoryName } from './domain/interfaces/directSale-repository.interface';
import { CreateDirecteSaleUseCase } from './application/usecases/create-directSale.usecase';
import { FindDirecteSaleByIdUseCase } from './application/usecases/find-byId.usecase';
import { PaginateDirecteSaleUseCase } from './application/usecases/paginate-directeSale.usecase';
import { FindAllDirecteSaleUseCase } from './application/usecases/findAll-directeSale.usecase';
import { DeleteDireteSaleUseCase } from './application/usecases/delete-directeSale';
import { FindCreditSaleUseCase } from './application/usecases/CreditSale.usecase';

@Module({
  controllers: [DirectSaleController],
  imports: [],
  providers: [
    // prismaservice
    PrismaService,
    // mappers
    DirectSaleMapper,
    {
      provide: DirectSaleRepositoryName,
      useClass: DirectSaleRepository,
    },
    // use-cases
    CreateDirecteSaleUseCase,
    FindDirecteSaleByIdUseCase,
    PaginateDirecteSaleUseCase,
    FindAllDirecteSaleUseCase,
    DeleteDireteSaleUseCase,
    FindCreditSaleUseCase,
  ],
  exports: [],
})
export class DirecteSaleModule {}
