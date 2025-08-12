import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nom du tenant (organisation ou entreprise)',
    example: 'OpenAI Inc.',
  })
  name: string;
}
