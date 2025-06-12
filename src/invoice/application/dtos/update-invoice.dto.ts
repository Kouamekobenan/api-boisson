import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateInvoiceDto{
      @ApiProperty({
        description: 'Prix total de la facture',
        example: 199.99,
      })
      @IsNumber()
      totalPrice: number;
}