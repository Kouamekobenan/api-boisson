import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';
@Injectable()
export class PaginateOrderUseCase {
  private readonly logger = new Logger(PaginateOrderUseCase.name);
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(page: number, limit: number, search:string, status:OrderStatus | 'ALL') {
    try {
      const orders = await this.orderRepository.paginate(
        page,
        limit,
        search,
        status,
      );
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
