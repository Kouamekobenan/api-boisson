import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';

@Injectable()
export class FindDeliveryByIdUseCase {
  private readonly logger = new Logger(FindDeliveryByIdUseCase.name);
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}
  async execute(
    deliveryId: string,
  ): Promise<{ data: Delivery & { totalPrice: number } }> {
    try {
      const delivery = await this.deliveryRepository.findById(deliveryId);
      return delivery;
    } catch (error) {
      this.logger.error(
        `Failled to retrieve delivery with ID: ${deliveryId}: ${error.message}`,
      );
      throw new BadRequestException('Failled to retrieve delivery by ID', {
        cause: error,
        description: error.message,
      });
    }
  }
}
