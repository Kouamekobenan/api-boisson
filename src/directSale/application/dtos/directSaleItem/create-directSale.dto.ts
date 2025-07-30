import { IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DirectSaleItemDto {
  @ApiProperty({
    description: 'ID de la vente directe associée',
    example: 'd13f1a2b-4567-4e8f-a09e-1a2c3d4e5f6a',
  })
  @IsUUID()
  @IsNotEmpty()
  directSaleId: string;

  @ApiProperty({
    description: 'ID du produit vendu',
    example: 'a3fbc2d1-9876-4321-aabb-ccddeeff0011',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantité du produit vendu',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Prix unitaire du produit',
    example: 1500,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  unitPrice: number;
}
