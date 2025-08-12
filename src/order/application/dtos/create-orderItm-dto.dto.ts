import { IsUUID, IsInt, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
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
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Type(() => Number) 
  unitPrice: number;
    // @ApiProperty({
    //   description: 'Identifiant du tenant',
    //   example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
    // })
    // @IsUUID()
    // @IsNotEmpty()
    // tenantId: string;
}
