import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
import { OrderEntity } from 'src/order/domain/entities/order.entity';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';

@Injectable()
export class ValidateOrderUseCase {
  private readonly logger = new Logger(ValidateOrderUseCase.name);
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(id: string): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.findOrderById(id);
      if (!order) {
        throw new NotFoundException(`ID:${id} of order not found`);
      }
      if (order.getStatus() !== OrderStatus.PENDING) {
        throw new ConflictException('Only order an pending can to completed');
      }
      const orders = await this.orderRepository.validate(id);
      this.logger.log('data order', JSON.stringify(orders));
      return orders;
    } catch (error) {
      this.logger.error('Failled to completed that order:', error);
      throw  error;
    }
  }
}
