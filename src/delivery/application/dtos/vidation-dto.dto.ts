import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

export class ValidateDeliveryDto {
  @IsUUID() // Valide que deliveryProductId est un UUID
  @ApiProperty({ description: 'ID du produit associé à la livraison' })
  id: string;

  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Quantité du produit livré' })
  quantity: number;

  @ApiProperty({ description: 'Quantité de produit effectivement livrée' })
  deliveredQuantity: number;

  @ApiProperty({ description: 'Quantité de produit retournée' })
  returnedQuantity: number;
}

export class DeliveryDtos {
  @ApiProperty({
    description: 'Statut actuel de la livraison',
    example: 'PENDING',
    enum: DeliveryStatus,
  })
  status: DeliveryStatus;

  @ApiProperty({
    description: 'Liste des produits à livrer',
    type: [ValidateDeliveryDto],
  })
  deliveryProducts: ValidateDeliveryDto[];
}
