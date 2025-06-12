import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
import { OrderEntity } from 'src/order/domain/entities/order.entity';

@Injectable()
export class FindOrderByIdUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(orderId: string): Promise<OrderEntity> {
    try {
      return this.orderRepository.findOrderById(orderId);
    } catch (error) {
      throw new BadRequestException(`error an use-case: ${error.message}`);
    }
  }
}
