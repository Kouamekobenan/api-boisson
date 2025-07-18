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

      for (const item of dataToapplication.orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product) {
          throw new BadRequestException(
            `Le produit ${item.productId} n'existe pas.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuffisant pour le produit ${item.productId}. Stock actuel : ${product.stock}, demandé : ${item.quantity}`,
          );
        }
      }

      const result = await this.prisma.$transaction(async (prisma) => {
        const existUser = await this.prisma.user.findUnique({
          where: { id: dataToapplication.userId },
        });

        if (!existUser) {
          throw new NotFoundException(
            `cet utilisteur n\'exist pas ${existUser}`,
          );
        }
        // Création de la commande
        const newOrder = await prisma.order.create({
          data: {
            ...dataToapplication,
            orderItems: {
              create: dataToapplication.orderItems.map(
                (items: OrderItemDto) => ({
                  productId: items.productId,
                  quantity: items.quantity,
                  unitPrice: items.unitPrice,
                  totalPrice: items.quantity * items.unitPrice,
                }),
              ),
            },
          },
          include: { orderItems: true },
        });

        if (!newOrder || !newOrder.id) {
          throw new BadRequestException(
            'erreur lors de la creation de commande',
          );
        }
        // calcule le prix total
        const totalPrices = newOrder.orderItems.reduce(
          (t, i) => t + i.totalPrice.toNumber(),
          0,
        );
        const updateOrderTotalPrice = await prisma.order.update({
          where: { id: newOrder.id },
          data: {
            totalPrice: totalPrices,
          },
          include: {
            orderItems: true,
          },
        });
        // Mise à jour du stock des produits
        for (const item of dataToapplication.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return updateOrderTotalPrice;
      });
      return this.mapper.toDomain(result);
    } catch (error) {
      console.error('error repo:', error);
      throw new BadRequestException(`la création de la vente à échoué!`);
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
      const where: any = {};

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
      const validateOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
      });
      return this.mapper.toDomain(validateOrder);
    } catch (error) {
      throw new BadRequestException('Failled to completed order', {
        cause: error,
        description: error.message,
      });
    }
  }
}
