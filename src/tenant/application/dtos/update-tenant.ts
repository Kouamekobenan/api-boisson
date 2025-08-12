import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTenantDto {
  @ApiPropertyOptional({
    description: 'Nom du tenant (organisation)',
    example: 'OpenAI Inc.',
  })
  name?: string;
}
