import { ApiProperty } from '@nestjs/swagger';

export class CategoryProductDto {
  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Boissons',
  })
  name: string;
}
