import { OrderEntity } from '../entities/order.entity';
import { Order as dataPrisma } from '@prisma/client';
import { OrderStatus } from '../enums/orderStatus.enum';
import { OrderDto } from 'src/order/application/dtos/create-order-dto.dto';
import { OrderItemDto } from 'src/order/application/dtos/create-orderItm-dto.dto';
export class OrderMapper {
  toDomain(dataPrisma: any): OrderEntity {
    return new OrderEntity(
      dataPrisma.id,
      dataPrisma.userId,
      dataPrisma.status as OrderStatus,
      dataPrisma.totalPrice.toNumber(),
      dataPrisma.createdAt,
      dataPrisma.updatedAt,
      dataPrisma.orderItems?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice.toNumber(),
        // Ajout du nom du produit depuis la relation
        productName: item.product?.name,
      })) || [],
      // Ajout du nom de l'utilisateur depuis la relation
      dataPrisma.user?.name,
      dataPrisma.user?.email,
      dataPrisma.user?.phone,
    );
  }
  toApplication(dataDto: OrderDto): any {
    return {
      userId: dataDto.userId,
      status: dataDto.status,
      totalPrice: dataDto.totalPrice,
      orderItems: dataDto.orderItems.map((p: OrderItemDto) => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.quantity * p.unitPrice,
      })),
    };
  }
}
