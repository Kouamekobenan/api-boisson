import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

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
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
