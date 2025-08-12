import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IOrderRepository } from '../application/interface/order-interface-repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderMapper } from '../domain/mappers/order-mapper.mapper';
import { OrderDto } from '../application/dtos/create-order-dto.dto';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderItemDto } from '../application/dtos/create-orderItm-dto.dto';
import { OrderStatus } from '../domain/enums/orderStatus.enum';
@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: OrderMapper,
  ) {}

  async createOrder(data: OrderDto): Promise<OrderEntity> {
    try {
      const dataToapplication = await this.mapper.toApplication(data);

      // Vérifier que l'utilisateur existe
      const existUser = await this.prisma.user.findUnique({
        where: { id: dataToapplication.userId },
      });

      if (!existUser) {
        throw new NotFoundException(`Cet utilisateur n'existe pas`);
      }

      // Création de la commande sans toucher au stock
      const newOrder = await this.prisma.order.create({
        data: {
          ...dataToapplication,
          status: OrderStatus.PENDING, // par défaut
          orderItems: {
            create: dataToapplication.orderItems.map((items: OrderItemDto) => ({
              productId: items.productId,
              quantity: items.quantity,
              unitPrice: items.unitPrice,
              totalPrice: items.quantity * items.unitPrice,
            })),
          },
        },
        include: { orderItems: true },
      });

      // Calcul du prix total
      const totalPrices = newOrder.orderItems.reduce(
        (t, i) => t + i.totalPrice.toNumber(),
        0,
      );

      const updatedOrder = await this.prisma.order.update({
        where: { id: newOrder.id },
        data: { totalPrice: totalPrices },
        include: { orderItems: true },
      });

      return this.mapper.toDomain(updatedOrder);
    } catch (error) {
      this.logger.error('Erreur création commande', error);
      throw new BadRequestException(`La création de la commande a échoué !`);
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    try {
      // DELETE ALLS ORDERITEMS
      await this.prisma.orderItem.deleteMany({
        where: { id: orderId },
      });

      await this.prisma.order.delete({
        where: { id: orderId },
      });
    } catch (error) {
      throw new BadRequestException(
        `error to during delete order: ${error.message}`,
      );
    }
  }
  async findOrderById(orderId: string): Promise<OrderEntity> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: { name: true, phone: true, email: true },
          },
          orderItems: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      });
      if (!order) {
        throw new NotFoundException(`order Id: ${orderId} not found!`);
      }
      return this.mapper.toDomain(order);
    } catch (error) {
      throw new BadRequestException(`error repo:${error}`);
    }
  }
  async paginate(
    tenantId: string,
    page: number,
    limit: number,
    search?: string,
    status?: OrderStatus | 'ALL',
  ): Promise<{
    data: OrderEntity[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Construction du filtre dynamique
      const where: any = { tenantId };

      if (search) {
        where.id = {
          contains: search,
          mode: 'insensitive', // pour ne pas être sensible à la casse
        };
      }
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.order.count({ where }),
      ]);

      const allOrder = orders.map((data) => this.mapper.toDomain(data));
      return {
        data: allOrder,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Échec de la pagination des commandes', error);
      throw new BadRequestException('Erreur lors de la pagination', {
        cause: error,
        description: error.message,
      });
    }
  }
  async canceled(id: string): Promise<OrderEntity> {
    try {
      const updateOrderSatus = await this.prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELED',
        },
      });
      return this.mapper.toDomain(updateOrderSatus);
    } catch (error) {
      throw new BadRequestException(`Failled to canceled order`, {
        cause: error,
        description: error.message,
      });
    }
  }
  async validate(id: string): Promise<OrderEntity> {
    try {
      // Récupérer la commande avec ses items
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) {
        throw new NotFoundException(`Commande ${id} introuvable`);
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          `Seules les commandes PENDING peuvent être validées`,
        );
      }

      // Mise à jour du stock
      for (const item of order.orderItems) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: Number(item.quantity) } },
        });
      }

      // Changer le statut
      const validatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: OrderStatus.COMPLETED },
        include: { orderItems: true },
      });

      return this.mapper.toDomain(validatedOrder);
    } catch (error) {
      throw new BadRequestException('Échec de la validation de la commande', {
        cause: error,
        description: error.message,
      });
    }
  }
}
