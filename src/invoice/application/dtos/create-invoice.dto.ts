import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber } from 'class-validator';
export class CreateInvoiceDto {
  @ApiProperty({
    description: 'ID de la commande liée à la facture',
    example: '1f8b5b1e-2f7b-4a0f-9f0e-5d2f6e7c3e87',
  })
  @IsUUID()
  orderId: string;
  @ApiProperty({
    description: 'Prix total de la facture',
    example: 199.99,
  })
  @IsNumber()
  totalPrice: number;
}
