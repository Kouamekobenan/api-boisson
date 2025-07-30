import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginateCustomerDto {
  @ApiProperty({ example: 1, description: 'Page à afficher', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    example: 10,
    description: "Nombre d'éléments par page",
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
