import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';

@Injectable()
export class FindByDateRangeDeliveryUseCase {
  private readonly logger = new Logger(FindByDateRangeDeliveryUseCase.name);
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}
  async execute(startDate: string, endDate: string): Promise<Delivery[]> {
    try {
      return await this.deliveryRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve data to deliveries ${error.message}`,
      );
      throw new Error();
    }
  }
}
