import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';

@Injectable()
export class DeliveryProgressUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}
  async execute(tenantId: string): Promise<Delivery[]> {
    try {
      const delivery = await this.deliveryRepository.process(tenantId);
      return delivery;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve delivery in progress', {
        cause: error,
        description: error.message,
      });
    }
  }
}
