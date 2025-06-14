import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';
import { OrderRepository } from './infrastruture/order.repository';
import { CreateOrderUseCase } from './application/usecases/create-order-usecase.use-case';
import { OrderMapper } from './domain/mappers/order-mapper.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteOderUseCase } from './application/usecases/delete-order-usecase.usecase';
import { FindOrderByIdUseCase } from './application/usecases/find-order-byId-usecase.usecase';

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

    // Mappers
    OrderMapper,

    // SERVICE
    PrismaService,
  ],
  exports: [],
})
export class OderModule {}
