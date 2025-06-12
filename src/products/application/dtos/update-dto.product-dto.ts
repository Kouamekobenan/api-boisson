import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'Coca-Cola', description: 'Nom du produit' })
  name: string;

  @ApiProperty({
    example: 'Boisson gazeuse rafraîchissante',
    description: 'Description du produit',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1.99, description: 'Prix du produit en euros' })
  price: number;
  @ApiProperty({ example: 1.99, description: "Prix d'achat " })
  purchasePrice: number;

  @ApiProperty({ example: 100, description: 'Quantité en stock du produit' })
  stock: number;
}
