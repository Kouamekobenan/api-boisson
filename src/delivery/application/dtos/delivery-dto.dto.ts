import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

export class DeliveryProductDto {
  @ApiProperty({
    description: 'ID du DeliveryProduct (uniquement pour mise à jour)',
    required: false,
  })
  id: string;

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
  @ApiProperty({
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
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
  deliveryPersonId?: string; 
  @ApiProperty({
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => DeliveryProductDto) 
  @ApiProperty({
    description: 'Liste des produits à livrer',
    type: [DeliveryProductDto],
  })
  deliveryProducts: DeliveryProductDto[];
}
