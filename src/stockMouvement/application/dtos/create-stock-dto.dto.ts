import { ApiProperty } from '@nestjs/swagger';
import { StockType } from 'src/stockMouvement/domain/enums/stock.enums';

export class StockDTO {
  @ApiProperty({
    description: 'Type du stock',
    enum: StockType,
    example: StockType.ENTRY, // Remplace par une valeur valide de ton enum
  })
  type: StockType;

  @ApiProperty({
    description: 'Quantité du stock',
    example: 100,
  })
  quantity: number;
}
