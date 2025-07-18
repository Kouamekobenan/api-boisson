import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

@Injectable()
export class PaginateDeliveryUseCase {
  private logger = new Logger(PaginateDeliveryUseCase.name);
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deleveryRepository: IDeliveryRepository,
  ) {}
  async execute(
    limit: number,
    page: number,
    search: string,
    status: DeliveryStatus | 'ALL',
  ) {
    try {
      return await this.deleveryRepository.paginate(
        limit,
        page,
        search,
        status,
      );
    } catch (error) {
      this.logger.error('Failled to paginate deliveries', error.message);
      throw new BadRequestException('Failed to paginate delivery', {
        cause: error,
        description: error.message,
      });
    }
  }
}
