import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';
import { OrderRepository } from './infrastruture/order.repository';
import { CreateOrderUseCase } from './application/usecases/create-order-usecase.use-case';
import { OrderMapper } from './domain/mappers/order-mapper.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteOderUseCase } from './application/usecases/delete-order-usecase.usecase';
import { FindOrderByIdUseCase } from './application/usecases/find-order-byId-usecase.usecase';
import { PaginateOrderUseCase } from './application/usecases/pagination-order.usecase';
import { CanceledOrderUseCase } from './application/usecases/canceled-order.usecase';
import { ValidateOrderUseCase } from './application/usecases/validate-order.usecase';

@Module({
  controllers: [OrderController],
  imports: [],
  providers: [
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    // Use-case
    CreateOrderUseCase,
    DeleteOderUseCase,
    FindOrderByIdUseCase,
    PaginateOrderUseCase,
    CanceledOrderUseCase,
    ValidateOrderUseCase,
    // Mappers
    OrderMapper,

    // SERVICE
    PrismaService,
  ],
  exports: [],
})
export class OderModule {}
