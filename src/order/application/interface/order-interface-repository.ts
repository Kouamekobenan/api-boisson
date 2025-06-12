import { OrderEntity } from 'src/order/domain/entities/order.entity';
import { OrderDto } from '../dtos/create-order-dto.dto';

export interface IOrderRepository {
  createOrder(data: OrderDto): Promise<OrderEntity>;
  deleteOrder(orderId: string): Promise<void>;
  findOrderById(orderId: string): Promise<OrderEntity>;
}
