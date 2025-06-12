import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
import { OrderDto } from '../dtos/create-order-dto.dto';
import { OrderEntity } from 'src/order/domain/entities/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(data: OrderDto): Promise<OrderEntity> {
    try {
      return await this.orderRepository.createOrder(data);
    } catch (error) {
      console.log('use-case:', error);
      throw new BadRequestException(`error use-case: ${error.message}`);
    }
  }
}
