import { OrderEntity } from 'src/order/domain/entities/order.entity';
import { OrderDto } from '../dtos/create-order-dto.dto';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';

export interface IOrderRepository {
  createOrder(data: OrderDto): Promise<OrderEntity>;
  deleteOrder(orderId: string): Promise<void>;
  findOrderById(orderId: string): Promise<OrderEntity>;
  paginate(
    tenantId:string,
    page: number,
    limit: number,
    search:string,
    status:OrderStatus | 'ALL'
  ): Promise<{
    data: OrderEntity[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;

  canceled(id: string): Promise<OrderEntity>;
  validate(id: string): Promise<OrderEntity>;
  // orderInvoice(id: string): Promise<OrderEntity>;
}
