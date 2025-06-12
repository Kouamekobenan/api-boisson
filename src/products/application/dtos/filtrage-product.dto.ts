// application/dtos/filter-product.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  supplierId?: string;

  @ApiPropertyOptional()
  inStock?: boolean;
}
