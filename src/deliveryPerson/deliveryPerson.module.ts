import { Injectable, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryPersonController } from './presentation/deliveryPerson.controller';
import { DeliveryPersonUseCase } from './application/usescases/deliveryPerson-usecase.use-case';
import { UpdateDeliveryUseCase } from './application/usescases/updateDeliveryPerson-dto.dto';
import { DeliveryPersonRepository } from './infrastructure/deliveryPerson.repository';
import { DeliveryPersonMapper } from './domain/mappers/deliveryPerson-mapper.mapper';
import { FindAllDeliveryUseCase } from './application/usescases/findall-usecase.use-case';
import { DeleteDeliveryPersonUseCase } from './application/usescases/delete-usecase.use-case';

@Module({
  imports: [],

  controllers: [DeliveryPersonController],
  providers: [
    // serviec
    PrismaService, 

    // use cases 
    DeliveryPersonUseCase,
    UpdateDeliveryUseCase,
    FindAllDeliveryUseCase,
    DeleteDeliveryPersonUseCase,

    {
      provide: 'IDeliveryPersonRepository',
      useClass: DeliveryPersonRepository,
    },

    //   mappers
    DeliveryPersonMapper
  ],
  exports: [],
})
export class DeliveryPersonModule {}
