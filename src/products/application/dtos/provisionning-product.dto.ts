import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ProvisionningDto {
  @ApiPropertyOptional({
    description: 'Identifiant du fournisseur',
    example: 'supplier_123',
  })
  @IsOptional()
  @IsString({ message: 'supplierId doit être une chaîne de caractères' })
  supplierId?: string;

  @ApiPropertyOptional({
    description: 'Quantité à approvisionner',
    example: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'quantity doit être un nombre' })
  stock?: number;
}
