import { DeliveryStatus } from '../enums/deliveryStatus.enums';
import { DeliveryPerson } from 'src/deliveryPerson/domain/entities/deliveryPerson';
import { DeliveryProduct } from './delivery-product-entity';
import { StockEntity } from 'src/stockMouvement/domain/entities/stock.entity';

export class Delivery {
  constructor(
    private readonly id: string,
    private deliveryPersonId: string,
    private status: DeliveryStatus,
    private createdAt: Date = new Date(),
    private deliveryPerson?: DeliveryPerson[],
    private deliveryProducts: DeliveryProduct[] = [],
    // private stockMovements: StockEntity[] = [],
  ) {}

  public getDeliveryProducts(): DeliveryProduct[] {
    return this.deliveryProducts;
  }

  getStatus(): DeliveryStatus {
    return this.status;
  }
  getDeliveryPersonId(): string {
    return this.deliveryPersonId;
  }
  // static create(deliveryPersonId?: string): Delivery {
  //   return new Delivery(
  //     crypto.randomUUID(), // Générer un UUID pour simuler Prisma
  //     getDeliveryPersonId(),
  //     DeliveryStatus.IN_PROGRESS,
  //     new Date(),
  //     undefined,
  //     // [],
  //     // []
  //   );
  // }

  completeDelivery(): void {
    if (this.status !== DeliveryStatus.IN_PROGRESS) {
      throw new Error('La livraison doit être en cours pour être complétée.');
    }
    this.status = DeliveryStatus.COMPLETED;
  }

  cancelDelivery(): void {
    if (this.status === DeliveryStatus.COMPLETED) {
      throw new Error('Une livraison complétée ne peut pas être annulée.');
    }
    this.status = DeliveryStatus.CANCELED;
  }
}
