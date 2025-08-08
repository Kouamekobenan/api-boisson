import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PaginateDirecteSaleDto {
  @ApiProperty({ example: 1, description: 'Page à afficher', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNumber()
  page: number;

  @ApiProperty({
    example: 10,
    description: "Nombre d'éléments par page",
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNumber()
  limit: number;
}
