import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';
import { OrderItemDto } from './create-orderItm-dto.dto';

export class OrderDto {
  @ApiProperty({
    description: "ID de l'utilisateur",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Statut de la commande',
    enum: OrderStatus,
    example: 'PENDING',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'Prix total de la commande', example: 150.75 })
  @IsDecimal()
  @Type(() => Number)
  totalPrice: number;

  @ApiProperty({
    description: 'Liste des articles de la commande',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
