import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DirectSaleItemDto } from '../directSaleItem/create-directSale.dto';

export class CreateDirectSaleDto {
  @ApiProperty({
    description: 'ID du vendeur (peut être optionnel)',
    example: 'e1f6c90e-61cd-4a4e-9d4f-3a5e7896d0b1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sellerId: string;

  @ApiProperty({
    description: 'ID du client (peut être optionnel)',
    example: 'c5dba55c-7b88-4211-b5a4-bf8cbcf5d3b4',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'Prix total de la vente',
    example: 4500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({
    description: 'La vente est-elle à crédit ?',
    example: false,
  })
  @IsBoolean()
  isCredit: boolean;

  @ApiProperty({
    description: 'Montant payé immédiatement',
    example: 2000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amountPaid: number;
  @ApiProperty({
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty({
    description: 'Liste des articles vendus',
    type: [DirectSaleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectSaleItemDto)
  saleItems: DirectSaleItemDto[] = [];
}
