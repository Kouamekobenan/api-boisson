import { ApiProperty } from '@nestjs/swagger';
export class DashbordDto {
  @ApiProperty({
    description: 'Nombre total de ventes enregistrées',
    example: 120,
  })
  totalSales: number;

  @ApiProperty({
    description: 'Nombre total de livraisons effectuées',
    example: 85,
  })
  totalDeliveries: number;

  @ApiProperty({
    description: 'Montant total des revenus générés',
    example: 15400.75,
  })
  totalRevenue: number;
  @ApiProperty({
    description: "Nombre de ventes réalisées aujourd'hui",
    example: 12,
  })
  salesToday: number;

  @ApiProperty({
    description: "Nombre de livraisons effectuées aujourd'hui",
    example: 8,
  })
  deliveriesToday: number;
}
