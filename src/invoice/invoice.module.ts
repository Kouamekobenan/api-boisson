import { Module } from '@nestjs/common';
import { InvoiceController } from './presentation/invoice.controller';
import { OrderRepository } from 'src/order/infrastruture/order.repository';
import { InvoiceRepositoryName } from './domain/interfaces/invoice-repository.interface';
import { InvoiceRepository } from './infrastructure/invoice-repository.impl';
import { CreateInvoiceUseCase } from './application/usescase/create-invoice.dto';
import { OrderMapper } from 'src/order/domain/mappers/order-mapper.mapper';
import { InvoiceMapper } from './domain/mappers/invoice.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindInvoiceByIdUseCase } from './application/usescase/find-invoice-byId.usecase';
import { DeleteInvoiceUseCase } from './application/usescase/delete-invoice.usecase';
import { GetAllInvoiceUseCase } from './application/usescase/gell-all-invoice.usecase';
import { PaginateInvoiceUseCase } from './application/usescase/paginate-invoice';

@Module({
  controllers: [InvoiceController],
  imports: [],
  providers: [
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: InvoiceRepositoryName,
      useClass: InvoiceRepository,
    },
    // Use-case
    CreateInvoiceUseCase,
    FindInvoiceByIdUseCase,
    DeleteInvoiceUseCase,
    GetAllInvoiceUseCase,
    PaginateInvoiceUseCase,
    // Mappers
    OrderMapper,
    InvoiceMapper,

    // SERVICE
    PrismaService,
  ],
  exports: [InvoiceMapper],
})
export class InvoiceModule {}
