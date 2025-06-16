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
  @ApiProperty({
    example: 10,
    description:
      'Seuil critique du stock — en dessous de cette valeur, une alerte est déclenchée',
  })
  criticalStockThreshold: number;
  @ApiProperty({ example: 1.99, description: "Prix d'achat " })
  purchasePrice: number;

  @ApiProperty({ example: 100, description: 'Quantité en stock du produit' })
  stock: number;
  @ApiProperty({
    example: 'fa2c9f3e-1c6e-4b7e-b320-4e24685c97f4',
    description: 'ID de la catégorie du produit (peut être null)',
    required: false,
  })
  suplierId: string;
  @ApiProperty({
    example: 'fa2c9f3e-1c6e-4b7e-b320-4e24685c97f4',
    description: 'ID de la catégorie du produit (peut être null)',
    required: false,
  })
  categoryProductId?: string;
}
