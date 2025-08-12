import { ProductEntity } from 'src/products/domain/entities/product.entity';
import { Delivery } from './delivery.entity';

export class DeliveryProduct {
  constructor(
    private readonly id: string,
    private deliveryId: string,
    private productId: string,
    private quantity: number,
    private createdAt: Date = new Date(),
    private deliveredQuantity: number, // Quantité effectivement livrée
    private returnedQuantity: number,
    private tenantId: string | null,
    private delivery?: Delivery,
    private product?: ProductEntity,
    // Quantité retournée
  ) {}

  getId(): string {
    return this.id;
  }
  get TenantId():string | null{
    return this.tenantId
  }

  getDeliveryId(): string {
    return this.deliveryId;
  }
  getDeliveredQuantity(): number {
    return this.deliveredQuantity;
  }

  getReturnedQuantity(): number {
    return this.returnedQuantity;
  }
  getQuantity(): number {
    return this.quantity;
  }
  getProductId(): string {
    return this.productId;
  }

  static create(
    deliveryId: string,
    productId: string,
    quantity: number,
    deliveredQuantity: number,
    returnedQuantity: number,
    tenantId: string,
  ): DeliveryProduct {
    return new DeliveryProduct(
      crypto.randomUUID(),
      deliveryId,
      productId,
      quantity,
      new Date(),
      deliveredQuantity,
      returnedQuantity,
      tenantId,
    );
  }
}
