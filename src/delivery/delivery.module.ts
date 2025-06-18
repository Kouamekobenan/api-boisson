import {  Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryController } from './presentation/delivery.controller';
import { DeliveryRepository } from './infrastructure/delivery.repository';
import { CreateDeliveryUseCase } from './application/usecases/delivery-usecase.use-case';
import { DeliveryMapper } from './domain/mappers/delivery-mapper.mapper';
import { FindAllDeliveryUseCase } from './application/usecases/findAll-delivery.use-case';
import { UpdateDeliveryUseCase } from './application/usecases/update-dto.dto';
import { DeleteDeliveryUseCase } from './application/usecases/delete-usecase.use-case';
import { FindAllDeliveryOfDeliveryPersonUsecase } from './application/usecases/find-all-delivery-of.deliveryPerson.usecase';
import { ValidateDeliveryUseCase } from './application/usecases/validate-delivery.usecase';
import { CanceledDeliveryUseCase } from './application/usecases/cancel-delivery.usecase';
import { PaginateDeliveryUseCase } from './application/usecases/paginate-delivery.usecase';
import { HistoryDeliveryPersonUseCase } from './application/usecases/history-deliveryPerson.usecases';
import { DeliveryProgressUseCase } from './application/usecases/delivery-progress.usecase';
@Module({
  imports: [],

  controllers: [DeliveryController],
  providers: [
    // serviece
    PrismaService,

    // use cases
    CreateDeliveryUseCase,
    FindAllDeliveryUseCase,
    UpdateDeliveryUseCase,
    DeleteDeliveryUseCase,
    FindAllDeliveryOfDeliveryPersonUsecase,
    ValidateDeliveryUseCase,
    CanceledDeliveryUseCase,
    PaginateDeliveryUseCase,
    HistoryDeliveryPersonUseCase,
    DeliveryProgressUseCase,
    {
      provide: 'IDeliveryRepository',
      useClass: DeliveryRepository,
    },
    //   mappers
    DeliveryMapper,
  ],
  exports: [],
})
export class DeliveryModule {}
