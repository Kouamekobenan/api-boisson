import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
@Injectable()
export class PaginateOrderUseCase {
  private readonly logger = new Logger(PaginateOrderUseCase.name);
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(page: number, limit: number) {
    try {
      const orders = await this.orderRepository.paginate(page, limit);
      return orders;
    } catch (error) {
      this.logger.error('Failled to pagination orders', error.stack);
      throw new BadRequestException('Failled to pagination orders ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
