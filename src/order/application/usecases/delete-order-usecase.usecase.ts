import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';

@Injectable()
export class DeleteOderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: string): Promise<{ mess: string }> {
    try {
      // catch error does not exist
      await this.orderRepository.findOrderById(orderId);

      await this.orderRepository.deleteOrder(orderId);
      return { mess: 'Order deleted successfully!' };
    } catch (error) {
      throw new BadGatewayException(`error use-case: ${error.message}`);
    }
  }
}
