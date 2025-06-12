import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

export class DeliveryProductDto {
  @ApiProperty({
    description: 'ID du DeliveryProduct (uniquement pour mise à jour)',
    required: false,
  })
  id: string; // Facultatif pour la mise à jour

  @IsUUID()
  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Quantité du produit livré' })
  quantity: number;

  @ApiProperty({
    description: 'Quantité de produit effectivement livrée',
    default: 0,
  })
  deliveredQuantity: number = 0;

  @ApiProperty({ description: 'Quantité de produit retournée', default: 0 })
  returnedQuantity: number = 0;
}

export class DeliveryDto {
  @IsEnum(DeliveryStatus)
  @ApiProperty({
    description: 'Statut actuel de la livraison',
    example: 'PENDING',
    enum: DeliveryStatus,
  })
  status: DeliveryStatus;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID de la personne en charge de la livraison (facultatif)',
    required: false,
  })
  deliveryPersonId?: string; // ✅ Ajout du champ pour correspondre à l'entité

  @IsArray()
  @ValidateNested({ each: true }) // ✅ Assure que chaque élément de `deliveryProducts` est bien un `DeliveryProductDto`
  @Type(() => DeliveryProductDto) // ✅ Permet de transformer correctement les objets JSON reçus
  @ApiProperty({
    description: 'Liste des produits à livrer',
    type: [DeliveryProductDto],
  })
  deliveryProducts: DeliveryProductDto[];
}
