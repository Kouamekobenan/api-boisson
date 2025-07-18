import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';

export class PaginateDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
