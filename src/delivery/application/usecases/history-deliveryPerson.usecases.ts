import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';

@Injectable()
export class HistoryDeliveryPersonUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}
  async execute(deliveryPersonId: string): Promise<Delivery[]> {
    try {
      return await this.deliveryRepository.history(deliveryPersonId);
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve history deliveryPerson',
        {
          cause: error,
          description: error,
        },
      );
    }
  }
}
