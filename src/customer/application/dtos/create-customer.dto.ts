import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
