import { Inject, Injectable } from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';

@Injectable()
export class FindAllDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}
  async execute(tenantId: string): Promise<Delivery[]> {
    return await this.deliveryRepository.findAllDelivery(tenantId);
  }
}
