import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';
export class CreateCreditPaymentDto {
  @ApiProperty({
    description: 'Identifiant de la vente directe (DirectSale)',
    example: '8a2f5b29-9e27-4b55-9dcf-041a7cd23b27',
  })
  @IsUUID()
  directSaleId: string;

  @ApiProperty({
    description: 'Montant du paiement',
    example: 5000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
