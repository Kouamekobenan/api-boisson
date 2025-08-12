import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeliveryPersonDto {
  @ApiProperty({ example: 'John Doe', description: 'Nom du livreur' })
  name: string;

  @ApiProperty({
    example: '+123456789',
    description: 'Numéro de téléphone du livreur',
    required: false,
  })
  phone?: string;
  @ApiProperty({
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
