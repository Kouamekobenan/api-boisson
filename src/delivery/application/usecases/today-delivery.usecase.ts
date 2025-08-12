import { Inject, Injectable } from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';

@Injectable()
export class DeliveryDayUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepo: IDeliveryRepository,
  ) {}
  async excute(tenantId: string): Promise<Delivery[]> {
    return this.deliveryRepo.toDay(tenantId);
  }
}
