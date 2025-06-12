import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  // @ApiProperty({
  //   description: 'ID du produit',
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  // })
  // @IsUUID()
  // orderId: string;
  @ApiProperty({
    description: 'ID du produit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantité du produit commandé',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Prix unitaire du produit',
    example: 50.25,
  })
  @IsNumber({ maxDecimalPlaces: 2 }) // ✅ Remplace @IsDecimal()
  @Type(() => Number) // ✅ Transforme la valeur reçue en `number`
  unitPrice: number;

  // @ApiProperty({
  //   description: 'Prix total',
  //   example: 50.25,
  // })
  // @IsNumber({ maxDecimalPlaces: 2 }) // ✅ Remplace @IsDecimal()
  // @Type(() => Number) // ✅ Transforme la valeur reçue en `number`
  // totalPrice: number;
}
