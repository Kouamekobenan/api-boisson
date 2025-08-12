import { DeliveryDto } from 'src/delivery/application/dtos/delivery-dto.dto';
import { Delivery } from '../entities/delivery.entity';
import { UpdateDeliveryDto } from 'src/delivery/application/dtos/update-delivery-dto.dto';
import { DeliveryStatus } from '../enums/deliveryStatus.enums';
import { DeliveryProduct } from '../entities/delivery-product-entity';

export class DeliveryMapper {
  stringUndefined = 'Inconnu';
  toDomain(dataDelivery: any): Delivery {
    return new Delivery(
      dataDelivery.id,
      dataDelivery.deliveryPersonId ?? this.stringUndefined,
      dataDelivery.status,
      dataDelivery.createdAt,
      dataDelivery.tenantId,
      dataDelivery.deliveryPerson,
      dataDelivery.deliveryProducts,
    );
  }
  //
  toApplication(dto: DeliveryDto): Delivery {
    return new Delivery(
      crypto.randomUUID(),
      dto.deliveryPersonId || this.stringUndefined,
      dto.status,
      new Date(),
      dto.tenantId,
      undefined,
      dto.deliveryProducts?.map(
        (p) =>
          new DeliveryProduct(
            p.id, // Générer un ID unique
            'DELIVERY_ID_TEMP', // Remplacer plus tard par l'ID de la livraison
            p.productId, // ID du produit
            p.quantity, // Quantité
            new Date(),
            p.deliveredQuantity,
            p.returnedQuantity,
            p.tenantId,
            // Date actuelle
          ),
      ) ?? [],
      // []
    );
  }

  toUpdate(dataToUpdate: UpdateDeliveryDto): any {
    return {
      status: dataToUpdate.status as DeliveryStatus,
    };
  }
}
