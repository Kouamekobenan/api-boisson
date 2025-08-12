import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SupplierDto {
  @ApiProperty({
    description: 'Nom du fournisseur',
    example: 'ABC Distributions',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    description: 'Email du fournisseur',
    example: 'contact@abc.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Numéro de téléphone du fournisseur',
    example: '+33612345678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
