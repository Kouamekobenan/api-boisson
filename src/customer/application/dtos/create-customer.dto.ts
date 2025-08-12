import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nom du client',
    example: 'Jean Dupont',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone du client',
    example: '+2250700000000',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Adresse email du client',
    example: 'jean.dupont@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Adresse physique du client',
    example: 'Abidjan, Cocody Riviera',
  })
  address?: string;
  
    @ApiProperty({
      description: 'Identifiant du tenant',
      example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
    })
    @IsUUID()
    @IsNotEmpty()
    tenantId: string;
}
