import { OrderStatus } from '../enums/orderStatus.enum';
import { orderItemEntity } from './orderItem.entity';

export class OrderEntity {
  constructor(
    private readonly id: string,
    private userId: string,
    private status: OrderStatus,
    private totalPrice: number,
    private createdAt: Date,
    private updatedAt: Date,
    private orderItems: orderItemEntity[] = [],
    private userName?: string,
    private userMail?:string,
    private userPhone?:string,
  ) {}

  public getOrderItems(): orderItemEntity[] {
    return this.orderItems;
  }

  calculeTotalPrice(): number {
    return this.orderItems.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }
  getId(): string {
    return this.id;
  }
  getStatus(): OrderStatus {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }
}
