import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IOrderRepository } from '../interface/order-interface-repository';
import { OrderEntity } from 'src/order/domain/entities/order.entity';
import { OrderStatus } from 'src/order/domain/enums/orderStatus.enum';

@Injectable()
export class CanceledOrderUseCase {
  private logger = new Logger(CanceledOrderUseCase.name);
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  async execute(id: string): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.findOrderById(id);
      if (!order) {
        throw new NotFoundException(`order by ID ${id} not found`);
      }
      if (order.getStatus() !== OrderStatus.PENDING) {
        throw new ConflictException(
          'Seules les commandes en attente peuvent être annulées',
        );
      }
      const orders = await this.orderRepository.canceled(id);
      this.logger.log(`Commande annulée : ${JSON.stringify(orders)}`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Échec de l’annulation de la commande : ${error.message}`,
        error.stack,
      );
      throw error; // relance l’erreur d’origine (Conflict, BadRequest, etc.)
    }
  }
}
